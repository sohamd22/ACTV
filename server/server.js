// index.js
import { GoogleGenerativeAI } from "@google/generative-ai";

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import User from './models/userModel.js';
import { config } from 'dotenv';
config();

const app = express();

// Database
mongoose.connect(process.env.ATLAS_URI)
.then(() => { console.log("Connected to MongoDB Successfully"); })
.catch((err) => { console.error(err); });

// Middleware
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const functionDeclarations = [
  {
    name: 'createTrainingPlan',
    parameters: {
      type: 'OBJECT',
      description: 'Generates a concise personalized training plan with proper distance and workout info and nutrition advice.',
      properties: {
          message: {
              type: 'STRING',
              description: 'Details about why you chose that training plan based on user info.'
          },
          trainingPlan: {
            type: 'ARRAY', // Array of days with workout details
            description: 'Detailed training plan for the upcoming week.',
            items: {
              type: 'OBJECT',
              properties: {
                day: {
                  type: 'STRING',
                  description: 'Day of the week',
                },
                am: {
                  type: 'OBJECT',
                  description: 'Morning workout session',
                  properties: {
                    task: { type: 'STRING', description: 'Name of the workout, details like - sets, time, pace, HR zone, rest, recovery or distance for the workout' },
                    recommendations: { type: 'ARRAY', 
                      items: {
                        type: "STRING",
                        description: 'Recommendations like nutritions, weather/time-of-day etc' },
                    },
                    checklist: { type: 'ARRAY', 
                      items: {
                        type: "STRING",
                        description: 'Items for a checklist to prepare for the task, short and sweet.' },
                      }
                    }
                        
                  },
                  pm: {
                    type: 'OBJECT',
                    description: 'Evening workout session',
                    properties: {
                      task: { type: 'STRING', description: 'Name of the workout, details like - sets, time, pace, HR zone, rest, recovery or distance for the workout.' },
                      recommendations: { type: 'ARRAY', 
                        items: {
                          type: "STRING",
                          description: 'Recommendations like nutritions, weather/time-of-day etc' 
                        },
                      },
                      checklist: { type: 'ARRAY', 
                        items: {
                          type: "STRING",
                          description: 'Items for a checklist to prepare for the task, short and sweet.' },
                        }
                      }
                },
                },
            },
          },
      },
      required: ['trainingPlan'],
    },
  },
  {
      name: 'createMealPlan',
      parameters: {
        type: 'OBJECT',
        description: 'Generates a meal plan based on the workouts, considering macros.',
        properties: {
          message: {
            type: 'STRING',
            description: 'Details about why you chose that meal plan based on user info.',
          },
          mealPlans: {
            type: 'ARRAY', // Array of meals
            description: 'List of meal recipes for the upcoming week.',
            items: {
              type: 'OBJECT',
              properties: {
                mealName: { type: 'STRING', description: 'Name of the meal' },
                ingredients: {
                  type: 'ARRAY',
                  items: { type: 'STRING' },
                  description: 'List of ingredients',
                },
                macros: {
                  type: 'OBJECT',
                  properties: {
                    calories: { type: 'NUMBER', description: 'Total calories' },
                    protein: { type: 'NUMBER', description: 'Protein in grams' },
                    carbs: { type: 'NUMBER', description: 'Carbohydrates in grams' },
                    fat: { type: 'NUMBER', description: 'Fat in grams' },
                  },
                },
                recipe: {
                  type: 'ARRAY',
                  items: { type: 'STRING', description: 'A step in the recipe' },
                  description: 'Steps of recipe',
                },
              },
            },
          },
        },
        required: ['mealPlans'],
      },
  }
]

const getImageUrl = async (name) => {
  const result = await axios.get(`https://pixabay.com/api/?key=46250428-bf5d707579ccde79f9a5a6d4e&q=${name}&image_type=photo`);
  return result.data.hits[0].webformatURL;
}

const functions = {
  createMealPlan: async (args) => {
    console.log(args);
    const message = args.message;
    const mealPlans = args.mealPlans;
    for (const meal of mealPlans) {
      meal.imageUrl = await getImageUrl(meal.mealName);
    }
    return {name: 'createMealPlan', args: {message, mealPlans}};
  },
}

const generativeModel = genAI.getGenerativeModel({
  // Use a model that supports function calling, like a Gemini 1.5 model
  model: "gemini-1.5-flash",

  // Specify the function declaration.
  tools: {
    functionDeclarations,
  },
  generationConfig: {
    temperature: 0.3
  }
});

// Function to create a JWT
const createToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '7d' }); // Token expires in 7 days
};

// Protect routes middleware
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  
  if (!token) {
    return res.status(403).send('No token provided.');
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(500).send('Failed to authenticate token.');
    }
    req.user = decoded; // Save user info in request
    next();
  });
};

// Helper function to generate the prompt for the LLM
function generatePrompt(userMessage, workoutHistory) {
    const workoutHistoryJSON = JSON.stringify(workoutHistory);
  
    const prompt = `
  You are a fitness and nutrition coach that uses function calling.
  
  User's Workout History:
  ${workoutHistoryJSON}
  
  User's Message:
  ${userMessage}
  
  Based on the user's message, decide what to do.
  Don't ask questions unless really required, just function call to either createTrainingPlan or createMealPlan

  Respond in a clear and supportive tone.
  `;
  
    return prompt;
  }
  
// Routes
// POST /chat

const chat = generativeModel.startChat();

app.post('/chat', async (req, res) => {
  const message = req.body.message;
  const username = req.body.username;

  const user = await User.findOne({ username });

  // Generate prompt
  const prompt = generatePrompt(message, user.userData);

  try {
    // Use function calling to get structured data from the assistant
    const result = await chat.sendMessage(prompt);

    const call = result.response.functionCalls();
    if (call) {
      // Parse the assistant's function call
      const functionArgs = call[0].args;

      // Here you can process the functionArgs as needed
      // For demonstration, we'll send them back to the user
      if (call[0].name in functions) {
        console.log(call[0].name);
        const data = await functions[call[0].name](functionArgs);
        res.json(data);
        return;
      }

      res.json(call);
      return;
      } 
      else {
        res.json({name: "reply", args: { message: result.response.text() }});
      }
  } catch (error) {
    console.error('Error communicating with LLM:', error);
    res.status(500).json({ error: 'Failed to get response from the AI assistant.' });
  }
});

app.get('/auth/strava', (req, res) => {
  const authUrl = `https://www.strava.com/oauth/authorize?client_id=${process.env.STRAVA_CLIENT_ID}&response_type=code&redirect_uri=${process.env.STRAVA_REDIRECT_URI}&scope=read,activity:read_all`;
  res.redirect(authUrl);
});

// Handle Strava callback
app.get('/auth/strava/callback', async (req, res) => {
  const { code } = req.query;

  try {
    // Exchange authorization code for access token
    const tokenResponse = await axios.post('https://www.strava.com/oauth/token', {
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      code: code,
      grant_type: 'authorization_code'
    });

    const { access_token, athlete } = tokenResponse.data;

    // Generate a JWT with the access token and athlete info
    const token = createToken({ accessToken: access_token, athleteId: athlete.id });

    const username = athlete.username;

    const user = await User.findOne({ username });
    if (!user) {
      const userData = (await axios.get('https://www.strava.com/api/v3/athlete/activities', {
        headers: { Authorization: `Bearer ${access_token}` }
      })).data;
      await User.create({ username, userData });
    }
    else {
      user.userData = (await axios.get('https://www.strava.com/api/v3/athlete/activities', {
        headers: { Authorization: `Bearer ${access_token}` }
      })).data;
      await user.save();
    }

    // Redirect to the React frontend with the token in query string
    res.redirect(`http://localhost:3000/auth/callback?token=${token}&username=${username}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Authentication failed');
  }
});

// Start server
const port = process.env.PORT || 3003;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});