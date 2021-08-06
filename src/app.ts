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
