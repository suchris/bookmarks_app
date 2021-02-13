const html = require("html-template-tag");

module.exports = (bookmarks) => html`<!DOCTYPE html>
  <html>
    <head>
      <title>Bookmark App</title>
      <link rel="stylesheet" href="/style.css" />
    </head>
    <body>
      <div class="bookmarks-list">
        <header><img src="/logo.png" />Bookmarks</header>
        ${bookmarks.map(
          (bm) => html` <div class="bookmarks-item">
            <p>
              <span class="bookmarks-position">${bm.id}</span>
              <a href="${bm.url}">${bm.name}</a>
            </p>
          </div>`
        )}
      </div>
    </body>
  </html>`;
