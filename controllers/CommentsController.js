class CommentsController {
  constructor(comment, post, user) {
    this.comment = comment;
    this.post = post;
    this.user = user;
  }

  async getComments(req, res) {
    const { postId } = req.params;
    try {
      if (isNaN(Number(postId))) {
        throw new Error("Wrong Type of postId");
      }
      const comments = await this.comment.findAll({
        where: { commentedPostId: postId },
        include: "commenter",
        order: [["createdAt", "ASC"]],
      });
      return res.json(comments);
    } catch (err) {
      return res.status(400).send(err.message);
    }
  }

  async createComment(req, res) {
    const { postId } = req.params;
    try {
      if (isNaN(Number(postId))) {
        throw new Error("Wrong Type of postId");
      }
      const { userEmail, content } = req.body;
      if (typeof content !== "string") {
        throw new Error("Wrong Type of content");
      }
      if (!content.length) {
        throw new Error("Must have content for content");
      }
      const postData = await this.post.findByPk(postId);
      if (!postData) {
        throw new Error("No Such Post Found.");
      }
      const user = await this.user.findOne({ where: { email: userEmail } });
      await postData.createComment({ commenterId: user.id, content });
      return res.json("Create Comment Completed");
    } catch (err) {
      return res.status(400).send(err.message);
    }
  }
}
module.exports = CommentsController;
