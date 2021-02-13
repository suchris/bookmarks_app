const { Sequelize, DataTypes, Model } = require("sequelize");
// const express = require("express");

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

// seed some data
const syncAndSeed = async () => {
  try {
    await db.sync({ force: true });
    const entertainment = await Category.create({ name: "Entertainment" });
    await Promise.all([entertainment.save()]);

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

    await Promise.all([netflix.save(), disneyplus.save(), hbo.save()]);
    const data = await Bookmark.findAll({ include: [{ model: Category }] });
    // console.log("All bookmarks:", JSON.stringify(data, null, 2));

    data.forEach((bm) => {
      console.log(
        `Name: ${bm.name}, Category: ${bm.category.name}, URL: ${bm.url}`
      );
    });
  } catch (err) {
    console.log(err);
  }
};

const run = async () => {
  await db.sync({ force: true });
  await syncAndSeed();
};

run().then(() => console.log("Done!"));

// const app = express();

// app.use(express.static(__dirname + "/public"));

// app.use("/", require("./routes/bookmarks"));

// app.use("/bookmarks", require("./routes/bookmarks"));

// app.use("/add", require("./routes/bookmarks"));

// const PORT = 1337;

// app.listen(PORT, () => {
//   console.log(`App listening in port ${PORT}`);
// });
