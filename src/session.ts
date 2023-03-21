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

import * as Router from "@koa/router";
import { HttpError } from "./types/error";
import { config } from "./utils/config";
import * as crypto from "crypto";
import { auth, tokens } from "./middleware/auth";

const router = new Router();

// Create a session (log in)
router.post("/", async ctx => {
	const password = ctx.request.body?.password;
	if (!password)
		throw new HttpError(400, "Password required");
	
	if (password === config.password) {
		const token = crypto.randomBytes(16).toString("base64");
		tokens.push(token);
		if (tokens.length > config.maxClients)
			tokens.shift();
		ctx.body = { token };
	}
	else {
		throw new HttpError(401, "Wrong password");
	}
});

// Delete a session (log out)
router.delete("/", auth, async ctx => {
	const index = tokens.indexOf(ctx.token!);
	tokens.splice(index, 1);
	ctx.status = 200;
});

export default router;
