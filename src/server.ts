import app from "./app";
import { config } from "./utils/config";

app.listen(3000, config.address);

console.log(`Server listening on http://${config.address}:3000`);
