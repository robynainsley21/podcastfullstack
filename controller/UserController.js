import express from "express";
import bodyParser from "body-parser";
import { Users } from "../model/Users.js";

const userRouter = express.Router();

//an instance of the Users class so it is not directly used
const userController = new Users();

userRouter.use(bodyParser.json());

//routes
userRouter.get("/users", (req, res) => {
  userController.fetchUsers(req, res);
});

userRouter.get("/users/:userID", (req, res) => {
  userController.fetchUser(req, res);
});

userRouter.post("/register", (req, res) => {
  userController.registerUser(req, res);
});

userRouter.patch("/update/:userID", (req, res) => {
  userController.updateUser(req, res);
});

userRouter.delete("/delete/:userID", (req, res) => {
  userController.deleteUser(req, res);
});

userRouter.post("/login", (req, res) => {
  userController.login(req, res);
});

export { express, userRouter };
