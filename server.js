const express = require("express");
const volleyball = require("volleyball");
const html = require("html-template-tag");
const { db, syncAndSeed, models: { Category, Bookmark } } = require("./db");

const app = express();
app.use(require("method-override")("_method"));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));
app.use(volleyball);

app.delete("/bookmarks/:id", async (req, res, next) => {
  try {
    const bookmark = await Bookmark.findByPk(req.params.id, {include: [Category]});

    const categoryId = bookmark.category.id;

    console.log(categoryId);

    await bookmark.destroy();
    console.log(categoryId);
    res.redirect(`/categories/${categoryId}`);
  } catch (err) {
      next(err);
  }
});

app.post("/", async (req, res, next) => {
  try {
    // create category if not found
    const [category] = await Category.findOrCreate({
      where: { name: req.body.category }
    });

    req.body.categoryId = category.id;
    
    const bookmark = await Bookmark.create(req.body);
    res.redirect("/");
  } catch (err) {
      next(err);
  }
});

app.get("/categories/:id", async (req, res, next) => {
  try {
    const bookmarks = await Bookmark.findAll({
      include: [Category]
    });
    console.log(`value: ${req.params.id}, type: ${typeof req.params.id}`);
    const category = await Category.findByPk(req.params.id);
    const totalNum = bookmarks.length;
    const bmsInCategory = bookmarks.filter((bm) => bm.category.id === category.id);

    res.send(html`
      <html>
        <head>
          <title>Bookmark App</title>
          <link rel="stylesheet" href="../style.css"/>
        </head>
        <body>
          <h2>Bookmarkers (${totalNum})</h2><a href="/">Back</a>
          <div>
            <h2>Category - ${category.name} (${bmsInCategory.length})</h2>
            <ul>
              ${bmsInCategory.map(
                (bm) => html` <li>
                  <a href="http://${bm.url}" target="_blank" rel="noopener noreferrer">${bm.name}</a>
                  <form method="POST" action="/bookmarks/${bm.id}?_method=DELETE"><button>x</button></form>             
                </li>`
              )}
            </ul>
          </div>
        </body>
      </html>
    `);
  } catch (err) {
    next(err);
  }
});

app.get("/", async (req, res, next) => {
  try {
    const [categories, bookmarks] = await Promise.all([
      Category.findAll(),
      Bookmark.findAll({
        include: [Category],
      }),
    ]);
    res.send(html`
      <html>
        <head>
          <title>Bookmark App</title>
          <link rel="stylesheet" href="style.css"/>
        </head>
        <body>
          <h2>Bookmarkers (${bookmarks.length})</h2>
          <h3>Add a bookmark</h3>
          <form method="POST" id='bookmark-form'>
            <input type="text" id="name" name="name" placeholder="enter site name">
            <input type="text" id="url" name="url" placeholder="enter site url">
            <input type="text" id="category" name="category" placeholder="enter category">
            <button>Save</button>
          </form>
          <div>
            <h2>Bookmark Categories</h2>
            <ul>
              ${categories.map(
                (category) => html` <li>
                  <a href="/categories/${category.id}">
                  ${category.name} (${bookmarks.filter((bm) => bm.category.id === category.id).length})</a>               
                </li>`
              )}
            </ul>
          </div>
        </body>
      </html>
    `);
  } catch (err) {
    next(err);
  }
});

const init = async () => {
  try {
    await syncAndSeed();
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`listening on port ${port}`));
  } catch (err) {
    console.log(err);
  }
};

init();