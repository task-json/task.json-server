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

import { config } from "./config";
import fs from "fs";
import path from "path";

export function saveData(taskJson: string) {
	const dataPath = path.join(config.dataPath, "task.json");

  if (!fs.existsSync(config.dataPath)) {
    fs.mkdirSync(config.dataPath);
  }

	fs.writeFileSync(
		dataPath,
		taskJson,
		{ encoding: "utf8" }
	);
}

export function loadData() {
	const dataPath = path.join(config.dataPath, "task.json");

	if (!fs.existsSync(dataPath)) {
		return undefined;
	}

	const data = fs.readFileSync(dataPath, { encoding: "utf8" });
	return data;
}

export function deleteData() {
	const dataPath = path.join(config.dataPath, "task.json");
	if (fs.existsSync(dataPath)) {
		fs.unlinkSync(dataPath);
	}
}
