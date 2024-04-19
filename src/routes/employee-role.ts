import express from "express";
import passport from "passport";
import { entryPoint } from "../middleware/entrypoint";
import { exitPoint } from "../middleware/exitpoint";
import * as EmployeeRole from "../controllers/employee-role";

const router = express.Router();
const authenticate = passport.authenticate("bearer", { session: false });

router.get(
  "/find",
  entryPoint,
  authenticate,
  EmployeeRole.findEmployeeRole,
  exitPoint
);

module.exports = router;
