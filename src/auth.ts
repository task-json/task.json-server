import crypto from "node:crypto";
import { strict as assert } from 'node:assert';
import { config } from "./config.js";
import { DateTime } from "luxon";
import { isTokenPayload } from "./auth.guard.js";
import { preHandlerAsyncHookHandler } from "fastify";

function encrypt(data: string, key: string) {
	try {
		const iv = crypto.randomBytes(16);
		const cipher = crypto.createCipheriv("aes-256-gcm", Buffer.from(key, "utf-8"), iv);

		const encrypted = Buffer.concat([
			cipher.update(data, "utf-8"),
			cipher.final()
		]);
		// crypto uses 128-bit tag by default
		const tag = cipher.getAuthTag();
		assert.equal(tag.length, 16);
		return Buffer.concat([iv, tag, encrypted]).toString("base64");
	}
	catch (err) {
		console.error("error during encryption:", err);
		throw new Error("error during encryption");
	}
}

function decrypt(data: string, key: string) {
	try {
		const raw = Buffer.from(data, "base64");
		const iv = raw.subarray(0, 16);
		const tag = raw.subarray(16, 32);
		const encrypted = raw.subarray(32);

		const decipher = crypto.createDecipheriv("aes-256-gcm", Buffer.from(key, "utf-8"), iv);
		decipher.setAuthTag(tag);
		const decrypted = Buffer.concat([
			decipher.update(encrypted),
			decipher.final()
		]);

		return decrypted.toString("utf-8");
	}
	catch (err) {
		throw new Error("invalid token");
	}
}

/**
 * Token payload
 * 
 * @see {isTokenPayload} ts-auto-guard:type-guard
 */
export type TokenPayload = {
	userId: string,
	// ISO string
	expiryDate: string
}

export function generateToken(userId: string) {
	const payload: TokenPayload = {
		userId,
		expiryDate: DateTime.now().plus({ days: config.tokenMaxAge }).toISO()
	};

	const token = encrypt(JSON.stringify(payload), config.tokenKey);
	return token;
}

export function verifyToken(token: string) {
	const payload = JSON.parse(decrypt(token, config.tokenKey));
	if (!isTokenPayload(payload)) {
		throw new Error("malformed token");
	}
	if (DateTime.fromISO(payload.expiryDate) > DateTime.now()) {
		throw new Error("token expired");
	}

	return payload.userId;
}

export function getTokenFromHeader(header?: string) {
	if (header === undefined) {
		throw new Error("invalid header");
	}
	const split = header.split(" ");
	// should be bearer token
	if (split.length !== 2 || split[0].toLowerCase() !== "bearer") {
		throw new Error("invalid header");
	}
	return split[1];
}

// Authenticate
export const authHandler: preHandlerAsyncHookHandler = async (request, reply) => {
	try {
		const token = getTokenFromHeader(request.headers.authorization);
		const userId = verifyToken(token);
		request.userId = userId;
	}
	catch (err: any) {
		console.error(err.message);
		reply
			.code(401)
			.send();
		// mandatory, so the request is not executed further
		return reply;
	}
}
