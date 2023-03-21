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

import * as path from "path";

export const isProd = process.env.NODE_ENV === 'production';

export const config = {
	host: process.env.ADDR || (isProd ? "0.0.0.0" : "localhost"),
	port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
	rootPath: process.env.ROOT_PATH
		|| (isProd ? "/data" : path.join(__dirname, "../../tests")),
	password: process.env.PASSWORD || "admin",
	jwt: {
		secret: process.env.SECRET || "secret",
		expiresIn: "90d",
	},
	maxClients: process.env.MAX_CLIENTS ? parseInt(process.env.MAX_CLIENTS) : 3
};
