function AddQuery(uid, title) {
  return new Promise((resolve, reject) => {
    conn.query(
      `INSERT INTO queries (uid, title) VALUES (${uid}, '${title}')`,
      (error, result) => {
        if (error) {
          return reject({
            error: "Something went wrong!",
          });
        } else {
          return resolve(result);
        }
      }
    );
  });
}

module.exports = AddQuery;
