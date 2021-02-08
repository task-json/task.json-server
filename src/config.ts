import * as path from "path";

const isProd = process.env.NODE_ENV === 'production';

export default {
	address: isProd ? "0.0.0.0" : "localhost",
	port: 3000,
};
