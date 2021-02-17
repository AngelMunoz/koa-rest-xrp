import { BaseContext, Context, Next } from "koa";
import { logger } from "../services/logger";
import { User } from "../models/users";

export async function find(ctx: Context, next: Next) {
  await next();
  const [list, count] = await Promise.all([User.find(), User.countDocuments()]);
  ctx.status = 200;
  ctx.body = { list, count };
}

export async function findOne(ctx: Context, next: Next) {
  await next();
  logger.info(`${ctx.path}`);
}

export async function update(ctx: Context, next: Next) {
  await next();
  logger.info(`${ctx.path}`);
}

export async function del(ctx: Context, next: Next) {
  await next();
  logger.info(`${ctx.path}`);
}
