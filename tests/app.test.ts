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

import app from "../src/app";
import { TaskJson, mergeTaskJson, initTaskJson } from "task.json";
import * as supertest from "supertest";

// Use agent to persist sessions
const agent = supertest.agent(app.callback());

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

	test("invalid logout", async () => {
		const resp = await agent.delete("/session");
		expect(resp.status).toEqual(401);
	});

	test("login", async () => {
		const resp = await agent.post("/session")
			.send({ password: "admin" });
		expect(resp.status).toEqual(200);
		token = resp.body.token;
	});

	test("logout", async () => {
		const resp = await agent.delete("/session")
			.set("Authorization", `Bearer ${token}`);
		expect(resp.status).toEqual(200);
	});
});

describe("TaskJson API", () => {
	const tj1: TaskJson = {
		todo: [
			{
				id: "1",
				text: "Hello, world 1",
				start: new Date("2000-01-01").toISOString(),
				modified: new Date("2010-07-07").toISOString(),
			},
			{
				id: "2",
				text: "Hello, world 2",
				start: new Date("2000-01-02").toISOString(),
				modified: new Date("2020-07-07").toISOString()
			}
		],
		done: [],
		removed: []
	};
	const tj2: TaskJson = {
		todo: [
			{
				id: "1",
				text: "Hello, world 1 modified",
				start: new Date("2000-01-01").toISOString(),
				modified: new Date("2020-07-07").toISOString()
			}
		],
		done: [
			{
				id: "4",
				text: "Hello, world 4",
				start: new Date("2000-01-04").toISOString(),
				modified: new Date("2020-07-07").toISOString()
			}
		],
		removed: []
	};
	let token = "";

	test("login", async () => {
		const resp = await agent.post("/session")
			.send({ password: "admin" });
		expect(resp.status).toEqual(200);
		token = resp.body.token;
	});

	// Delete TaskJson from last test
	test("delete TaskJson", async () => {
		const resp1 = await agent.delete("/")
			.set("Authorization", `Bearer ${token}`);
		expect(resp1.status).toEqual(200);

		const resp2 = await agent.get("/")
			.set("Authorization", `Bearer ${token}`);
		expect(resp2.status).toEqual(200);
		expect(resp2.body).toEqual(initTaskJson());
	});

	test("upload TaskJson", async () => {
		const resp = await agent.put("/")
			.set("Authorization", `Bearer ${token}`)
			.send(tj1);
		expect(resp.status).toEqual(200);
	});

	test("get TaskJson", async () => {
		const resp = await agent.get("/")
			.set("Authorization", `Bearer ${token}`);
		expect(resp.status).toEqual(200);
		expect(resp.body).toEqual(tj1);
	});

	test("sync TaskJson", async () => {
		const resp = await agent.patch("/")
			.set("Authorization", `Bearer ${token}`)
			.send(tj2);
		expect(resp.status).toEqual(200);
		expect(resp.body.data).toEqual(mergeTaskJson(tj1, tj2));
	});

	test("delete TaskJson", async () => {
		const resp1 = await agent.delete("/")
			.set("Authorization", `Bearer ${token}`);
		expect(resp1.status).toEqual(200);

		const resp2 = await agent.get("/")
			.set("Authorization", `Bearer ${token}`);
		expect(resp2.status).toEqual(200);
		expect(resp2.body).toEqual(initTaskJson());
	});

	test("invalid TaskJson", async () => {
		const tj3 = {
			todo: [],
			done: []
		};
		const tj4 = {
			todo: [
				{
					id: "4",
					text: "Hello, world 4",
					start: new Date("2000-01-04").toISOString(),
				}
			],
			done: [],
			removed: []
		};

		const resp1 = await agent.put("/")
			.set("Authorization", `Bearer ${token}`)
			.send(tj3);
		expect(resp1.status).toEqual(400);

		const resp2 = await agent.patch("/")
			.set("Authorization", `Bearer ${token}`)
			.send(tj4);
		expect(resp2.status).toEqual(400);

		// Empty body
		const resp3 = await agent.patch("/")
			.set("Authorization", `Bearer ${token}`);
		expect(resp3.status).toEqual(400);
	});
});
