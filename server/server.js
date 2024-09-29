// index.js
import OpenAI from 'openai';

import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { config } from 'dotenv';
config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for workout histories
let workoutHistories = {}; // Key: userId, Value: array of workout data

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Routes

// POST /upload-workout
app.post('/upload-workout', (req, res) => {
  const { userId, workoutData } = req.body;

  if (!userId || !workoutData) {
    return res.status(400).json({ error: 'userId and workoutData are required.' });
  }

  // Initialize user's workout history array if it doesn't exist
  if (!workoutHistories[userId]) {
    workoutHistories[userId] = [];
  }

  // Add the new workout data
  workoutHistories[userId].push(workoutData);

  res.json({ status: 'Workout data uploaded successfully.' });
});

// Helper function to generate the prompt for the LLM
function generatePrompt(userMessage, workoutHistory) {
    const workoutHistoryJSON = JSON.stringify(workoutHistory);
  
    const prompt = `
  You are a virtual fitness and nutrition coach.
  
  User's Workout History:
  ${workoutHistoryJSON}
  
  User's Message:
  ${userMessage}
  
  Based on the user's message, decide whether to provide a personalized training plan or meal recipes for the upcoming week, but not both. If the user asks about a training plan, provide only the training plan. If the user asks about meal plans, provide only the meal recipes. Consider the user's workout history and adjust your response accordingly.
  
  Respond in a clear and supportive tone.
  `;
  
    return prompt;
  }
  

// POST /chat
app.post('/chat', async (req, res) => {
  const { userId, message } = req.body;

  if (!userId || !message) {
    return res.status(400).json({ error: 'userId and message are required.' });
  }

  // Fetch user's workout history
  const userWorkoutHistory = workoutHistories[userId] || [];

  // Generate prompt
  const prompt = generatePrompt(message, userWorkoutHistory);

  try {
    // Use function calling to get structured data from the assistant
    const aiResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Use 'gpt-4' if you have access
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.0,
      functions: [
        {
          name: 'createTrainingPlan',
          description: 'Generates a concise personalized training plan with proper distance and workout info and nutrition advice.',
          parameters: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    description: 'Details about why you chose that training plan based on user info.'
                },
              trainingPlan: {
                type: 'array', // Array of days with workout details
                description: 'Detailed training plan for the upcoming week.',
                items: {
                  type: 'object',
                  properties: {
                    day: {
                      type: 'string',
                      description: 'Day of the week',
                    },
                    am: {
                      type: 'object',
                      description: 'Morning workout session',
                      properties: {
                        task: { type: 'string', description: 'Name of the workout, details like - sets, time, pace, HR zone, rest, recovery or distance for the workout' },
                        nutrition: { type: 'string', description: 'Nutrition intake for during the workout like - exact amount of carbs, salts, electrolytes or water to consume before, during, or after the workout' },
                        recommendations: { type: 'string', description: 'Any recommendations to take depending on the weather, time of the day, or any gear to carry with reason. keep this short and remove extra words, almost like a checklist' },
                      },
                      required: ['name', 'nutrition', 'recommendations'],
                    },
                    pm: {
                      type: 'object',
                      description: 'Evening workout session',
                      properties: {
                        task: { type: 'string', description: 'Name of the workout, details like - sets, time, HR zone, rest, recovery or distance for the workout' },
                        nutrition: { type: 'string', description: 'Nutrition intake for during the workout like - exact amount of carbs, salts, electrolytes or water to consume before, during or after the workout' },
                        recommendations: { type: 'string', description: 'Any recommendations to take depending on the weather, time of the day, or any gear to carry. keep this short and remove extra words, almost like a checklist' },
                      },
                      required: ['name', 'nutrition', 'precautions'],
                    },
                  },
                  required: ['day', 'am', 'pm'],
                },
              },
            },
            required: ['trainingPlan'],
          },
        },
        {
            name: 'createMealPlan',
            description: 'Generates a meal plan based on the workouts, considering macros.',
            parameters: {
              type: 'object',
              properties: {
                mealPlans: {
                  type: 'array', // Array of meals
                  description: 'List of meal recipes for the upcoming week.',
                  items: {
                    type: 'object',
                    properties: {
                      mealName: { type: 'string', description: 'Name of the meal' },
                      ingredients: {
                        type: 'array',
                        items: { type: 'string' },
                        description: 'List of ingredients',
                      },
                      macros: {
                        type: 'object',
                        properties: {
                          calories: { type: 'number', description: 'Total calories' },
                          protein: { type: 'number', description: 'Protein in grams' },
                          carbs: { type: 'number', description: 'Carbohydrates in grams' },
                          fat: { type: 'number', description: 'Fat in grams' },
                        },
                        required: ['calories', 'protein', 'carbs', 'fat'],
                      },
                      instructions: { type: 'string', description: 'Cooking instructions' },
                    },
                    required: ['mealName', 'ingredients', 'macros', 'instructions'],
                  },
                },
              },
              required: ['mealPlans'],
            },
        },
      ],
      function_call: { "name": "auto" }, // Updated function name
    });

    const responseMessage = aiResponse.choices[0].message;

    if (responseMessage.function_call) {
      // Parse the assistant's function call
      const functionArgs = JSON.parse(responseMessage.function_call.arguments);

      // Here you can process the functionArgs as needed
      // For demonstration, we'll send them back to the user

      res.json({
        reply: 'Here is your personalized training plan and advice.',
        data: functionArgs,
      });
    } else {
      res.json({ reply: responseMessage.content });
    }
  } catch (error) {
    console.error('Error communicating with LLM:', error);
    res.status(500).json({ error: 'Failed to get response from the AI assistant.' });
  }
});

// Start server
const port = process.env.PORT || 3003;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});