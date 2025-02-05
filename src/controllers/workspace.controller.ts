import type { RequestHandler } from "express";
import Groq from "groq-sdk";
import { BASE_PROMPT, getSystemPrompt } from "../lib/prompts";
import { basePrompt as nodeBasePrompt } from "../lib/defaults/node.ts";
import { basePrompt as reactBasePrompt } from "../lib/defaults/react.ts";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const TemplateFunction: RequestHandler = async (req, res) => {
  const { prompt } = req.body;
  try {
    const completion = await groq.chat.completions.create({
      max_tokens: 200,
      messages: [
        {
          role: "user",
          content: prompt,
        },
        {
          role: "assistant",
          content:
            "Just reply whether the query from the user requests a 'react' or 'node' project, do not specify anything else other than the two keywords.Also exclude any other information that is not relevant to the user's query, like /n , etc",
        },
      ],
      model: "llama-3.3-70b-versatile",
    });
    const response = completion?.choices[0]?.message?.content || "";
    console.log(response);
    if (response.includes("react")) {
      res.json({
        prompts: [
          BASE_PROMPT,
          `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
        ],
        uiPrompts: [reactBasePrompt],
      });
      return;
    }

    if (response.includes("node")) {
      res.json({
        prompts: [
          `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${nodeBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
        ],
        uiPrompts: [nodeBasePrompt],
      });
      return;
    }

    res.status(403).json({ message: "Unavailable" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const ChatFunction: RequestHandler = async (req, res) => {
  const { prompts } = req.body;
  const promptData = prompts.map((prompt: string) => ({
    role: "user",
    content: prompt,
  }));
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        ...promptData,
        {
          role: "system",
          content: getSystemPrompt(),
        },
      ],
      stream: true,
    });
    for await (const chunk of completion) {
      console.log(chunk.choices[0].delta.content || "");
    }
    res.json({ message: "Success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
