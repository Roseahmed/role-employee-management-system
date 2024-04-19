import { Document, Schema, Model, model } from "mongoose";

export enum AccessType {
  READ = "READ",
  WRITE = "WRITE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
}

export interface IRole {
  name: string;
  description: string;
  permissions: [
    {
      pageName: string;
      pagePath: string;
      accessType: [string];
    }
  ];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IRoleModel extends IRole, Document {}

const RoleSchema: Schema = new Schema(
  {
    name: { type: String, unique: true, required: true },
    description: { type: String },
    permissions: [
      {
        pageName: { type: String },
        pagePath: { type: String },
        accessType: { type: [String] },
        _id: false,
      },
    ],
  },
  {
    versionKey: false,
    bufferCommands: false,
    timestamps: true,
  }
);

export const RoleModel: Model<IRoleModel> = model<IRoleModel>(
  "roles",
  RoleSchema,
  "roles"
);

export let create = async function (obj: any, cb?: Function) {
  if (cb) {
    RoleModel.insertMany([obj], {}, function (err: any, result: any) {
      cb(err, result);
    });
  } else {
    return new Promise((resolve, reject) => {
      RoleModel.insertMany([obj], {}, function (err: any, result: any) {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  }
};

export let findOne = async function (
  query: object | any,
  projection: object | Array<string> | string,
  options: object,
  cb?: Function
) {
  if (cb) {
    RoleModel.findOne(query, projection, options, (err: any, document: any) => {
      if (err) {
        cb(err, null);
        return;
      }
      document = JSON.parse(JSON.stringify(document));
      cb(null, document);
    });
  } else {
    return new Promise((resolve, reject) => {
      RoleModel.findOne(
        query,
        projection,
        options,
        (err: any, document: any) => {
          if (err) {
            reject(err);
            return;
          }
          document = JSON.parse(JSON.stringify(document));
          resolve(document);
        }
      );
    });
  }
};

export const updateOne = async function (
  filter: object,
  data: object,
  cb?: Function
) {
  if (cb) {
    RoleModel.updateOne(
      filter,
      data,
      { upsert: false },
      (err: any, status: any) => {
        if (status?.modifiedCount > 0) {
          cb(null, status);
        } else if (status?.matchedCount === 0) {
          err = "Document not found";
          cb(err, null);
        } else {
          cb(err, null);
        }
      }
    );
  } else {
    return new Promise((resolve, reject) => {
      RoleModel.updateOne(
        filter,
        data,
        { upsert: false },
        (err: any, status: any) => {
          if (status?.modifiedCount > 0) {
            resolve(status);
          } else if (status?.matchedCount === 0) {
            err = "Document not found";
            reject(err);
          } else {
            reject(err);
          }
        }
      );
    });
  }
};

export const findMany = async function (
  filter: object,
  projections: object | Array<string> | string,
  options: object,
  cb?: Function
) {
  if (cb) {
    RoleModel.find(filter, projections, options, (err: any, documents: any) => {
      if (err) {
        cb(err, null);
        return;
      }
      documents = JSON.parse(JSON.stringify(documents));
      cb(null, documents);
    });
  } else {
    return new Promise((resolve, reject) => {
      RoleModel.find(
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

export const deleteOne = async function (filter: object, cb?: Function) {
  if (cb) {
    RoleModel.deleteOne(filter, (err: any, status: any) => {
      if (err) {
        cb(err, null);
      } else if (status?.deletedCount > 0) {
        cb(null, status);
      } else {
        err = "Document not found";
        cb(err, null);
      }
    });
  } else {
    return new Promise((resolve, reject) => {
      RoleModel.deleteOne(filter, (err: any, status: any) => {
        if (err) {
          reject(err);
        } else if (status?.deletedCount > 0) {
          resolve(status);
        } else {
          err = "Document not found";
          reject(err);
        }
      });
    });
  }
};
