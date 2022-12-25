import fs from "fs";
import path from "path";
import { isConfig } from "./config.guard.js";

/**
 * Config
 * 
 * @see {isConfig} ts-auto-guard:type-guard
 */
export type Config = {
	/// Max age of token in days
	tokenMaxAge: number,
	/// Secret key to generate and encrypt the token
	tokenKey: string,
	/// Valid users (user is a secret ID. Recommend using UUID)
	users: string[]
}

export const rootPath = process.env.TASK_JSON_SERVER_PATH ?? "";

function readConfig() {
	const config = JSON.parse(
		fs.readFileSync(
			path.join(rootPath, "config.json"),
			"utf-8"
		)
	);
	if (!isConfig(config)) {
		throw new Error("Invalid config file");
	}
	return config;
}

export const config = readConfig();
