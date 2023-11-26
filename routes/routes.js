const express = require("express");
const router = express.Router();

const RegisterController = require("../controllers/RegisterController");
const LoginController = require("../controllers/LoginController");
const AddPollController = require("../controllers/AddPollController");
const GetAllPollsController = require("../controllers/GetAllPollsController");
const GetSinglePollController = require("../controllers/GetSinglePollController");
const GetPollsByUidController = require("../controllers/GetPollsByUidController");

router.post("/register", RegisterController);
router.post("/login", LoginController);

// poll creation route
router.post("/polls", AddPollController);

// getting all polls route
router.get("/polls", GetAllPollsController);

// getting single poll route
router.get("/polls/:query_id", GetSinglePollController);

// getting all the polls by specific users
router.get("/users/:uid/polls", GetPollsByUidController);

module.exports = router;
