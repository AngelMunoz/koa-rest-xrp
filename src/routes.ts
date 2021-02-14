import { BaseContext, Next } from "koa";
import Router from "koa-router";
// import other routes

import * as Auth from "./actions/auth";
import * as Users from "./actions/users";

export const router = new Router();

router
  .get("/check", (ctx: BaseContext, next: Next) => {
    ctx.status = 200;
    return next();
  })
  // auth
  .post("/auth/login", Auth.login)
  .post("/auth/signup", Auth.signup)
  // users
  .get("/api/users", Users.find)
  .get("/api/users/:id", Users.findOne)
  .patch("/api/users/:id", Users.update)
  .del("/api/users/:id", Users.del);
