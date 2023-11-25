const express = require("express");
const conn = require("./db");
const serializedPolls = require("./utils/serializedPolls");
const AddQuery = require("./utils/AddQuery");
const routes = require("./routes/routes");

const app = express();
app.use(express.json());
app.use(routes);

app.listen(8000, () => {
  console.log("Server is listening on port 8000...");
});
