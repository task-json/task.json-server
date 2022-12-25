import fs from "node:fs";
import path from "node:path";

export const readData = (user: string) => {
	try {
		const data = fs.readFileSync(path.join(
			process.env.TASK_JSON_SERVER_DATA || "",
			user
		));
		return data.toString("utf-8");
	}
	catch(err) {
		return null;
	}
}
