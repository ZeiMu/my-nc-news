const {updateArticleById} = require('../models/update_article_by_id.model')

const patchArticleById = (req, res, next) => {
    const {article_id} = req.params
    const {inc_votes} = req.body

    if (typeof inc_votes !== 'number') {
        return res.status(400).send({msg: 'Bad request: inc_votes not a number'})
    }
    
    updateArticleById(article_id, inc_votes).then(updatedArticle => {
        if (!updatedArticle) {
            return res.status(404).send({msg: 'Article not found'})
        }
        return res.status(200).send({article: updatedArticle})
    }).catch(err => {
        console.error(err)
        return next(err)
    })
}

module.exports = {patchArticleById}