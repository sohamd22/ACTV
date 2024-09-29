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
You are a virtual fitness coach.

User's Workout History:
${workoutHistoryJSON}

User's Message:
${userMessage}

Based on the user's workout history and message, provide a personalized training plan for the upcoming week, including workout suggestions, nutrition advice, and any precautions. Also, consider recovery needs and weather conditions.

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
      temperature: 0.7,
      functions: [
        {
          name: 'createTrainingPlan',
          description: 'Generates a personalized training plan and nutrition advice.',
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
                        name: { type: 'string', description: 'Name of the workout' },
                        nutrition: { type: 'string', description: 'Nutrition advice for the workout' },
                        precautions: { type: 'string', description: 'Any precautions to take' },
                      },
                      required: ['name', 'nutrition', 'precautions'],
                    },
                    pm: {
                      type: 'object',
                      description: 'Evening workout session',
                      properties: {
                        name: { type: 'string', description: 'Name of the workout' },
                        nutrition: { type: 'string', description: 'Nutrition advice for the workout' },
                        precautions: { type: 'string', description: 'Any precautions to take' },
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
      ],
      function_call: { name: 'createTrainingPlan' }, // Updated function name
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