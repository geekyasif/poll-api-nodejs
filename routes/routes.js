const express = require("express");
const router = express.Router();

const UserController = require("../controllers/UserController");
const PollController = require("../controllers/PollController");
const AuthController = require("../controllers/AuthController");

router.post("/register", AuthController.Register);
router.post("/login", AuthController.Login);

// 1 - poll creation route
router.post("/polls", PollController.AddPoll);

// 3.a - poll update route
router.patch("/polls/:pid", PollController.UpdatePoll);

// 3.b -
router.patch("/questions/:qid/polls/:pid", PollController.QuestionUpdate);

// getting all polls route
router.get("/polls", PollController.GetAllPolls);

// getting single poll route
router.get("/polls/:query_id", PollController.GetSinglePoll);

router.get("/analytics", PollController.pollAnalytics);

// getting all the polls by specific users
router.get("/users/:uid/polls", PollController.GetPollsByUid);

router.put("/vote", UserController.vote);

module.exports = router;
