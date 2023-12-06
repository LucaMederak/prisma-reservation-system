import "module-alias/register";
import dotenv from "dotenv";
dotenv.config();

import createServer from "./utils/server";

const port = process.env.PORT || 8000;
const app = createServer();

app.listen(port, async () => {
  console.log(`App is running at http://localhost:${port}`);
});
