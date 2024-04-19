require("dotenv").config();

// importing all the env variables
export class Config {
  serviceName = process.env.SERVICE_NAME || "Role employee management system";
  port = process.env.PORT || "8000";
  baseUrl = process.env.BASE_URL || "http://localhost:8000";
  mongoDbUri =
    process.env.MONGO_URI_DB || "mongodb://localhost:27017/role-employee";

  name = process.env.NAME || "Admin";
  email = process.env.EMAIL || "admin@gmail.com";
  password = process.env.PASSWORD || "Admin@123";
}
