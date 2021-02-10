import * as path from "path";

export const isProd = process.env.NODE_ENV === 'production';

export const config = {
	address: process.env.ADDR || (isProd ? "0.0.0.0" : "localhost"),
	port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
	dataPath: process.env.DATA_PATH
		|| (isProd ? "/task.json" : path.join(__dirname, "../../tests/task.json")),
	password: process.env.PASSWORD || "admin",
	maxClients: process.env.MAX_CLIENTS ? parseInt(process.env.MAX_CLIENTS) : 3
};
