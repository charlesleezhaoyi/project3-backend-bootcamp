class CommentsController {
  constructor(comment, post, user) {
    this.comment = comment;
    this.post = post;
    this.user = user;
  }

  async getComments(req, res) {
    const { postId } = req.params;
    if (isNaN(Number(postId))) {
      return res.status(400).send("Wrong Type of postId");
    }
    try {
      const comments = await this.comment.findAll({
        where: { postId: postId },
        include: this.user,
        order: [["createdAt", "ASC"]],
      });
      return res.json(comments);
    } catch (err) {
      return res.status(400).send(err.message);
    }
  }

  async createComment(req, res) {
    const { postId } = req.params;
    if (isNaN(Number(postId))) {
      return res.status(400).send("Wrong Type of postId");
    }
    const data = req.body;
    if (isNaN(Number(data.userId))) {
      return res.status(400).send("Wrong Type of userId");
    }
    if (typeof data.content !== "string") {
      return res.status(400).send("Wrong Type of content");
    }
    if (!data.content.length) {
      return res.status(400).send("Must have content for content");
    }
    try {
      const postData = await this.post.findByPk(postId);
      if (!postData) {
        throw new Error("No Such Post Found.");
      }
      await postData.createComment(data);
      return res.json("Create Comment Completed");
    } catch (err) {
      return res.status(400).send(err.message);
    }
  }
}
module.exports = CommentsController;
