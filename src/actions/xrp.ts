import { Context, Next } from "koa";
import { logger } from "../services/logger";
import Wallet, * as Wallets from "../models/wallets";

export async function balance(ctx: Context, next: Next) {
  await next();
  const jwt = ctx.state.jwtValue;
  const owner = jwt?.user?.id;
  const wallets = await Wallet.count({ owner });
  if (wallets <= 0) {
    ctx.status = 204;
    ctx.body = { message: "No wallets found" };
    return;
  }
  const { name } = ctx.request.query;
  const walletName = typeof name === "string" ? name.toLowerCase() : "default";
  const balance = await Wallets.walletWithBalance(owner, walletName);
  ctx.status = 200;
  ctx.body = { balance };
}

export async function createWallet(ctx: Context, next: Next) {
  await next();
  const jwt = ctx.state.jwtValue;
  const owner = jwt?.user?.id;
  if (!ctx.request.body || !owner) {
    ctx.status = 400;
    return;
  }
  const { seed, name, mnemonic } = ctx.request.body;
  const wallet = await Wallets.createWallet({ owner, seed, name, mnemonic });
  ctx.status = 201;
  ctx.body = {
    owner,
    address: wallet.address,
    mnemonic: wallet.mnemonic,
    seed: wallet.seed
  };
}

export async function wallets(ctx: Context, next: Next) {
  await next();
  const jwt = ctx.state.jwtValue;
  const owner = jwt?.user?.id;
  const wallets = await Wallets.listWallets(owner);
  ctx.body = {
    wallets
  };
}

export async function recoverWallet(ctx: Context, next: Next) {
  await next();
  const jwt = ctx.state.jwtValue;
  const owner = jwt?.user?.id;
  const { seed, mnemonic, name } = ctx.request.body;
  if (!name) {
    ctx.status = 400;
    ctx.body = "A name must be provided for this wallet";
    return;
  }
  if (!mnemonic && !seed) {
    ctx.status = 400;
    ctx.body = "Either a seed or mnemonic must be provided";
    return;
  }
  const wallet = await Wallets.createWallet({ owner, seed, mnemonic, name });
  ctx.status = 201;
  ctx.body = { address: wallet.address, owner };
  return;
}

export async function del(ctx: Context, next: Next) {
  await next();
  logger.info(`${ctx.path}`);
}
