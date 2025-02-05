import express from "express";
import {
  ChatFunction,
  TemplateFunction,
} from "../controllers/workspace.controller";

const router = express.Router();

router.post("/template", TemplateFunction);
router.post("/chat", ChatFunction);

export default router;
