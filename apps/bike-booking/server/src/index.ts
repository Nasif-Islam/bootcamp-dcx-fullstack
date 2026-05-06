import app from "./app";
import * as dotenv from "dotenv";

dotenv.config();

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
