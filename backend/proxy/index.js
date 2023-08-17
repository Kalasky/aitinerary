const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

app.use(
  "/api",
  createProxyMiddleware({ target: "http://backend:5000", changeOrigin: true })
);
app.use(
  "/",
  createProxyMiddleware({ target: "http://frontend:3000", changeOrigin: true })
);

app.listen(8000, () => {
  console.log("Proxy server running on http://localhost:8000");
});
