import express from "express";
import passport from "passport";
import { entryPoint } from "../middleware/entrypoint";
import { exitPoint } from "../middleware/exitpoint";
import * as Employee from "../controllers/employee";

const router = express.Router();
const authenticate = passport.authenticate("bearer", { session: false });

router.post("/add", entryPoint, Employee.add, exitPoint);

router.put("/update/:id", entryPoint, authenticate, Employee.edit, exitPoint);

router.get("/find/:id", entryPoint, authenticate, Employee.findById, exitPoint);

router.get("/find-all", entryPoint, authenticate, Employee.find, exitPoint);

router.delete(
  "/delete/:id",
  entryPoint,
  authenticate,
  Employee.deleteEmployee,
  exitPoint
);

module.exports = router;
