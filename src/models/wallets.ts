import { Schema, model, Document } from "mongoose";
import { logger } from "../services/logger";
import { randomInt } from "crypto";
import {
  generateWalletFromSeed,
  generateWalletFromMnemonic,
  getWalletBalance,
  generateRandomWallet
} from "../services/xrp";

type IWallet = {
  seed: string;
  owner: string;
  name: string;
  mnemonic: string;
  address: string;
  tag?: number;
};

interface WalletModel extends Document, IWallet {}

const WalletSchema = new Schema<Document<IWallet>>({
  seed: {
    type: String,
    required() {
      return !this.mnemonic;
    }
  },
  mnemonic: {
    type: String,
    required() {
      return !this.seed;
    }
  },
  tag: { type: Number, required: false },
  address: { type: String, required: true },
  owner: { type: String, required: true },
  name: { type: String, required: true }
});

WalletSchema.index({ seed: 1 }, { unique: true }).index(
  { tag: 1 },
  { unique: true }
);
const Wallet = model<WalletModel>("Wallet", WalletSchema, "wallets");
Wallet.createIndexes(err => {
  if (!err) return;
  logger.warn(`Failed to create the wallet indexes - ${err.message}`);
});

export async function walletWithBalance(
  owner: string,
  name: string
): Promise<(Partial<WalletModel> & { balance: string }) | undefined> {
  const walletRecord = await Wallet.findOne({ owner, name });
  if (!walletRecord) return;
  const wallet = walletRecord.seed
    ? generateWalletFromSeed(walletRecord.seed)
    : generateWalletFromMnemonic(walletRecord.mnemonic);
  const balance = await getWalletBalance(wallet);
  return {
    owner,
    balance,
    name: walletRecord.name,
    address: walletRecord.address,
    tag: walletRecord.tag
  };
}
export type CreationPayload = {
  owner: string;
  seed?: string;
  name?: string;
  mnemonic?: string;
};

export async function createWallet({
  owner,
  seed,
  name,
  mnemonic
}: CreationPayload): Promise<WalletModel> {
  if (seed) {
    var wallet = generateWalletFromSeed(seed);
  } else if (mnemonic) {
    var wallet = generateWalletFromMnemonic(mnemonic);
  } else {
    var result = generateRandomWallet();
  }
  const payload = {
    owner,
    seed,
    mnemonic,
    name: name ? name : "default",
    tag: randomInt(150000)
  };
  const walletRecord: WalletModel = new Wallet({
    ...payload,
    address: wallet ? wallet.getAddress() : result.wallet.getAddress(),
    mnemonic: result ? result.mnemonic : mnemonic
  });
  return walletRecord.save();
}

export function listWallets(owner: string): Promise<Partial<WalletModel>[]> {
  return Wallet.find({ owner }).then(wallets =>
    wallets.map(wallet => ({
      name: wallet.name,
      _id: wallet._id,
      address: wallet.address,
      tag: wallet.tag
    }))
  );
}

export default Wallet;
