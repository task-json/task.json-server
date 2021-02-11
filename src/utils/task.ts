import { initTaskJson, isTaskJson, TaskJson } from "task.json";
import { config } from "./config";
import * as fs from "fs";
import * as path from "path";

export function saveTaskJson(taskJson: TaskJson) {
	const dataPath = path.join(config.rootPath, "task.json");

  if (!fs.existsSync(config.rootPath)) {
    fs.mkdirSync(config.rootPath);
  }

	fs.writeFileSync(
		dataPath,
		JSON.stringify(taskJson, null, "\t"),
		{ encoding: "utf8" }
	);
}

export function loadTaskJson() {
	const dataPath = path.join(config.rootPath, "task.json");

  try {
    const data = fs.readFileSync(dataPath, { encoding: "utf8" });
		const taskJson = JSON.parse(data);
		if (!isTaskJson(taskJson)) {
			throw new Error();
		}
		return taskJson;
  }
  catch (error) {
		const taskJson = initTaskJson();
		return taskJson;
	}
}
