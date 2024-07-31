import express from "express";
import { login, register } from "../controllers/auth.controllers.js";
import { authetication } from "../middlewares/authenticaton.js";

const authRoute = express.Router();

authRoute.post("/register", register);
authRoute.post("/login", login);

export default authRoute;
