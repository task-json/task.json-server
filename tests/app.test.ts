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

import fastify from "../src/app";
import * as supertest from "supertest";

// Use agent to persist sessions
const agent = supertest.agent(fastify.server);

describe("Session API", () => {
	let token = "";

	test("empty password", async () => {
		const resp = await agent.post("/session");
		expect(resp.status).toEqual(400);
	});

	test("wrong password", async () => {
		const resp = await agent.post("/session")
			.send({ password: "test" });
		expect(resp.status).toEqual(401);
	});

	test("login", async () => {
		const resp = await agent.post("/session")
			.send({ password: "admin" });
		expect(resp.status).toEqual(200);
		token = resp.body.token;
	});

	test("access data", async () => {
		const resp = await agent.get("/")
			.set("Authorization", `Bearer ${token}`);
		expect(resp.status).toEqual(200);
	});
});

describe("Data API", () => {
	let token = "";
	// Can be any string
	const tj = "test-tj"

	test("login", async () => {
		const resp = await agent.post("/session")
			.send({ password: "admin" });
		expect(resp.status).toEqual(200);
		token = resp.body.token;
	});

	// Delete TaskJson from last test
	test("delete", async () => {
		const resp1 = await agent.delete("/")
			.set("Authorization", `Bearer ${token}`);
		expect(resp1.status).toEqual(200);

		const resp2 = await agent.get("/")
			.set("Authorization", `Bearer ${token}`);
		expect(resp2.status).toEqual(200);
		// Empty response
		expect(resp2.body).toEqual({});
	});

	test("upload", async () => {
		const resp = await agent.put("/")
			.set("Authorization", `Bearer ${token}`)
			.send(tj);
		expect(resp.status).toEqual(200);
	});

	test("download", async () => {
		const resp = await agent.get("/")
			.set("Authorization", `Bearer ${token}`);
		expect(resp.status).toEqual(200);
		expect(resp.body).toEqual({ data: tj });
	});

	test("delete", async () => {
		const resp1 = await agent.delete("/")
			.set("Authorization", `Bearer ${token}`);
		expect(resp1.status).toEqual(200);

		const resp2 = await agent.get("/")
			.set("Authorization", `Bearer ${token}`);
		expect(resp2.status).toEqual(200);
		// Empty response
		expect(resp2.body).toEqual({});
	});
});
