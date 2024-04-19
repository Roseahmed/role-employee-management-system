import express from "express";

const router = express.Router();

router.use("/auth", require("./auth"));
router.use("/roles", require("./roles"));
router.use("/employees", require("./employee"));
router.use("/employee-role", require("./employee-role"));

module.exports = router;
