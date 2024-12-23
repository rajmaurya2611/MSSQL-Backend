const router = require("express").Router();
const UserController = require("../controller/user.controller");

router.post("/registration", UserController.register);
router.post("/login", UserController.login);
router.get("/@me", UserController.me);


module.exports = router;
