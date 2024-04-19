import { Request, Response, NextFunction } from "express";
import { ErrorCodes } from "../models/models";
import { exitPoint } from "./exitpoint";
import * as Roles from "../models/roles";
import { ObjectId } from "bson";

export const checkPermission = function (accessType: string) {
  return async function (
    req: Request | any,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user: any = req?.user;

      // by default admin user has all the permission;
      if (user?.isAdmin) {
        next();
        return;
      }

      let fullSourceUrl = req.headers["x-source-url"] || null;
      console.log("Full soruce url:", fullSourceUrl);
      if (!fullSourceUrl) {
        req.apiStatus = {
          isSuccess: false,
          error: ErrorCodes[1009],
          customMsg: "Page not defined",
          data: {},
        };
        exitPoint(req, res);
        return;
      }

      let userRoles: any = [];
      if (user?.rolesId?.length) {
        user?.rolesId.forEach((role) => {
          if (ObjectId.isValid(role)) {
            userRoles.push(new ObjectId(role));
          }
        });
      }

      if (!userRoles?.length) {
        req.apiStatus = {
          isSuccess: false,
          error: ErrorCodes[1004],
          customMsg: "Roles not assigned or role Id's not valid",
          data: {},
        };
        exitPoint(req, res);
        return;
      }

      let rolesDoc: any = await Roles.findMany({ _id: userRoles }, {}, {});

      if (!rolesDoc?.length) {
        req.apiStatus = {
          isSuccess: false,
          error: ErrorCodes[1004],
          customMsg: "Roles not defined",
          data: {},
        };
        exitPoint(req, res);
        return;
      }

      // Logic to find the page from roles docs from given page
      if (rolesDoc?.length) {
        let isPermissionFound: boolean = false;
        for (let i = 0; i < rolesDoc?.length; i++) {
          const element = rolesDoc[i];

          if (element?.permissions?.length) {
            for (let j = 0; j < element?.permissions?.length; j++) {
              const eachPermission = element?.permissions[i];
              if (
                eachPermission?.pagePath == fullSourceUrl &&
                eachPermission?.accessType?.includes(accessType)
              ) {
                console.log("Permission granted:", eachPermission);
                isPermissionFound = true;
                break;
              }
            }
          }

          if (isPermissionFound) {
            break;
          }
        }

        if (isPermissionFound) {
          next();
          return;
        }

        req.apiStatus = {
          isSuccess: false,
          error: ErrorCodes[1004],
          customMsg: "Permission not found",
          data: {},
        };
        exitPoint(req, res);
        return;
      }
      throw new Error("Unknown error");
    } catch (err: any) {
      console.log("Check permission error:", err?.message);
      req.apiStatus = {
        isSuccess: false,
        error: ErrorCodes[1007],
        customMsg: err?.message,
        data: {},
      };
      exitPoint(req, res);
      return;
    }
  };
};
