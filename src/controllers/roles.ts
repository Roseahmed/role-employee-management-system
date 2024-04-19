import { Request, Response, NextFunction } from "express";
import { ObjectId } from "bson";
import { ErrorCodes } from "../models/models";
import * as Roles from "../models/roles";

export const add = async function (
  req: Request | any,
  res: Response,
  next: NextFunction
) {
  try {
    req.checkBody("name", "name is missing").notEmpty();
    req.checkBody("permissions", "permissions is missing").notEmpty();
    const error = req.validationErrors();
    if (error) {
      req.apiStatus = {
        isSuccess: false,
        error: ErrorCodes[1002],
        customMsg: error[0]?.msg,
        data: {},
      };
      next();
      return;
    }

    let payload = req.body;

    let isPermissionExist = await Roles.findOne(
      { name: payload?.name },
      {},
      {}
    );
    if (isPermissionExist) {
      console.log("Permission name already exist");
      req.apiStatus = {
        isSuccess: false,
        error: ErrorCodes[1002],
        customMsg: "Permission name already exist",
        data: {},
      };
      next();
      return;
    }

    let result: any = await Roles.create(payload);

    req.apiStatus = {
      isSuccess: true,
      data: result[0],
    };
    next();
  } catch (err: any) {
    console.log("Add roles error:", err?.message);
    req.apiStatus = {
      isSuccess: false,
      error: ErrorCodes[1003],
      customMsg: err?.message,
      data: {},
    };
    next();
    return;
  }
};

export const updateOne = async function (
  req: Request | any,
  _res: Response,
  next: NextFunction
) {
  try {
    const documentId = req?.params?.id;
    const customer = req.body;

    if (!documentId || !ObjectId.isValid(documentId)) {
      req.apiStatus = {
        isSuccess: false,
        error: ErrorCodes[1001],
        customMsg:
          "Invalid document id || Missing mandatory params document id",
        data: {},
      };
      next();
      return;
    }

    if (Object.keys(customer).length === 0) {
      req.apiStatus = {
        isSuccess: false,
        error: ErrorCodes[1002],
        data: {},
      };
      next();
      return;
    }

    const payload = req.body;
    await Roles.updateOne({ _id: new ObjectId(documentId) }, payload);

    req.apiStatus = {
      isSuccess: true,
      customMsg: "Document update successfull",
      data: {},
    };
    next();
  } catch (error: any) {
    console.error("Roles update error:", error?.message ?? error);

    req.apiStatus = {
      isSuccess: false,
      error: ErrorCodes[1008],
      customMsg: error?.message ?? error,
      data: {},
    };
    next();
  }
};

export const findOne = async function (
  req: Request | any,
  _res: Response,
  next: NextFunction
) {
  try {
    const documentId = req?.params?.id;
    if (!documentId || !ObjectId.isValid(documentId)) {
      req.apiStatus = {
        isSuccess: false,
        error: ErrorCodes[1008],
        customMsg: {
          errorCode: ErrorCodes[1008]["errorCode"],
          message: !documentId
            ? ErrorCodes[1008]["message"]
            : "Document Id invalid",
        },
        data: {},
      };
      next();
      return;
    }

    let result: any = await Roles.findOne(
      { _id: new ObjectId(documentId) },
      {},
      {}
    );

    req.apiStatus = {
      isSuccess: true,
      data: result,
    };
    next();
  } catch (err: any) {
    console.log("Find one role error:", err?.message);
    req.apiStatus = {
      isSuccess: false,
      error: ErrorCodes[1004],
      customMsg: err?.message,
      data: {},
    };
    next();
  }
};

export const deleteOne = async function (
  req: Request | any,
  _res: Response,
  next: NextFunction
) {
  try {
    const documentId = req.params.id;
    if (!documentId || !ObjectId.isValid(documentId)) {
      req.apiStatus = {
        isSuccess: false,
        error: ErrorCodes[1001],
        customMsg: "Invalid document Id || Missing mandatory params",
      };
      next();
      return;
    }

    await Roles.deleteOne({ _id: new ObjectId(documentId) });
    req.apiStatus = {
      isSuccess: true,
      customMsg: "Document deleted successfully",
      data: {},
    };
    next();
  } catch (err: any) {
    console.error("Delete one role error:", err?.message ?? err);
    req.apiStatus = {
      isSuccess: false,
      error: ErrorCodes[1006],
      customMsg: err?.message ?? err,
      data: {},
    };
    next();
  }
};

export const findAll = async function (
  req: Request | any,
  res: Response,
  next: NextFunction
) {
  try {
    let { page, limit, sortDirection, sortBy } = req.query;
    let skip;

    sortDirection = parseInt(sortDirection ? sortDirection : -1);
    sortBy = sortBy ? sortBy : "createdAt";

    const options: any = {
      sort: {
        [sortBy]: sortDirection,
      },
    };

    if (page && limit) {
      page = parseInt(page);
      limit = parseInt(limit);

      skip = (page - 1) * limit;

      options["limit"] = limit;
      options["skip"] = skip;
    }

    let result: any = await Roles.findMany({}, {}, options);
    req.apiStatus = {
      isSuccess: true,
      data: {
        documentCount: result?.length,
        documents: result,
      },
    };
    next();
  } catch (err: any) {
    console.error("Find all roles error:", err?.message);
    req.apiStatus = {
      isSuccess: false,
      error: ErrorCodes[1003],
      customMsg: err?.message,
      data: {},
    };
    next();
  }
};
