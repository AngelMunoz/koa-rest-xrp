"use strict";

import Koa from "koa";
import helmet from "koa-helmet";
import jwt from "koa-jwt";
import bodyParser from "koa-bodyparser";

import { router } from "./routes";
import { JWT_SECRET, HOST, PORT } from "./config";
import { connectToDB } from "./services/database";
import { defaultLogger, logger } from "./services/logger";
import { decodeToken } from "./services/jwt";

const app = new Koa();
app
  .use(helmet())
  .use(bodyParser())
  .use(
    jwt({ secret: JWT_SECRET }).unless({
      path: [/^\/auth/, /^\/public/, /^\/favicon/, /^\//, /^\/check/]
    })
  )
  .use(decodeToken)
  .use(defaultLogger)
  .use(router.routes())
  .use(router.allowedMethods())
  .on("error", (err, ctx) => {
    if (ctx) {
      logger.error(`[${err}] ${ctx.status} - ${ctx.href}`);
    } else {
      logger.error(`[${err}]`);
    }
  });

async function main() {
  try {
    await connectToDB();
  } catch (error) {
    throw new Error(error.message);
  }
  app.listen(PORT, HOST, () => {
    logger.info(
      `Server Ready at [${HOST}:${PORT}] - ${new Date().toUTCString()}`
    );
  });
}

process.on("unhandledRejection", (reason, promise) => {
  promise.catch(err => {
    logger.error(`Unhandled Promise: [${reason}]: ${err.stack}`);
    process.exit(1);
  });
});

main();
