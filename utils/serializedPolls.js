function serializedPolls(results) {
  const polls = [];
  results.map((poll) => {
    if (poll.options) {
      const _poll = {
        id: poll.query_id,
        title: poll.title,
        options: [],
      };
      poll.options.split(",").map((p) => {
        const _p = p.split(":");
        const _id = _p[0];
        const _option = _p[1];
        _poll.options.push({
          id: _id,
          option: _option,
        });
      });

      polls.push(_poll);
    }
  });

  return polls;
}

module.exports = serializedPolls;
