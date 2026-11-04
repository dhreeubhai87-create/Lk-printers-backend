module.exports = app => {
  const category = require("../controllers/category.controller");

  const router = require("express").Router();

  // CREATE
  router.post("/", category.create);

  // GET ALL
  router.get("/", category.getAll);

  // UPDATE
  router.put("/:id", category.update);

  // DELETE
  router.delete("/:id", category.remove);

  app.use("/api/category", router);
};