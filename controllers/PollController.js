const conn = require("../db");
const serializedAnalytics = require("../utils/serializedAnalytics");

class PollController {
  static pollAnalytics(req, res) {
    conn.query(
      `
      SELECT
    u.name AS user_name,
    q.title AS title,
    q.id AS query_id,
    GROUP_CONCAT(
        o.id,
        ":",
        o.title,
        "(",
        COALESCE(option_count, 0),
        " votes)"
    SEPARATOR ', '
    ) AS options,
    SUM(option_count) AS total_votes
FROM
    users AS u
JOIN
    queries AS q ON u.id = q.uid
JOIN
    options AS o ON o.query_id = q.id
LEFT JOIN (
    SELECT query_id, option_id, COUNT(DISTINCT id) AS option_count
    FROM users_polls
    GROUP BY query_id, option_id
) AS up ON up.query_id = q.id AND up.option_id = o.id
GROUP BY
    q.title,
    u.name,
    q.id
ORDER BY
    q.id;`,
      (error, results) => {
        if (error) {
          return res.status(500).json({ error: error });
        }
        const analytics = serializedAnalytics(results);

        return res.status(200).json({ data: analytics });
      }
    );
  }
}

module.exports = PollController;
