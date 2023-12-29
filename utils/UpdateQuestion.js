const conn = require("../config/db");

function UpdateQuestion(qid, pid, title, type) {
  return new Promise((resolve, reject) => {
    const updateQuery = `UPDATE questions SET title =  '${title}', type ='${type}') WHERE id = ${qid} and pid = ${pid};`;
    conn.query(updateQuery, (error, result) => {
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

module.exports = UpdateQuestion;
