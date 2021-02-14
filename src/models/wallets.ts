import { Schema, model, Document } from "mongoose";

export type WalletSchema = {
  seed: string;
  owner: string;
  name: string;
  mnemonic: string;
  address: string;
};

export interface WalletModel extends Document, WalletSchema {}

const WalletSchema = new Schema<Document<WalletSchema>>({
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
  address: { type: String, required: true },
  owner: { type: String, required: true },
  name: { type: String, required: true }
});

WalletSchema.index({ seed: 1 }, { unique: true });
export const Wallet = model<WalletModel>("Wallet", WalletSchema, "wallets");
Wallet.createIndexes();
