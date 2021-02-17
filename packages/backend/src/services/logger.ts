import { createLogger, format, transports } from "winston";
import { Context, Next } from "koa";

export const logger = createLogger({
  format: format.cli(),
  transports: [new transports.Console()]
});

export async function defaultLogger(ctx: Context, next: Next) {
  await next();
  logger.log({
    level: "info",
    message: `[${new Date().toJSON()}] ${ctx.method} ${ctx.status} - ${
      ctx.path
    }`
  });
}
