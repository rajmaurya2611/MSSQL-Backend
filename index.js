const app = require("./app");
const db = require("./config/db");
const UserModel = require("./models/user.model");

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World!!!!");
});

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
