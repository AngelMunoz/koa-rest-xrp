import { BaseContext, Context, Next } from "koa";
import { logger } from "../services/logger";
import { Wallet } from "../models/wallets";
import {
  generateRandomWallet,
  generateWalletFromMnemonic,
  generateWalletFromSeed,
  getBalance
} from "../services/xrp";

export async function balance(ctx: Context, next: Next) {
  await next();
  const jwt = ctx.state.jwtValue;
  const owner = jwt?.user?.id;
  const wallets = await Wallet.find({ owner });
  if (!wallets || wallets.length <= 0) {
    ctx.status = 204;
    ctx.body = { message: "No wallets found for user" };
    return;
  }
  const { name } = ctx.request.query;
  const value = typeof name === "string" ? name.toLowerCase() : "default";
  const walletRecord = wallets.find(
    wallet => wallet.name.toLowerCase() === value
  );
  const wallet = walletRecord.seed
    ? generateWalletFromSeed(walletRecord.seed)
    : generateWalletFromMnemonic(walletRecord.mnemonic);
  const balance = await getBalance(wallet);
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
  if (seed) {
    const wallet = generateWalletFromSeed(seed);
    const walletRecord = new Wallet({
      seed,
      name: name ? name : "default",
      owner,
      address: wallet.getAddress()
    });
    await walletRecord.save();
    ctx.status = 201;
    ctx.body = { address: wallet.getAddress(), owner };
    return;
  }
  if (mnemonic) {
    const wallet = generateWalletFromMnemonic(mnemonic);
    const walletRecord = new Wallet({
      seed,
      name: name ? name : "default",
      owner,
      address: wallet.getAddress()
    });
    await walletRecord.save();
    ctx.status = 201;
    ctx.body = { address: wallet.getAddress(), owner };
    return;
  }
  const result = generateRandomWallet();
  const walletRecord = new Wallet({
    mnemonic: result.mnemonic,
    name: name ? name : "default",
    owner,
    address: result.wallet.getAddress()
  });
  await walletRecord.save();
  ctx.status = 201;
  ctx.body = {
    address: result.wallet.getAddress(),
    owner,
    mnemonic: result.mnemonic
  };
}

export async function wallets(ctx: Context, next: Next) {
  await next();
  const jwt = ctx.state.jwtValue;
  const owner = jwt?.user?.id;
  const wallets = await Wallet.find({ owner });
  ctx.body = {
    wallets: wallets.map(wallet => ({
      name: wallet.name,
      _id: wallet._id,
      address: wallet.address
    }))
  };
}

export async function del(ctx: Context, next: Next) {
  await next();
  logger.info(`${ctx.path}`);
}
