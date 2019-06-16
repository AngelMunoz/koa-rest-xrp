import { BaseContext } from 'koa';
import { logger } from '../services/logger';
import { User } from '../models/users';
import { KoaNext } from '../interfaces/annotations';

export async function find(ctx: BaseContext, next: KoaNext) {
  await next();
  const [list, count] = await Promise.all([User.find(), User.countDocuments()]);
  ctx.status = 200;
  ctx.body = { list, count };
}

export async function findOne(ctx: BaseContext, next: KoaNext) {
  await next();
  logger.info(`${ctx.path}`);
}

export async function update(ctx: BaseContext, next: KoaNext) {
  await next();
  logger.info(`${ctx.path}`);
}

export async function del(ctx: BaseContext, next: KoaNext) {
  await next();
  logger.info(`${ctx.path}`);
}
