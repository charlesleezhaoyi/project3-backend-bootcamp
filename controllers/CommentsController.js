class CommentsController {
  constructor(db) {
    this.commentModel = db.comment;
    this.postModel = db.post;
    this.userModel = db.user;
  }

  async getComments(req, res) {
    const { postId } = req.params;
    try {
      if (isNaN(Number(postId))) {
        throw new Error("Wrong Type of postId");
      }
      const comments = await this.commentModel.findAll({
        where: { commentedPostId: postId },
        include: "commenter",
        order: [["createdAt", "ASC"]],
      });
      return res.json(comments);
    } catch (error) {
      return res.status(400).json({ error: true, msg: error });
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
      const postData = await this.postModel.findByPk(postId);
      if (!postData) {
        throw new Error("No Such Post Found.");
      }
      const user = await this.userModel.findOne({
        where: { email: userEmail },
      });
      const comment = await postData.createComment({
        commenterId: user.id,
        content,
      });
      return res.json({ user, comment });
    } catch (error) {
      return res.status(400).json({ error: true, msg: error });
    }
  }
}
module.exports = CommentsController;
