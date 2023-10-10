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

import Fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import fastifyCors from "@fastify/cors";

import { HttpError } from "./types/error.js";
import { loadData, saveData, deleteData } from './utils/data.js';
import { config } from "./utils/config.js";

const fastify = Fastify({
	logger: true
});

fastify.register(fastifyJwt, {
	secret: config.jwt.secret,
	sign: {
		expiresIn: config.jwt.expiresIn
	}
});

fastify.register(fastifyCors);

// Create a session (log in)
fastify.post("/session", {
	schema: {
		body: {
			type: "object",
			required: ["password"],
			properties: {
				password: { type: "string" }
			}
		}
	}
}, async (req, reply) => {
	const { password } = req.body as any;
	if (password === config.password) {
		const token = fastify.jwt.sign({});
		reply.send({ token });
	}
	else {
		throw new HttpError(401, "Wrong password");
	}
});

// Version of the current taskJson (how many updates)
// Used for lock-free concurrency control
const versionBuffer = new SharedArrayBuffer(32)
const currentVersion = new Uint32Array(versionBuffer);
currentVersion[0] = 0;
// max positive number of int32
const MAX_VERSION = ~(1 << 31);

// Download
fastify.get("/", async (req, reply) => {
	await req.jwtVerify();
	reply.send({
		data: loadData(),
		// Digest to detect change when 
		version: Atomics.load(currentVersion, 0)
	});
});

// Upload (can upload encrypted data)
fastify.put("/", {
	schema: {
		body: {
			type: "object",
			required: ["data", "version"],
			properties: {
				data: { type: "string" },
				version: { type: "number" }
			}
		}
	}
}, async (req, reply) => {
	await req.jwtVerify();
	const { data, version } = req.body as any;
	if (version === -1) {
		// -1 means overwriting jexisting data
		Atomics.add(currentVersion, 0, 1);
		saveData(data);
	}
	else if (Atomics.compareExchange(currentVersion, 0, version, (version+1) % MAX_VERSION) === version) {
		// Use CAS to ensure only one req saveData when there are concurrent requests with the same version
		saveData(data);
	}
	else {
		// 409 means conflict
		reply.code(409).send({
			// return the new version for client to retry
			data: loadData()
		});
	}
});

// Delete
fastify.delete("/", async (req, _reply) => {
	await req.jwtVerify();
	Atomics.add(currentVersion, 0, 1);
	deleteData();
});

export default fastify;
