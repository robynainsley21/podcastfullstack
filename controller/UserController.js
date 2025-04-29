import express from "express";
import bodyParser from "body-parser";
import { Users } from "../model/Users.js";

const userRouter = express.Router();

userRouter.use(bodyParser.json());

//routes
userRouter.get("/", (req, res) => {
  Users.fetchUsers(req, res);
});

userRouter.get("/:userID", (req, res) => {
  Users.fetchUser(req, res);
});

userRouter.post("/register", (req, res) => {
  Users.registerUser(req, res);
});

userRouter.patch("/update/:userID", (req, res) => {
  Users.updateUser(req, res);
});

userRouter.delete("/delete/:userID", (req, res) => {
  Users.deleteUser(req, res);
});

userRouter.post("/login", (req, res) => {
  Users.login(req, res);
});

export { express, userRouter };
