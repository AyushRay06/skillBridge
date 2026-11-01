import "dotenv/config";
import { ChatGoogle } from "@langchain/google";

const apiKey = process.env.GEMINI_API_KEY;

// Fast model — parsing, scoring, email drafting
export const flashModel = new ChatGoogle({
  model: "gemini-flash-lite-latest",
  apiKey, 
  temperature: 0.3,
});

// Quality model — resume generation, cover letters
export const proModel = new ChatGoogle({
  model: "gemini-flash-lite-latest",
  apiKey,
  temperature: 0.4,
});
