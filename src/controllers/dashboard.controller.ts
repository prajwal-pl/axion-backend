import { type RequestHandler } from "express";

export const getAIResponse: RequestHandler = (req, res) => {
  try {
    res.status(200).json({ message: "AI response" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
