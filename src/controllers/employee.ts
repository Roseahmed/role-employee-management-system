import { Response, Request, NextFunction } from "express";
import { ErrorCodes } from "../models/models";
import { ObjectId } from "bson";
import * as Employee from "../models/employee";

export async function add(
  req: Request | any,
  res: Response,
  next: NextFunction
) {
  try {
    // Validate input parameters
    req.checkBody("name", "name is missing").notEmpty();
    req.checkBody("email", "email is missing").notEmpty();
    req.checkBody("password", "password is missing").notEmpty();
    const error = req.validationErrors();
    if (error) {
      req.apiStatus = {
        isSuccess: false,
        error: ErrorCodes[1001],
        customMsg: error[0]?.msg,
        data: {},
      };
      next();
      return;
    }

    let userData: Employee.IEmployee = req.body;
    delete userData.isAdmin; // remove admin property

    // Check for duplicate entries
    const exisitngData = await Employee.findOne({
      email: userData.email,
    });

    if (exisitngData) {
      console.log(req.txId, "Duplicate data", exisitngData);
      req.apiStatus = {
        isSuccess: false,
        error: ErrorCodes[1002],
        customMsg: "Already exist",
        data: {},
      };
      next();
      return;
    }

    Employee.create(userData, (err: any, result: any) => {
      if (err || !result) {
        req.apiStatus = {
          isSuccess: false,
          error: ErrorCodes[1002],
          data: {},
        };
      } else {
        req.apiStatus = {
          isSuccess: true,
          customMsg: "Employee Added",
          data: result[0],
        };
      }
      next();
      return;
    });
  } catch (error: any) {
    console.log("Add employee error:", error?.message ?? error);
    req.apiStatus = {
      isSuccess: false,
      error: ErrorCodes[1012],
      customMsg: error?.message ?? error,
      data: {},
    };
    next();
  }
}

export async function edit(
  req: Request | any,
  res: Response,
  next: NextFunction
) {
  try {
    let userId = req.params.id;

    let userData: any = req.body;

    const exisitngUser: any = await Employee.findMany({
      email: userData.email,
    });

    if (exisitngUser?.length >= 1) {
      console.log("exisitngUserupdate", exisitngUser);
      let existEntry: any = exisitngUser[0];
      if (existEntry && existEntry._id && String(existEntry._id) != userId) {
        req.apiStatus = {
          isSuccess: false,
          error: ErrorCodes[1006],
          customMsg: "Employee already exists",
          data: {},
        };
        next();
        return;
      }
    }

    Employee.updateOne({ _id: userId }, userData, (err: any, result: any) => {
      if (err || !result) {
        req.apiStatus = {
          isSuccess: false,
          error: ErrorCodes[1007],
          data: {},
        };
      } else if (
        result &&
        result.matchedCount < 1 &&
        result.modifiedCount < 1
      ) {
        req.apiStatus = {
          isSuccess: false,
          error: ErrorCodes[1004],
          data: {},
        };
      } else {
        req.apiStatus = {
          isSuccess: true,
          data: "User Updated",
        };
      }
      next();
      return;
    });
  } catch (error: any) {
    console.log("Update employee error:", error?.message ?? error);

    req.apiStatus = {
      isSuccess: false,
      error: ErrorCodes[1012],
      customMsg: error?.message ?? error,
      data: {},
    };
    next();
  }
}

export async function findById(
  req: Request | any,
  res: Response,
  next: NextFunction
) {
  try {
    let userId = req.params.id;

    if (!ObjectId.isValid(userId)) {
      req.apiStatus = {
        isSuccess: false,
        error: ErrorCodes[1013],
        data: {},
      };
      next();
      return;
    }

    const user = await Employee.findOne({ _id: new ObjectId(userId) });
    req.apiStatus = {
      isSuccess: true,
      data: user,
    };
    next();
  } catch (error: any) {
    console.log("Find one employee error:", error?.message ?? error);

    req.apiStatus = {
      isSuccess: false,
      error: ErrorCodes[1012],
      customMsg: error?.message ?? error,
      data: {},
    };
    next();
  }
}

export async function find(
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

    let result: any = await Employee.find({}, {}, options);
    req.apiStatus = {
      isSuccess: true,
      data: {
        documentCount: result?.length,
        documents: result,
      },
    };
    next();
  } catch (err: any) {
    console.error("Find all employee error:", err?.message);
    req.apiStatus = {
      isSuccess: false,
      error: ErrorCodes[1003],
      customMsg: err?.message,
      data: {},
    };
    next();
  }
}

export async function deleteEmployee(
  req: Request | any,
  res: Response,
  next: NextFunction
) {
  try {
    let userId = req.params.id;
    if (!userId) {
      req.apiStatus = {
        isSuccess: false,
        error: ErrorCodes[1001],
        customMsg: "Invalid object id: " + userId,
        data: {},
      };
      next();
      return;
    }

    if (!ObjectId.isValid(userId)) {
      req.apiStatus = {
        isSuccess: false,
        error: ErrorCodes[1013],
        data: {},
      };
      next();
      return;
    }

    Employee.deleteUser({ _id: userId }, (err: any, result: any) => {
      if (err || !result) {
        req.apiStatus = {
          isSuccess: false,
          error: ErrorCodes[1005],
          data: {},
        };
      } else if (result && result.deletedCount < 1) {
        req.apiStatus = {
          isSuccess: false,
          error: ErrorCodes[1004],
          data: {},
        };
      } else {
        req.apiStatus = {
          isSuccess: true,
          data: "Employee Deleted",
        };
      }
      next();
      return;
    });
  } catch (error: any) {
    console.log("Delete employee error:", error?.message ?? error);

    req.apiStatus = {
      isSuccess: false,
      error: ErrorCodes[1012],
      customMsg: error?.message ?? error,
      data: {},
    };
    next();
  }
}
