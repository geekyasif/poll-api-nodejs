[post] /polls
Table Polls {
id int [primary key]
uid int
title varchar
category varchar
start_date varchar
end_date varchar
minimum_reward int
maximum_reward int
}

[put] /polls
Table Polls {
id int [primary key]
uid int
title varchar
category varchar
start_date varchar
end_date varchar
minimum_reward int
maximum_reward int
}

[GET] /polls
const res = {
title
category
start_date
end_date
total_votes,
no_of_questions
question sets
}

[POST] /questions
{
title
type
options
}

<!--
{
    uid: 1,
    title: "Diwali Celebration 2023",
    category: "Technology"
    start_date: "2023-11-28",
    end_date: "2023-11-29",
    minimum_reward: 10,
    maximum_reward: 100,
    questions: [
        {
            title: "Founder of Apple ?",
            type: "single"
            options: ["Steve Jobs", "Arnold", "Spiderman", "Ironman"]
        }
    ]

} -->
