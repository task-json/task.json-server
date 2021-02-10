#!/usr/bin/env node

import app from "./app";
import { config } from "./utils/config";

app.listen(config.port, config.address);

console.log(`Server listening on http://${config.address}:${config.port}`);
