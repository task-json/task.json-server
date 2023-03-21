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

// Use agent to persist sessions
describe("Session API", () => {
	let token = "";

	test("empty password", async () => {
		const resp = await app.inject({
			method: "POST",
			url: "/session"
		});
		expect(resp.statusCode).toEqual(400);
	});

	test("wrong password", async () => {
		const resp = await app.inject({
			method: "POST",
			url: "/session",
			payload: { password: "test" }			
		});
		expect(resp.statusCode).toEqual(401);
	});

	test("login", async () => {
		const resp = await app.inject({
			method: "POST",
			url: "/session",
			payload: { password: "admin" }			
		});
		expect(resp.statusCode).toEqual(200);

		const data = resp.json();
		expect("token" in data).toBe(true);
		token = resp.json().token;
	});

	test("access data", async () => {
		const resp = await app.inject({
			method: "GET",
			url: "/",
			headers: {
				authorization: `Bearer ${token}`
			}
		});
		expect(resp.statusCode).toEqual(200);
	});
});

describe("Data API", () => {
	let token = "";
	// Can be any string
	const tj = "test-data"

	test("login", async () => {
		const resp = await app.inject({
			method: "POST",
			url: "/session",
			payload: { password: "admin" }
		});
		expect(resp.statusCode).toEqual(200);

		const data = resp.json();
		expect("token" in data).toBe(true);
		token = resp.json().token;
	});

	// Delete TaskJson from last test
	test("delete", async () => {
		const resp1 = await app.inject({
			method: "DELETE",
			url: "?",
			headers: {
				authorization: `Bearer ${token}`
			}
		});
		expect(resp1.statusCode).toEqual(200);
		
		const resp2 = await app.inject({
			method: "GET",
			url: "?",
			headers: {
				authorization: `Bearer ${token}`
			}
		});
		expect(resp2.statusCode).toEqual(200);
		// Empty response
		expect(resp2.json()).toEqual({});
	});

	test("upload", async () => {
		const resp = await app.inject({
			method: "PUT",
			url: "?",
			headers: {
				authorization: `Bearer ${token}`
			},
			payload: {
				data: tj
			}
		});
		expect(resp.statusCode).toEqual(200);
	});

	test("download", async () => {
		const resp = await app.inject({
			method: "GET",
			url: "?",
			headers: {
				authorization: `Bearer ${token}`
			}
		});
		expect(resp.statusCode).toEqual(200);
		expect(resp.json()).toEqual({ data: tj });
	});

	test("delete", async () => {
		const resp1 = await app.inject({
			method: "DELETE",
			url: "?",
			headers: {
				authorization: `Bearer ${token}`
			}
		});
		expect(resp1.statusCode).toEqual(200);

		const resp2 = await app.inject({
			method: "GET",
			url: "?",
			headers: {
				authorization: `Bearer ${token}`
			}
		});
		expect(resp2.statusCode).toEqual(200);
		// Empty response
		expect(resp2.json()).toEqual({});
	});
});
