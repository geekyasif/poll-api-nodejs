const conn = require("../db");

function GetSinglePollController(req, res) {
  const { query_id } = req.params;

  conn.query(
    `
    SELECT
        u.id as uid,
        u.name as user_name,
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
    where q.id = ${query_id}
    GROUP BY
        q.title,
        u.name,
        u.id,
        q.id;`,
    (error, result) => {
      if (error) {
        return res.status(500).json({ error: error });
      }

      return res.status(200).json({ data: result });
    }
  );
}

module.exports = GetSinglePollController;
