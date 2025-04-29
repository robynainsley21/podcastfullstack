import "dotenv/config";
import jwt from "jsonwebtoken";

const { sign, verify } = jwt;

const createToken = (userInfo) => {
  return sign(
    {
      emailAdd: userInfo.emailAdd,
      password: userInfo.userPass,
    },
    process.env.SECRET_KEY
  );
};

const verifyToken = (req, res, next) => {
  const token = req?.headers["authorization"];
  if (token) {
    if (verify(token, process.env.SECRET_KEY)) {
      next();
    } else {
      res?.json({
        status: res.statusCode,
        msg: "Please provide the correct details.",
      });
    }
  } else {
    res?.json({
      status: res.statusCode,
      msg: "Please log in.",
    });
  }
};

export { createToken, verifyToken };
