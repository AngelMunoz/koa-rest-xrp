export const HOST = process.env.HOST || "127.0.0.1";
export const PORT =
  parseInt(process.env.PORT ? process.env.PORT : "5000") || 5000;
export const JWT_SECRET = process.env.JWT_SECRET || "oh so secret";
export const DB_URL = process.env.DB_URL || "mongodb://localhost:27017/KostaDB";
export const XRP_GRPC_URL =
  process.env.XRP_GRPC_URL || "test.xrp.xpring.io:50051";
export const IS_PROD = process.env.NODE_ENV === "production";
