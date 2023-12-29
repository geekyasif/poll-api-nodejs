const conn = require("../config/db");

function AddQuestion(pid, title, type) {
  return new Promise((resolve, reject) => {
    const insertQuery = `INSERT INTO questions (pid, title, type) VALUES (${pid}, '${title}', '${type}');`;

    conn.query(insertQuery, (error, result) => {
      if (error) {
        return reject({
          error: error,
        });
      } else {
        return resolve(result);
      }
    });
  });
}

module.exports = AddQuestion;
