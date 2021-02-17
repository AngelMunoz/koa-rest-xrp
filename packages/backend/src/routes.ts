import { BaseContext, Next } from "koa";
import Router from "koa-router";
// import other routes

import * as Auth from "./actions/auth";
import * as Xrp from "./actions/xrp";

export const router = new Router();

router
  .get("/check", (ctx: BaseContext, next: Next) => {
    ctx.status = 200;
    return next();
  })
  // auth
  .post("/auth/login", Auth.login)
  .post("/auth/signup", Auth.signup)
  // xrp
  .get("/api/xrp/balance", Xrp.balance)
  .get("/api/xrp/wallets", Xrp.wallets)
  .get(["/api/xrp/payments", "/api/xrp/payments/:name"], Xrp.payments)
  .post("/api/xrp/wallets", Xrp.createWallet);
