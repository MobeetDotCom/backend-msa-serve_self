const { route_utils,route_user } = require("./routes");
const router = require("express").Router();

router.use("/utils",route_utils);
router.use("/user",route_user);

module.exports = router;