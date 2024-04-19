import * as Employee from "../models/employee";
import { Config } from "../config/config";

const config = new Config();

export async function addAdminUser() {
  try {
    let userData: Employee.IEmployee = {
      name: config.name,
      email: config.email,
      password: config.password,
      isAdmin: true,
    };
    // console.log("Default user info:", userData);

    // Check for duplicate entries
    const exisitngData = await Employee.findOne({
      email: userData.email,
    });

    if (exisitngData) {
      console.log("Admin user already exist");
      return;
    }

    Employee.create(userData, (err: any, result: any) => {
      if (err || !result) {
        console.log("Failed to create user: ", err?.message);
        return;
      }
      console.log("User created successfully");
    });
  } catch (error: any) {
    console.log("Add User error:", error?.message);
  }
}
