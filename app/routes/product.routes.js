module.exports = app => {
  const product = require("../controllers/product.controller");

  const router = require("express").Router();

  router.post("/", product.create);
  router.get("/", product.getAll);
  router.put("/:id", product.update);
  router.delete("/:id", product.remove);

  app.use("/api/product", router);
};
