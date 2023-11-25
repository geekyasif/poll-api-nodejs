const conn = require("../db");
const serializedPolls = require("../utils/serializedPolls");

function GetAllPollsController(req, res) {
  conn.query(
    `SELECT
    q.title AS title,
    q.id AS query_id,
    GROUP_CONCAT(
        o.id,
        ":",
        o.title SEPARATOR ', '
    ) AS 'options'
from users as u
    LEFT JOIN queries AS q on u.id = q.uid
    LEFT JOIN options AS o on o.query_id = q.id
GROUP BY
    q.title,
    q.id;`,
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: error });
      }
      const polls = serializedPolls(results);
      return res.status(200).json({ data: polls });
    }
  );
}

module.exports = GetAllPollsController;
