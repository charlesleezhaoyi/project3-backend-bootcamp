const BaseController = require("./baseController");

class CategoriesController extends BaseController {
  constructor(model, db) {
    super(model);
    this.post = db.post;
    this.like = db.like;
    this.sequelize = db.sequelize;
  }

  async getAllCategoriesWithSortBy(req, res) {
    const { sortBy } = req.params;
    const sortByList = ["popular", "newestPost", "newestComment"];
    try {
      if (!sortByList.includes(sortBy)) {
        throw new Error(
          `ValueError: ${sortBy} is not a correct value("popular"/ "newestPost"/ "newestComment")`
        );
      }
      const categoryOption = this.getCategoryOption(sortBy);
      const categories = await this.model.findAll({ ...categoryOption });
      return res.json(categories);
    } catch (error) {
      return res.status(400).send(error.message);
    }
  }

  getCategoryOption(sortBY) {
    const categoryOption = {
      include: [
        {
          model: this.post,
          attributes: [],
          include: [{ model: this.like, attributes: [] }],
          through: { attributes: [] },
        },
      ],
      group: ["category.id"],
      attributes: {
        include: [
          [
            this.sequelize.fn("COUNT", this.sequelize.col("posts.likes.id")),
            "likeCount",
          ],
        ],
      },
    };
    switch (sortBY) {
      case "popular":
        categoryOption.order = [["likeCount", "DESC"]];
        break;
      case "newestPost":
        break;
      case "newestComment":
        break;
    }
    return categoryOption;
  }
}
module.exports = CategoriesController;
