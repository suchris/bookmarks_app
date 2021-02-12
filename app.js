const { Sequelize, DataTypes } = require('sequelize');
const express = require("express");

const db = new Sequelize('postgres://localhost:5432/bookmark');

const run = async () => {
    await db.sync({ force: true });
    db.close();
}

run();

const Category = db.define('category', {
    name: { type: DataTypes.STRING, },
});

const Bookmark = db.define('bookmark', {
    name: { type: DataTypes.STRING, },
    url: { type: DataTypes.STRING, },
});

Bookmark.belongsTo(Category);
Category.hasMany(Bookmark);

// const app = express();

// app.use(morgan("dev"));
// app.use(express.static(__dirname + "/public"));

// app.use('/', require("./routes/posts"));

// app.use('/bookmarks', require("./routes/posts"));

// app.use('/add', require("./routes/posts"));

// const PORT = 1337;

// app.listen(PORT, () => {
//   console.log(`App listening in port ${PORT}`);
// });

