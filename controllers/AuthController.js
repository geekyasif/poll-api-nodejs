const conn = require("../config/db");

class AuthController {
  // Registration Controller
  static Register(req, res) {
    const { name, email, password } = req.body;

    const selectQuery = `SELECT * FROM users WHERE email = '${email}'`;
    conn.query(selectQuery, (error, result) => {
      if (error) {
        return res.status(500).json({
          error: error,
        });
      }
      if (Object.keys(result).length !== 0) {
        return res.status(404).json({
          message: "User is already registered!",
        });
      }
    });

    const insertQuery = `INSERT INTO users (name, email, password) VALUES ('${name}', '${email}', '${password}')`;
    conn.query(insertQuery, (error) => {
      if (error) {
        return res.status(500).json({
          message: "Sometjing went wrong",
          error: error,
        });
      }
      return res.status(201).json({
        message: "User registration is successfully",
      });
    });
  }

  // Login Controller
  static Login(req, res) {
    const { email, password } = req.body;

    const selectQuery = `SELECT password FROM users WHERE email = '${email}'`;
    conn.query(selectQuery, (error, result) => {
      console.log(error);
      if (error) {
        return res.status(500).json({ error: error });
      }

      if (Object.keys(result).length !== 0) {
        if (password == result[0].password) {
          return res.status(200).json({ message: "Login successfullly" });
        } else {
          return res.status(404).json({ error: "Invalid Credentials" });
        }
      }
    });
  }
}

module.exports = AuthController;
