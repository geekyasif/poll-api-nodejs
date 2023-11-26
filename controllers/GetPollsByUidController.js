const conn = require("../db");
const serializedPolls = require("../utils/serializedPolls");

function GetPollsByUidController(req, res) {
  try {
    const { uid } = req.params;

    conn.query(
      `
    select
    q.id AS id,
    q.title AS title,
    GROUP_CONCAT(
        o.id,
        ":",
        o.title SEPARATOR ', '
    ) AS 'options'
from queries as q
    join options as o on q.id = o.query_id
where uid = ${uid}
GROUP BY q.title, q.id;
`,
      (error, result) => {
        if (error) {
          return res.status(500).json({ error: error });
        }

        const polls = serializedPolls(result);
        return res.status(200).json({ data: polls });
      }
    );
  } catch (error) {
    return res.status(500).json({ error: error });
  }
}

module.exports = GetPollsByUidController;
