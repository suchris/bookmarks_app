const html = require("html-template-tag");

module.exports = (categories) => html`<!DOCTYPE html>
  <html>
    <head>
      <title>Bookmark App</title>
      <link rel="stylesheet" href="/style.css" />
    </head>
    <body>
      <div class="bookmarks-list">
        <header><img src="/logo.png" />Bookmark Categories</header>
        ${categories.map(
          (cat) => html` <div class="bookmarks-item">
            <p>
              <span class="bookmarks-position">${cat.id}</span>
              <a href="/bookmarks/${cat.id}">${cat.name}</a>
              <small>(${cat.size})</small>
            </p>
          </div>`
        )}
      </div>
    </body>
  </html>`;
