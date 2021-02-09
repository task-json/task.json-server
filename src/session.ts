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
		ctx.body = token;
	}
	else {
		throw new HttpError(401, "Wrong password");
	}
});

// Delete a session (log out)
router.delete("/", auth, async ctx => {
	const index = tokens.indexOf(ctx.token!);
	tokens.splice(index, 1);
	ctx.state = 200;
});

export default router;
