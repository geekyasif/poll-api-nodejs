use("pollpe");

db.getCollection("polls").find();

db.getCollection("polls").aggregate([
  {
    $lookup: {
      from: "questions",
      localField: "_id",
      foreignField: "pid",
      as: "questions",
    },
  },
  {
    $unwind: "$questions",
  },
  {
    $lookup: {
      from: "options",
      localField: "questions._id",
      foreignField: "qid",
      as: "options",
    },
  },
  {
    $group: {
      _id: "$_id",
      title: { $first: "$title" },
      questions: { $push: "$questions" },
    },
  },
]);
