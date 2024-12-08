const { deleteCommentById } = require("../models/delete_comment_by_id.model");

const removeCommentById = (req, res, next) => {
  const { comment_id } = req.params;

  deleteCommentById(comment_id)
    .then((result) => {
      if (!result) {
        return res.status(404).send({ msg: "Comment not found" });
      }
      return res.status(204).send();
    })
    .catch(next);
};

module.exports = { removeCommentById };
