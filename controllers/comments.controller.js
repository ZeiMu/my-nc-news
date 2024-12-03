const {fetchCommentsByArticleId} = require('../comments.model')

const getCommentsByArticleId = (req, res, next) => {
    const {article_id} = req.params

    if (isNaN(Number(article_id))) {
        return next({status:400, msg: 'Bad request'})
    }

    fetchCommentsByArticleId(article_id).then((comments) => {
        if(comments.length === 0) {
            return next({status: 404, msg: 'Article not found'})
        }
        res.status(200).send({comments})
    }).catch((err) => {
        next({status: 500, msg: 'Server error'})
    })
}
module.exports = {getCommentsByArticleId}