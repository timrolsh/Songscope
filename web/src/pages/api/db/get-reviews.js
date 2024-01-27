import { db } from "../auth/[...nextauth]";

// TODO: Add authentication
export default async (request, response) => {
    if (request.method === "GET") {
        const {songid} = request.query;
        const results = await fetchSongReviews(songid);
        // TODO --> Swap from JSON stringify to just pure JSON
        response.status(200).send(JSON.stringify(results));
        return;
    } else {
        response.status(400).send("Malformed Request");
        return;
    }
};

async function fetchSongReviews(songid) {
    // TODO --> Order these reviews by popularity/likes as well
    const res = await db.promise().query(
        `select u.name, c.comment_text, c.time from comment c, users u
        where c.user_id = u.id
        and c.spotify_work_id = ?
        order by c.time desc;`,
        [songid]
    );

    if (res.error) {
        console.error("SONGSCOPE: Unable to fetch reviews", res.error);
        return null;
    }

    return res[0] == [] ? null : res[0];
}
