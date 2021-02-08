export class HttpError extends Error {
	constructor(public status: number, message: string) {
		super(message);
		this.status = status;
		this.message = message;
	}
}
