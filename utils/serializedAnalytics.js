function serializedAnalytics(results) {
  console.log(results);
  const polls = [];
  results.map((poll) => {
    if (poll.options) {
      const _poll = {
        id: poll.query_id,
        title: poll.title,
        options: [],
        total_votes: poll?.total_votes == null ? 0 : parseInt(poll.total_votes),
      };
      poll?.options?.split(",").map((p) => {
        const _p = p?.split(":");
        const _id = parseInt(_p[0]?.trim(" "));
        const _option = _p[1]?.split("(")[0];
        const _votes = parseInt(_p[1]?.split("(")[1]?.split(" "));
        _poll.options.push({
          id: _id,
          option: _option,
          votes: (_votes / parseInt(poll?.total_votes)) * 100,
        });
      });
      polls.push(_poll);
    }
  });

  return polls;
}

module.exports = serializedAnalytics;
