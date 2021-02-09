// This import is necessary for type augmentation
import "koa";

declare module 'koa' {
	interface BaseContext {
		token?: string;
	}
}
