const express = require("express");
const router = express.Router();

router.get("/", (_req, res) => {
  res.send(`
    <html>
      <head>
        <title>欢迎来到我们的后端服务！</title>
      </head>
      <body>
        <p>后端启动成功,如有需要，您可以通过API进行交互。</p>
      </body>
    </html>
  `);
});

module.exports = {
  indexRoutes: router,
};
