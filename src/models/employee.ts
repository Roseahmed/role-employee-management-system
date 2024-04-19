import { Document, Schema, Model, model } from "mongoose";
import bcrypt from "bcryptjs";

const saltRounds = 13;

export interface IEmployee {
  name: string;
  email: string;
  mobile?: string;
  password: string;
  empCode?: string;
  rolesId?: string;
  isEnabled?: boolean;
  isAdmin?: boolean;
  createdAt?: Date;
  lastUpdatedAt?: Date;
}

export interface IEmployeeModel extends IEmployee, Document {}

const UsersSchema: Schema = new Schema(
  {
    name: { type: String },
    email: { type: String },
    mobile: { type: String },
    password: { type: String },
    empCode: { tyep: String },
    rolesId: { type: [String] },
    isEnabled: { type: Boolean, default: true },
    isAdmin: { type: Boolean, default: false },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    lastUpdatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    bufferCommands: false,
    versionKey: false,
  }
);

export const EmployeeModel: Model<IEmployeeModel> = model<IEmployeeModel>(
  "employee",
  UsersSchema,
  "employee"
);

// Return a salted password the same way that is done for the database.
export const createSaltedPassword = function (
  password: string,
  callback: Function
) {
  if (password) {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      bcrypt.hash(password, salt, function (err1, hash) {
        callback(err1, hash);
      });
    });
  }
};

export const compareSaltedPassword = function (
  password: string,
  hash: string,
  callback: Function
) {
  bcrypt.compare(password, hash, function (err, isMatch) {
    callback(err, isMatch);
  });
};

export const create = function (obj: any, cb: Function) {
  createSaltedPassword(obj?.password, function (err, hashedPassword) {
    if (err) {
      console.log(err);
      return;
    }
    obj["password"] = hashedPassword;
    EmployeeModel.insertMany([obj], function (err: any, result: any) {
      cb(err, result);
    });
  });
};

export let findOne = async function (query: any) {
  return EmployeeModel.findOne(query);
};

export let findOneByQuery = function (query: any, cb: Function) {
  EmployeeModel.findOne(query, (err: any, result: any) => {
    cb(err, result);
  });
};

export let findById = function (id: any, cb: Function) {
  EmployeeModel.findOne({ _id: id }, (err: any, result: any) => {
    cb(err, result);
  });
};

export let updateOne = function (query: any, obj: any, cb: Function) {
  obj.lastUpdatedAt = Date.now();
  if (obj.password) {
    createSaltedPassword(obj.password, function (err, hashedPassword) {
      if (err) {
        console.log(err);
        return;
      }
      obj.password = hashedPassword;
      EmployeeModel.updateOne(
        query,
        { $set: obj },
        function (err: any, result: any) {
          cb(err, result);
        }
      );
    });
  } else {
    EmployeeModel.updateOne(
      query,
      { $set: obj },
      function (err: any, result: any) {
        cb(err, result);
      }
    );
  }
};

export let findMany = function (query: any) {
  return EmployeeModel.find(query);
};

export let deleteUser = function (query: any, cb: Function) {
  EmployeeModel.deleteOne(query, function (err: any, result: any) {
    cb(err, result);
  });
};

export const find = async function (
  filter: object,
  projections: object | Array<string> | string,
  options: object,
  cb?: Function
) {
  if (cb) {
    EmployeeModel.find(
      filter,
      projections,
      options,
      (err: any, documents: any) => {
        if (err) {
          cb(err, null);
          return;
        }
        documents = JSON.parse(JSON.stringify(documents));
        cb(null, documents);
      }
    );
  } else {
    return new Promise((resolve, reject) => {
      EmployeeModel.find(
        filter,
        projections,
        options,
        (err: any, documents: any) => {
          if (err) {
            reject(err);
            return;
          }
          documents = JSON.parse(JSON.stringify(documents));
          resolve(documents);
        }
      );
    });
  }
};

export const aggegrate = async function (pipeline, cb?: Function) {
  if (cb) {
    EmployeeModel.aggregate(pipeline, (err, result) => {
      cb(err, result);
    });
  } else {
    return new Promise((resolve, reject) => {
      EmployeeModel.aggregate(pipeline, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  }
};
