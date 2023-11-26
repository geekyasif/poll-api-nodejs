const conn = require("../db");
const serializedPolls = require("../utils/serializedPolls");

function GetSinglePollController(req, res) {
  const { query_id } = req.params;

  conn.query(
    `
    SELECT
    q.id AS id,
    q.title AS title,
    GROUP_CONCAT(
            o.id,
            ":",
            o.title SEPARATOR ', '
        ) AS 'options'
    from users as u
        JOIN queries AS q on u.id = q.uid
        JOIN options AS o on o.query_id = q.id
    where q.id = ${query_id}
    GROUP BY
        q.title,
        q.id;`,
    (error, result) => {
      if (error) {
        return res.status(500).json({ error: error });
      }

      const poll = serializedPolls(result);

      return res.status(200).json({ data: poll });
    }
  );
}

module.exports = GetSinglePollController;
