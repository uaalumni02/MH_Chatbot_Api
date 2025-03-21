import Db from "../db/db";
import User from "../models/user";
import Token from "../helpers/jwt/token";
import bcrypt from "../helpers/bcrypt/bcrypt";

import validator from "../validator/user";
import * as Response from "../helpers/response/response";

class UserData {
  static async addUser(req, res) {
    const { userName, email, password } = req.body;
    try {
      const result = await validator.validateAsync(req.body);
      if (!result.error) {
        const user = await Db.findUser(User, userName, email);
        if (user != null) {
          return Response.responseConflict(res, user);
        } else {
          const hash = await bcrypt.hashPassword(password, 10);
          const newUser = { ...req.body, password: hash };
          const {
            userName,
            _id: userId,
            role,
          } = await Db.saveUser(User, newUser);
          let token = "";

          token = Token.sign({ userName, userId, role });

          res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
          });

          const userData = { userName, userId, role, token };

          return res
            .status(201)
            .json({ message: "User created successfully", userData });
        }
      }
    } catch (error) {
      return Response.responseServerError(res);
    }
  }

  static async userLogin(req, res) {
    const { userName, password } = req.body;

    try {
      const result = await validator.validateAsync(req.body);
      if (result.error) {
        return Response.responseInvalidInput(res);
      }
      const user = await Db.findUser(User, userName);
      if (!user) {
        return Response.responseBadAuth(res, "Invalid username or password");
      }
      const isSamePassword = await bcrypt.comparePassword(
        password,
        user.password
      );
      if (!isSamePassword) {
        return Response.responseBadAuth(res, "Invalid username or password");
      }
      const token = Token.sign({
        userName: user.userName,
        userId: user._id,
      });
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
      });

      return res.status(200).json({
        user: {
          _id: user._id,
          userName: user.userName,
          email: user.email,
        },
        message: "Login successful",
      });
    } catch (error) {
      console.error("Error during login:", error);
      return Response.responseServerError(res);
    }
  }

  static async getAllUsers(req, res) {
    try {
      const allUsers = await Db.getAllUsers(User);
      return Response.responseOk(res, allUsers);
    } catch (error) {
      return Response.responseNotFound(res);
    }
  }
  static async getUserById(req, res) {
    const { id } = req.params;
    try {
      const userById = await Db.getUserById(User, id);
      return Response.responseOk(res, userById);
    } catch (error) {
      return Response.responseNotFound(res);
    }
  }
}

export default UserData;
