const db = require("../db/connection")

const deleteCommentById = (comment_id) => {
    return db.query("DELETE FROM comments WHERE comment_id = $1 RETURNING *", [comment_id]).then(({rows}) => {
        if (rows.length === 0) {
            return null
        }
        return rows[0]
    })
}
module.exports = {deleteCommentById}