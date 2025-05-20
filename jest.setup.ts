import { items } from "./src/db/schema"; // Import your schema
import { create_db } from "./src/db";

const db = create_db();

beforeAll(async () => {
  console.log("Clearing database...");
  await db.delete(items);
});

afterAll(async () => {
  console.log("Closing DB connection...");
  await db.$client.end();
});
