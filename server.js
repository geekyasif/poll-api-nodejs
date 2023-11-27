const express = require("express");
const routes = require("./routes/routes");

const app = express();
app.use(express.json());
app.use(routes);

app.listen(8000, () => {
  console.log("Server is listening on port 8000...");
});
