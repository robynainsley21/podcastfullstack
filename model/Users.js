import { connection as db } from "../config/index.js";
import createToken from "../middleware/AuthenticateUser.js";
import { hash, compare } from "bcrypt";

class Users {
  fetchUser(req, res) {
    try {
      const strQry = `
                SELECT * FROM Users
                WHERE userID = ${req.params.id};
            `;

      db.query(strQry, (err, result) => {
        if (err) throw new Error(`Specified user not found: `, err);

        res.json({
          status: res.statusCode,
          result: result[0],
        });
      });
    } catch (error) {
      res.json({
        status: 400,
        message: error.message,
      });
    }
  }

  fetchUsers(req, res) {
    try {
      const strQry = `
                    SELECT * FROM Users;
                `;

      db.query(strQry, (err, result) => {
        if (err) throw new Error(`Unable to fetch all users: `, err);
        res.json({
          status: res.statusCode,
          result,
        });
      });
    } catch (error) {
      res.json({
        status: 404,
        message: error.message,
      });
    }
  }

  async registerUser(req, res) {
    try {
      let data = req.body;
      data.userPass = await hash(data.userPass, 12);
      let user = {
        emailAdd: data.emailAdd,
        userPass: data.userPass,
      };

      const strQry = `
            INSERT INTO Users
            SET ?;
            `;

      db.query(strQry, [data], (err) => {
        if (err) {
          res.json({
            status: res.statusCode,
            message: `This email has already been taken.`,
          });
        } else {
          const token = createToken(user);
          res.json({
            token,
            message: `Your account has been created.`,
          });
        }
      });
    } catch (error) {
      res.json({
        status: 404,
        message: error.message,
      });
    }
  }

  async updateUser(req, res) {
    try {
      let data = req.body;
      if (data.userPass) {
        data.userPass = await hash(data.userPass, 12);
      }
      const strQry = `
                  UPDATE Users
                  SET ?
                  WHERE userID = ${req.params.id};
                `;

      db.query(strQry, [data], (err) => {
        if (err) throw new Error("Unable to update user.");
        res.json({
          status: res.statusCode,
          message: "User updated successfully",
        });
      });
    } catch (error) {
      res.json({ status: 404, message: error.message });
    }
  }

  deleteUser(req, res) {
    try {
      const strQry = `
                  DELETE FROM Users
                  WHERE userID = ${req.params.id};
                `;
      db.query(strQry, (err) => {
        if (err)
          throw new Error(`To delete a user, please review your delete query.`);
        res.json({
          status: res.statusCode,
          message: "User's account has been deleted.",
        });
      });
    } catch (error) {
      res.json({ status: 404, message: error.message });
    }
  }

  async login(req, res) {
    try {
      const { emailAdd, userPass } = req.body;
      const strQry = `
                  SELECT *
                  FROM Users
                  WHERE emailAdd = '${emailAdd}';
                `;
      db.query(strQry, async (err, result) => {
        if (err) throw new Error(`To login, please review your query.`);
        if (!result?.length) {
          res.json({
            status: 401,
            message: "You provided the wrong email.",
          });
        } else {
          const isValidPass = await compare(userPass, result[0].userPass);
          if (isValidPass) {
            const token = createToken({ emailAdd, userPass });
            res.json({
              status: res.statusCode,
              token,
              result: result[0],
              message: `You have successfully logged in.`,
            });
          } else {
            res.json({
              status: 401,
              message: `Invalid password or you have not registered.`,
            });
          }
        }
      });
    } catch (error) {
      res.json({
        status: 401,
        message: error.message,
      });
    }
  }
}


export { Users }