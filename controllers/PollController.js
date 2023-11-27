const conn = require("../config/db");
const AddQuery = require("../utils/AddQuery");
const serializedAnalytics = require("../utils/serializedAnalytics");

class PollController {
  // Add New Poll
  static async AddPoll(req, res) {
    try {
      const { uid, title, options } = req.body;

      const response = await AddQuery(uid, title);
      if (response.error) {
        return res.status(201).json({ error: response.error });
      }

      const query_id = response.insertId;
      options.forEach((option) => {
        const insertQuery = `INSERT INTO options (query_id, title) values (${query_id}, '${option}')`;
        conn.query(insertQuery, (error) => {
          if (error) {
            return res.status(500).json({ error: error });
          }
        });
      });

      return res.status(201).json({ data: "Inserted successfully!" });
    } catch (error) {
      return res.status(201).json({ data: error });
    }
  }

  // Get All Polls
  static GetAllPolls(req, res) {
    const selectQuery = `SELECT q.title AS title, q.id AS query_id, GROUP_CONCAT(o.id, ":", o.title SEPARATOR ', ') AS 'options' from users as u LEFT JOIN queries AS q on u.id = q.uid LEFT JOIN options AS o on o.query_id = q.id GROUP BY q.title, q.id;`;

    conn.query(selectQuery, (error, results) => {
      if (error) {
        return res.status(500).json({ error: error });
      }
      const polls = serializedPolls(results);
      return res.status(200).json({ data: polls });
    });
  }

  // Get All Polls By User id
  static GetPollsByUid(req, res) {
    try {
      const { uid } = req.params;
      const selectQuery = `select q.id AS id, q.title AS title, GROUP_CONCAT( o.id, ":", o.title SEPARATOR ', ' ) AS 'options' from queries as q join options as o on q.id = o.query_id where uid = ${uid} GROUP BY q.title, q.id;`;
      conn.query(selectQuery, (error, result) => {
        if (error) {
          return res.status(500).json({ error: error });
        }

        const polls = serializedPolls(result);
        return res.status(200).json({ data: polls });
      });
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }

  // Get Single By Query Id
  static GetSinglePoll(req, res) {
    const { query_id } = req.params;

    const selectQuery = `SELECT q.id AS id, q.title AS title, GROUP_CONCAT(o.id, ":", o.title SEPARATOR ', ') AS 'options' from users as u JOIN queries AS q on u.id = q.uid JOIN options AS o on o.query_id = q.id where q.id = ${query_id} GROUP BY q.title, q.id;`;
    conn.query(selectQuery, (error, result) => {
      if (error) {
        return res.status(500).json({ error: error });
      }

      const poll = serializedPolls(result);

      return res.status(200).json({ data: poll });
    });
  }

  // Poll Analytics
  static pollAnalytics(req, res) {
    const selectQuery = `SELECT u.name AS user_name, q.title AS title, q.id AS query_id, GROUP_CONCAT(o.id, ":", o.title, "(", COALESCE(option_count, 0), " votes)" SEPARATOR ', ') AS options, SUM(option_count) AS total_votes FROM users AS u JOIN queries AS q ON u.id = q.uid JOIN options AS o ON o.query_id = q.id LEFT JOIN (SELECT query_id, option_id, COUNT(DISTINCT id) AS option_count FROM users_polls GROUP BY query_id, option_id) AS up ON up.query_id = q.id AND up.option_id = o.id GROUP BY q.title, u.name, q.id ORDER BY q.id;`;

    conn.query(selectQuery, (error, results) => {
      if (error) {
        return res.status(500).json({ error: error });
      }
      const analytics = serializedAnalytics(results);

      return res.status(200).json({ data: analytics });
    });
  }
}

module.exports = PollController;
