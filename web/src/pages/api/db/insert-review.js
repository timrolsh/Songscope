import db from "@/server/db_connect";

// TODO: Add authentication
export default (request, response) => {
    if(request.method === "POST") {
        console.log('reqbody:', request.body);
        const {songid, userid, reviewbody} = request.body;
        insertReview(songid, userid, reviewbody);
        response.status(200).send("Inserted review");
        return;
    } else {
        response.status(400).send("Malformed Request Body");
        return;
    }
}

// TODO --> verify no sql injection threats from changing localstorage values
function insertReview(songid, userid, reviewtext) {
    console.log("SONGSCOPE: Inserting review, songid:", songid, "userid:", userid, "reviewtext:", reviewtext);
    db.execute(`
        INSERT INTO comment(user_id, spotify_work_id, comment_text)
        VALUES(?, ?, ?)    
    `, [userid, songid, reviewtext], (error, results, fields) => {
        console.log("SONGSCOPE: Inserted review");
        if (error) {
            console.error("SONGSCOPE: Unable to insert review", error);
            return false;
        }
        return true;
    });

}