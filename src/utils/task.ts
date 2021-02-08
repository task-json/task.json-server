import { initTaskJson, isTaskJson, TaskJson } from "task.json";
import { config, isTest } from "./config";
import * as fs from "fs";

export function saveTaskJson(taskJson: TaskJson) {
	if (isTest)
		return;

	fs.writeFileSync(
		config.dataPath,
		JSON.stringify(taskJson, null, "\t"),
		{ encoding: "utf8" }
	);
}

export function loadTaskJson() {
  try {
		if (isTest)
			throw new Error();

    const data = fs.readFileSync(config.dataPath, { encoding: "utf8" });
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
