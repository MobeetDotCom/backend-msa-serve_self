const { route_utils } = require("./routes");
const router = require("express").Router();

router.use("/utils",route_utils);
module.exports = router;