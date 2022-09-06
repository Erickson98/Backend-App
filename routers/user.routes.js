const { Router } = require("express");
const {
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/user.controllers.js");

const routerUser = Router();

routerUser.get("/Users", getUser);
routerUser.put("/Users/:_id/:rol", updateUser);
routerUser.delete("/Users/:_id", deleteUser);
module.exports = routerUser;
