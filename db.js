const { Sequelize, STRING } = require("sequelize");

const db = new Sequelize("postgres://localhost:5432/bookmark");

// define model Category
const Category = db.define("category", {
  name: {
    type: STRING,
    allowNull: false,
  },
});

// define model Bookmark
const Bookmark = db.define("bookmark", {
  name: {
    type: STRING,
    allowNull: false,
  },
  url: {
    type: STRING,
    allowNull: false,
    unique: true,
  },
});

// establish relationship between Bookmark and Category
Bookmark.belongsTo(Category);
Category.hasMany(Bookmark);

// seed some data
const syncAndSeed = async () => {
  try {
    await db.sync({ force: true });

    const [entertainment, jobsearch] = await Promise.all(
      ["Entertainment", "Job Search"].map((name) => Category.create({ name })));

    const netflix = await Bookmark.create({
      name: "Netflix",
      url: "www.netflix.com",
      categoryId: entertainment.id,
    });
    const disneyplus = await Bookmark.create({
      name: "Disney+",
      url: "www.disneyplus.com",
      categoryId: entertainment.id,
    });
    const hbo = await Bookmark.create({
      name: "HBO",
      url: "www.hbomax.com",
      categoryId: entertainment.id,
    });

    const linkedIn = await Bookmark.create({
      name: "LinkedIn",
      url: "www.linkedin.com",
      categoryId: jobsearch.id,
    });
    const glassDoor = await Bookmark.create({
      name: "Glassdoor",
      url: "www.glassdoor.com",
      categoryId: jobsearch.id,
    });
    const indeed = await Bookmark.create({
      name: "Indeed",
      url: "www.indeed.com",
      categoryId: jobsearch.id,
    });
    const stackoverflow = await Bookmark.create({
      name: "Stackoverflow",
      url: "www.stackoverflow.com",
      categoryId: jobsearch.id,
    });

    await Promise.all([netflix.save(), disneyplus.save(), hbo.save(), linkedIn.save(), glassDoor.save(), indeed.save(), stackoverflow.save()]);    
  } catch (err) {
    console.log(err);
  }
};

module.exports = { db, syncAndSeed, models: { Category, Bookmark }, };