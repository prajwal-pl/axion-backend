import express from "express";
import { getAIResponse } from "../controllers/dashboard.controller";

const router = express.Router();

router.get("/", getAIResponse);

export default router;
