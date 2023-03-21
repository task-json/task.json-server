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

import * as Koa from 'koa';
import * as Router from '@koa/router';
import * as bodyParser from 'koa-bodyparser';
import * as logger from 'koa-logger';
import { HttpError } from "./types/error";
import { initTaskJson, mergeTaskJson, compareMergedTaskJson } from "task.json";
import * as cors from "@koa/cors";
import { taskJsonTypeGuard } from "./middleware/type-guard";
import { loadTaskJson, saveTaskJson } from './utils/task';
import { session, auth } from "./middleware/auth";
import sessionRouter from "./session";

const app = new Koa();
app.use(bodyParser());
app.use(logger());
app.use(cors());

// Universal error handler (this middleware should be before other routes)
app.use(async (ctx, next) => {
	try {
		await next();
	}
	catch (err) {
		if (err instanceof HttpError) {
			ctx.throw(err.status, err.message);
		}
		else {
			throw err;
		}
	}
});

// Acquire session info
app.use(session);

const router = new Router();
// Local store
let localTaskJson = loadTaskJson();

router.use("/session", sessionRouter.routes());

// Routes below need authenticating
router.use(auth);

// Download only
router.get("/", async ctx => {
	ctx.body = localTaskJson;
});

// Upload only
router.put("/", taskJsonTypeGuard, async ctx => {
	const taskJson = ctx.request.body;
	localTaskJson = taskJson;
	saveTaskJson(localTaskJson);
	ctx.status = 200;
});

// Sync
router.patch("/", taskJsonTypeGuard, async ctx => {
	const taskJson = ctx.request.body;
	const merged = mergeTaskJson(localTaskJson, taskJson);
	const stat = {
		client: compareMergedTaskJson(taskJson, merged),
		server: compareMergedTaskJson(localTaskJson, merged)
	};
	localTaskJson = merged;
	saveTaskJson(localTaskJson);
	ctx.body = {
		data: localTaskJson,
		stat
	};
});

// Clear remote
router.delete("/", async ctx => {
	localTaskJson = initTaskJson();
	saveTaskJson(localTaskJson);
	ctx.status = 200;
});

app.use(router.routes());
app.use(router.allowedMethods());

export default app;
