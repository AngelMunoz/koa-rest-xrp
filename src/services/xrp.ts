import {
  Wallet,
  XrpClient,
  XrplNetwork,
  XrpUtils,
  XpringClient,
  XrpPayIdClient
} from "xpring-js";
import { IS_PROD, XRP_GRPC_URL } from "../config";

const network = () => (IS_PROD ? XrplNetwork.Main : XrplNetwork.Test);

export function clientFactory() {
  return new XrpClient(XRP_GRPC_URL, network());
}

export function xpringClientFactory() {
  const client = clientFactory();
  const payidClient = new XrpPayIdClient(network());
  return new XpringClient(payidClient, client);
}

// FIXME: I need to either refactor this stuff out or figure out why
// the WalletFactory stuff didn't work

export function generateWalletFromSeed(seed: string) {
  return Wallet.generateWalletFromSeed(seed);
}

export function generateWalletFromMnemonic(mnemonic: string) {
  return Wallet.generateWalletFromMnemonic(mnemonic);
}

export function generateRandomWallet() {
  return Wallet.generateRandomWallet();
}

export async function getBalance(wallet: Wallet) {
  const client = clientFactory();
  const balance = await client.getBalance(wallet.getAddress());
  return XrpUtils.dropsToXrp(balance as any);
}

export function sendToXRPAddress(
  amount: string,
  recipient: { address: string; tag?: number },
  wallet: Wallet
) {
  const { address, tag } = recipient;
  var toSend = tag ? XrpUtils.encodeXAddress(address, tag) : toSend;
  const client = clientFactory();
  const drops = XrpUtils.xrpToDrops(amount);
  return client.sendXrp(drops, toSend, wallet);
}

export function sendToPayId(amount: string, recipient: string, wallet: Wallet) {
  const client = xpringClientFactory();
  const drops = XrpUtils.xrpToDrops(amount);
  return client.send(drops, recipient, wallet);
}

export function checkPaymentStatus(hash: string) {
  const client = clientFactory();
  return client.getPaymentStatus(hash);
}

export function getPaymentHistory(wallet: Wallet) {
  const client = clientFactory();
  return client.paymentHistory(wallet.getAddress());
}
