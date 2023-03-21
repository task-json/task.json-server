/**
 * task.json-server
 * Copyright (C) 2021-2023  DCsunset
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/> 
 */

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
