import express, { Request, Response, NextFunction } from "express";
import passport from "passport";
import BearerStrategy from "passport-http-bearer";
import path from "path";
import cors from "cors";
import { Config } from "./config/config";
import * as Token from "./models/accesstoken";
import * as Users from "./models/employee";
import { DB } from "./models/db";
import { ResponseObj } from "./models/models";
import { addAdminUser } from "./seed/defaultUser";
const expressValidator = require("express-validator");
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json";

const config = new Config();
const db = new DB();
const app: any = express();

console.log("Mongodb connection string:", config.mongoDbUri);
db.connectWithRetry(config.mongoDbUri);

const port = config.port;

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));

const corsOptions = {
  origin: "*", // Set the origin in here before deployment
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: [
    "Origin",
    "Authorization",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "X-Source-Url",
  ],
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

// Express Validator
app.use(
  expressValidator({
    errorFormatter: function (param, msg, value) {
      const namespace = param.split(".");
      const root = namespace.shift();
      let formParam = root;

      while (namespace.length) {
        formParam += "[" + namespace.shift() + "]";
      }
      return {
        param: formParam,
        msg: msg,
        value: value,
      };
    },
  })
);

// passport strategy
passport.use(
  new BearerStrategy.Strategy(function (token, done) {
    Token.findByToken(token, function (err: Error, tokenFromDb: any) {
      if (err || !tokenFromDb) {
        let responseObj = new ResponseObj(401, "Unauthorized", undefined);
        return done(err, false, responseObj.toJsonString());
      }
      Users.findById(tokenFromDb.userId, function (err: Error, user: any) {
        if (err || !user) {
          let responseObj = new ResponseObj(401, "Unauthorized!", undefined);
          return done(err, false, responseObj.toJsonString());
        }
        return done(null, user, { scope: "all", message: "Success" });
      });
    });
  })
);

app.use(passport.initialize());

function autoSeed() {
  console.log("Auto seed initialized!!");
  addAdminUser();
}

function injectRoutes() {
  try {
    // inject routes here
    console.log("Injecting routers :: ", config.serviceName);

    app.use("/test", (req, res) => {
      res.send(config.serviceName + " is LIVE");
    });

    app.use("/v1/api", require("./routes/index"));

    // swagger setup
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    // catch 404 and forward to error handler
    app.use(function (req: Request, res: Response, next: NextFunction) {
      res.status(404).send("Page/Api Not Found");
      return;
    });

    // delay the start of auto seed function, so that db is ready
    setTimeout(() => {
      autoSeed();
    }, 10000);
  } catch (error: any) {
    console.log(
      "Error: Failed to inject routes :: " + config.serviceName,
      error?.message
    );
  }
}

app.use(express.static(path.join(process.cwd(), "public"))); // serving the static file

app.listen(port, () => {
  console.log("Server started at port:", port);
  injectRoutes();
});
