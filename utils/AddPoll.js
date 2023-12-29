const conn = require("../config/db");

function AddPoll(
  uid,
  title,
  category,
  start_date,
  end_date,
  minimum_reward,
  maximum_reward
) {
  return new Promise((resolve, reject) => {
    const insertQuery = `INSERT INTO polls (uid, title, category, start_date, end_date, minimum_reward, maximum_reward) VALUES (${uid}, '${title}', '${category}', '${start_date}', '${end_date}', ${minimum_reward}, ${maximum_reward});`;

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

module.exports = AddPoll;
