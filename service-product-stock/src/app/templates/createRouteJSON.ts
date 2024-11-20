import createRouteZodCreator from "./createRouteZodAbstract"

/**
 * Creator for routes that read JSON and respond with JSON.
 */
export const createRouteJSON = createRouteZodCreator(
	(req) => req.json(),
	(data) => data,
	(method, path, data) =>
		fetch(path, {
			method,
			body: data == null ? null : JSON.stringify(data),
		}),
)
