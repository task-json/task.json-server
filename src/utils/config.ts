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

export const isProd = process.env.NODE_ENV === 'production';

export const config = {
	host: process.env.TJ_ADDR || (isProd ? "0.0.0.0" : "localhost"),
	port: process.env.TJ_PORT ? parseInt(process.env.TJ_PORT) : 3000,
	dataPath: process.env.TJ_DATA_PATH || "./data",
	// password for login
	password: process.env.TJ_PASSWORD || "admin",
	jwt: {
	// secret for signing jwt
		secret: process.env.TJ_JWT_SECRET || "secret",
		expiresIn: process.env.TJ_JWT_EXPIRES_IN || "60d",
	}
};
