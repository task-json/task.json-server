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

import { HttpError } from "./types/error";
import { loadData, saveData, deleteData } from './utils/data';
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


// Create a session (log in)
fastify.post("/session", async (req, reply) => {
	const { password } = (req.body as any) ?? {};
	if (!password) {
		throw new HttpError(400, "Password required");
	}
	
	if (password === config.password) {
		const token = fastify.jwt.sign({});
		reply.send({ token });
	}
	else {
		throw new HttpError(401, "Wrong password");
	}
});


// Download
fastify.get("/", async (req, reply) => {
	await req.jwtVerify();
	reply.send({
		data: loadData()
	});
});

// Upload (can upload encrypted data)
fastify.put("/", async (req, reply) => {
	await req.jwtVerify();
	const { data } = (req.body as any) ?? {};
	if (data) {
		saveData(data);
	}
	else {
		throw new HttpError(400, "Data required");
	}
});

// Delete
fastify.delete("/", async (req, reply) => {
	await req.jwtVerify();
	deleteData();
});

export default fastify;
