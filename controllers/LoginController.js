const conn = require("../db");

function LoginController(req, res) {
  const { email, password } = req.body;

  conn.query(
    `SELECT password FROM users WHERE email = '${email}'`,
    (error, result) => {
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
    }
  );
}

module.exports = LoginController;
