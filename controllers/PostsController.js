class PostsController {
  constructor(post, comment) {
    this.post = post;
    this.comment = comment;
  }

  async getOne(req, res) {
    const { postId } = req.params;
    if (isNaN(Number(postId))) {
      return res.status(400).send("Wrong Type of postId");
    }
    try {
      const data = this.post.findByPk(postId);
      return res.json(data);
    } catch (err) {
      return res.status(400).send(err);
    }
  }
}
module.exports = PostsController;
