import { connect } from "mongoose";
import { DB_URL } from "../config";

export async function connectToDB() {
  try {
    await connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
  } catch (error) {
    process.stderr.write(
      `Database Connection could not be stablished ${error}\n`
    );
    process.exit(1);
  }
}
