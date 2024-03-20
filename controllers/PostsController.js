class PostsController {
  constructor(db) {
    this.post = db.post;
    this.comment = db.comment;
    this.user = db.user;
    this.like = db.like;
    this.category = db.category;
  }

  //get one post data using postId, can include comment,author,like.
  //Input: authorId (from params)
  //Optional Input: comment:any, like:any, author:any (from query)
  //Output: postData (optional:comments, likes, author)
  async getOne(req, res) {
    const { postId } = req.params;
    if (isNaN(Number(postId))) {
      return res.status(400).send("Wrong Type of postId");
    }
    const { comment, author, like } = req.query;
    const include = [];
    if (comment) {
      include.push(this.comment);
    }
    if (author) {
      include.push({ model: this.user, as: "author" });
    }
    if (like) {
      include.push(this.like);
    }
    try {
      const data = await this.post.findByPk(postId, { include: include });
      return res.json(data);
    } catch (err) {
      return res.status(400).send(err);
    }
  }

  //create Data and add relationship with category
  //Input: authorId:number, categories:string[], title:string, content:string (from body)
  //Output: void
  async createPost(req, res) {
    const { categories, ...data } = req.body;
    if (isNaN(Number(data.authorId))) {
      return res.status(400).send("Wrong Type of authorId");
    }
    if (!data.title || !data.content) {
      return res.status(400).send("Must have title/content data");
    }
    if (typeof data.title !== "string" || typeof data.content !== "string") {
      return res.status(400).send("Wrong Type of title/content");
    }
    if (!data.title.length || !data.content.length) {
      return res.status(400).send("Must have content for title/content");
    }
    try {
      const newPost = await this.post.create(data);
      for (const category of categories) {
        const categoryInstance = await this.category.findOne({
          where: { name: category },
        });
        await newPost.addCategory(categoryInstance);
      }
      return res.send("Create Post Completed");
    } catch (err) {
      return res.status(400).send(err);
    }
  }

  //Input: postId (from params)
  //Input: userId:number, content:string (from body)
  //Output: void
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
      return res.status(400).send(err);
    }
  }
}
module.exports = PostsController;
