const conn = require("../config/db");

class UserController {
  // Poll Vote By User
  static vote(req, res) {
    const { uid, query_id, option_id } = req.body;

    // Search if the poll exists
    const selectQuery = `SELECT * FROM users_polls WHERE uid = ${uid} AND query_id = ${query_id};`;
    conn.query(selectQuery, (error, result) => {
      if (error) {
        console.error("Error:", error.message);
        return res.status(500).json({ error: error.message });
      }

      // If exists, then update
      if (result.length !== 0) {
        const updateQuery = `UPDATE users_polls SET option_id = ${option_id} WHERE id = ${result[0].id};`;
        conn.query(updateQuery, (error) => {
          if (error) {
            console.error("Error:", error.message);
            return res.status(500).json({ error: error.message });
          }
          return res.status(204).end();
        });
      } else {
        // If not exists, insert
        const insertQuery = `INSERT INTO users_polls (uid, query_id, option_id) VALUES (${uid}, ${query_id}, ${option_id})`;
        conn.query(insertQuery, (error) => {
          if (error) {
            console.error("Error:", error.message);
            return res.status(500).json({ error: error.message });
          }
          return res.status(201).json({ message: "New vote is added" });
        });
      }
    });
  }
}

module.exports = UserController;
