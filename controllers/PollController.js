const conn = require("../config/db");
const AddPoll = require("../utils/AddPoll");
const AddQuestion = require("../utils/AddQuestion");
const UpdateQuestion = require("../utils/UpdateQuestion");
const serializedAnalytics = require("../utils/serializedAnalytics");

class PollController {
  // Add New Poll
  static async AddPoll(req, res) {
    try {
      const {
        uid,
        title,
        category,
        start_date,
        end_date,
        minimum_reward,
        maximum_reward,
        questions,
      } = req.body;

      // adding the poll
      const response = await AddPoll(
        uid,
        title,
        category,
        start_date,
        end_date,
        minimum_reward,
        maximum_reward
      );

      // if error while adding the poll
      if (response.error) {
        return res.status(201).json({ error: response.error });
      }

      // getting the poll id
      const pid = response.insertId;

      // adding the queries
      questions.forEach(async (question) => {
        // adding the single query
        const response = await AddQuestion(pid, question.title, question.type);

        // getting the query_id
        const qid = response.insertId;

        // addding the query option
        question.options.forEach((option) => {
          const insertQuery = `INSERT INTO options (qid, title) values (${qid}, '${option}')`;
          conn.query(insertQuery, (error) => {
            if (error) {
              return res.status(500).json({ error: error });
            }
          });
        });
      });

      return res.status(201).json({ data: "Inserted successfully!" });
    } catch (error) {
      return res.status(201).json({ data: error });
    }
  }

  // Update the Poll
  static async UpdatePoll(req, res) {
    try {
      const { pid } = req.params;
      const {
        title,
        category,
        minimum_reward,
        maximum_reward,
        start_date,
        end_date,
      } = req.body;

      const updateQuery = `UPDATE polls SET title = '${title}', category = '${category}', minimum_reward = '${minimum_reward}', maximum_reward = '${maximum_reward}', start_date = '${start_date}', end_date = '${end_date}' WHERE id = ${pid};`;

      conn.query(updateQuery, (error) => {
        if (error) {
          return res.status(500).json({ error });
        }

        return res.status(204);
      });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  static async QuestionUpdate(req, res) {
    try {
      const { qid, pid } = req.params;
      const { title, type, options } = req.body;

      const response = await UpdateQuestion(qid, pid, title, type);

      if (response.error) {
        return res.status(201).json({ error: response.error });
      }

      // deleting old options
      const deleteQuery = `DELETE FROM options WHERE qid = ${qid};`;
      conn.query(deleteQuery, (error) => {
        if (error) {
          return res.status(500).json({ error });
        }
      });

      // addding the new option
      options.forEach((option) => {
        const insertQuery = `INSERT INTO options (qid, title) values (${qid}, '${option}')`;
        conn.query(insertQuery, (error) => {
          if (error) {
            return res.status(500).json({ error: error });
          }
        });
      });

      return res.status(204);
    } catch (error) {
      return res.status(500).json({ error });
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
