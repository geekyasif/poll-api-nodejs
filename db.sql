-- Active: 1686691449262@@127.0.0.1@3306@poll

CREATE TABLE
    users (
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(50),
        email VARCHAR(50),
        password VARCHAR(250),
        PRIMARY KEY (id)
    );

CREATE TABLE
    queries (
        id INT NOT NULL AUTO_INCREMENT,
        uid int,
        title text,
        PRIMARY KEY(id),
        FOREIGN KEY(uid) REFERENCES users(id)
    );

CREATE TABLE
    options (
        id INT NOT NULL AUTO_INCREMENT,
        query_id INT,
        title TEXT,
        PRIMARY KEY(id),
        FOREIGN KEY(query_id) REFERENCES queries(id)
    )

CREATE TABLE
    users_polls (
        id INT NOT NULL AUTO_INCREMENT,
        uid INT,
        query_id INT,
        option_id INT,
        PRIMARY KEY (id),
        FOREIGN KEY (uid) REFERENCES users(id),
        FOREIGN KEY (query_id) REFERENCES queries(id),
        FOREIGN KEY (option_id) REFERENCES options(id)
    )

SELECT * FROM users;

SELECT * FROM queries;

SELECT * FROM options;

SELECT * FROM users_polls;

DELETE FROM users_polls;

SELECT
    u.name as user_name,
    q.title AS title,
    q.id AS query_id,
    GROUP_CONCAT(
        o.id,
        ":",
        o.title SEPARATOR ', '
    ) AS `options`
from users as u
    JOIN queries AS q on u.id = q.uid
    JOIN options AS o on o.query_id = q.id
GROUP BY
    q.title,
    u.name,
    q.id;

-- get single poll by query_id

SELECT
    u.id as uid,
    u.name as user_name,
    q.title AS title,
    q.id AS query_id,
    GROUP_CONCAT(
        o.id,
        ":",
        o.title SEPARATOR ', '
    ) AS `options`
from users as u
    JOIN queries AS q on u.id = q.uid
    JOIN options AS o on o.query_id = q.id
where q.id = 5
GROUP BY
    q.title,
    u.name,
    u.id,
    q.id;

-- get all polls by user id

select
    q.id AS id,
    q.title AS title,
    GROUP_CONCAT(
        o.id,
        ":",
        o.title SEPARATOR ', '
    ) AS `options`
from queries as q
    join options as o on q.id = o.query_id
where uid = 1
GROUP BY q.title, q.id;

-- ANALYTICS

SELECT
    q.id AS query_id,
    q.title AS title,
    GROUP_CONCAT(
        o.id,
        ":",
        o.title,
        "(",
        COALESCE(option_count, 0),
        " votes)" SEPARATOR ', '
    ) AS options
FROM users AS u
    JOIN queries AS q ON u.id = q.uid
    JOIN options AS o ON o.query_id = q.id
    LEFT JOIN (
        SELECT
            query_id,
            option_id,
            COUNT(DISTINCT id) AS option_count
        FROM users_polls
        GROUP BY
            query_id,
            option_id
    ) AS up ON up.query_id = q.id
    AND up.option_id = o.id
GROUP BY q.title, q.id
ORDER BY q.id;

SELECT
    u.name AS user_name,
    q.title AS title,
    q.id AS query_id,
    GROUP_CONCAT(
        o.id,
        ":",
        o.title,
        "(",
        COALESCE(option_count, 0),
        " votes)" SEPARATOR ', '
    ) AS options,
    SUM(option_count) AS total_votes
FROM users AS u
    JOIN queries AS q ON u.id = q.uid
    JOIN options AS o ON o.query_id = q.id
    LEFT JOIN (
        SELECT
            query_id,
            option_id,
            COUNT(DISTINCT id) AS option_count
        FROM users_polls
        GROUP BY
            query_id,
            option_id
    ) AS up ON up.query_id = q.id
    AND up.option_id = o.id
GROUP BY
    q.title,
    u.name,
    q.id
ORDER BY q.id;