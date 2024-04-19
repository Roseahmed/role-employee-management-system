import { Request, Response, NextFunction } from "express";
import { ErrorCodes } from "../models/models";
import * as Employee from "../models/employee";

export const findEmployeeRole = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  try {
    let userId = req?.user?._id;
    if (!userId) {
      req.apiStatus = {
        isSuccess: false,
        error: ErrorCodes[1006],
        customMsg: "User not authorized",
        data: {},
      };
      next();
      return;
    }

    let aggegrate = [
      {
        $addFields: {
          rolesId: {
            $map: {
              input: "$rolesId",
              as: "id",
              in: {
                $convert: {
                  input: "$$id",
                  to: "objectId",
                  onError: "",
                },
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: "roles",
          localField: "rolesId",
          foreignField: "_id",
          as: "rolesDocs",
        },
      },
      {
        $project: {
          name: 1,
          permissionName: {
            $map: {
              input: "$rolesDocs",
              as: "doc",
              in: {
                _id: "$$doc._id",
                name: "$$doc.name",
              },
            },
          },
        },
      },
    ];
    let result: any = await Employee.aggegrate(aggegrate);

    req.apiStatus = {
      isSuccess: true,
      data: result,
    };
    next();
  } catch (err: any) {
    console.log("Find employee role error:", err?.message);
    req.apiStatus = {
      isSuccess: false,
      error: ErrorCodes[1007],
      customMsg: err?.message,
      data: {},
    };
    next();
    return;
  }
};
