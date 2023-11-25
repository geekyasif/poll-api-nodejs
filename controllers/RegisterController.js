const conn = require("../db");

function RegisterController(req, res) {
  const { name, email, password } = req.body;

  conn.query(
    `SELECT * FROM users WHERE email = '${email}'`,
    (error, result) => {
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
    }
  );

  conn.query(
    `
  INSERT INTO users (name, email, password) VALUES ('${name}', '${email}', '${password}')`,
    (error) => {
      if (error) {
        return res.status(500).json({
          message: "Sometjing went wrong",
          error: error,
        });
      }
      return res.status(201).json({
        message: "User registration is successfully",
      });
    }
  );
}

module.exports = RegisterController;
