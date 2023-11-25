const conn = require("../db");
const AddQuery = require("../utils/AddQuery");

async function AddPollController(req, res) {
  try {
    const { uid, title, options } = req.body;

    const response = await AddQuery(uid, title);
    if (response.error) {
      return res.status(201).json({ error: response.error });
    }

    const query_id = response.insertId;
    options.forEach((option) => {
      conn.query(
        `
            INSERT INTO options (query_id, title) values (${query_id}, '${option}')
        `,
        (error) => {
          if (error) {
            return res.status(500).json({ error: error });
          }
        }
      );
    });

    return res.status(201).json({ data: "Inserted successfully!" });
  } catch (error) {
    return res.status(201).json({ data: error });
  }
}

module.exports = AddPollController;
