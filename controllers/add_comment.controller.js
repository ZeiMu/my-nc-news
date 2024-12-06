const {insertCommentForArticle} = require("../models/add_comment.model")
 const { fetchArticleById } = require("../models/article_id.model")

const postCommentForArticle = (req, res, next) => {
    const {article_id} = req.params
    const {username, body} = req.body

    if (!username || !body) {
        return next({status: 400, msg: "Bad request: Missing or incorrect username/body"})
    }
    if (typeof body !== "string" || typeof username !== "string") {
        return next({status: 400, msg: "Bad request: Missing or incorrect username/body"})
    }
    fetchArticleById(article_id).then((article) => {
        console.log("Fetched article:", article);
        if (!article) {
            return next({status: 404, msg: "Article not found"})
        }
         return insertCommentForArticle(article_id, username, body)
    })
    .then((comment) => {
        res.status(201).send({comment})
    }).catch((err) => {
        next(err)
})

}

module.exports = {postCommentForArticle}
