const express = require("express");
const conn = require("../db");
const AddQuery = require("../utils/AddQuery");
const serializedPolls = require("../utils/serializedPolls");
const RegisterController = require("../controllers/RegisterController");
const LoginController = require("../controllers/LoginController");
const AddPollController = require("../controllers/AddPoll");
const GetAllPollsController = require("../controllers/GetAllPollsController");
const GetSinglePollController = require("../controllers/GetSinglePollController");
const router = express.Router();

router.post("/register", RegisterController);
router.post("/login", LoginController);

router.post("/polls", AddPollController);
router.get("/polls", GetAllPollsController);
router.get("/polls/:query_id", GetSinglePollController);

module.exports = router;
