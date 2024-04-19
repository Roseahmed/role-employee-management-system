import express from "express";
import passport from "passport";
import { entryPoint } from "../middleware/entrypoint";
import { exitPoint } from "../middleware/exitpoint";
import * as RolesController from "../controllers/roles";
import { AccessType } from "../models/roles";
import { checkPermission } from "../middleware/permissions";

const router = express.Router();
const authenticate = passport.authenticate("bearer", { session: false });

router.post(
  "/add",
  entryPoint,
  authenticate,
  checkPermission(AccessType.WRITE),
  RolesController.add,
  exitPoint
);

router.put(
  "/update/:id",
  entryPoint,
  authenticate,
  checkPermission(AccessType.UPDATE),
  RolesController.updateOne,
  exitPoint
);

router.get(
  "/find/:id",
  entryPoint,
  authenticate,
  RolesController.findOne,
  exitPoint
);

router.get(
  "/find-all",
  entryPoint,
  authenticate,
  RolesController.findAll,
  exitPoint
);

router.delete(
  "/delete/:id",
  entryPoint,
  authenticate,
  checkPermission(AccessType.DELETE),
  RolesController.deleteOne,
  exitPoint
);

module.exports = router;
