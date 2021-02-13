const { Sequelize, DataTypes, Model } = require("sequelize");
const router = require("express").Router();
const db = new Sequelize("postgres://localhost:5432/bookmark");

// define model Category
const Category = db.define("category", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// define model Bookmark
const Bookmark = db.define("bookmark", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// establish relationship between Bookmark and Category
Bookmark.belongsTo(Category);
Category.hasMany(Bookmark);

const category = require("../views/category");
const bookmark = require("../views/bookmark");

router.get("/", async (req, res, next) => {
  try {
    const data = await Category.findAll();
    res.send(category(data));
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const data = await Bookmark.findAll({
      where: { CategoryId: req.params.id },
    });
    res.send(bookmark(data));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
