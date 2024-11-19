import createRouteZodCreator from "./createRouteZodAbstract"

/**
 * Creator for routes that read GET search params and respond with JSON.
 */
export const createRouteSearchParams = createRouteZodCreator<
	Record<string, string>,
	"GET"
>(
	(req) => Object.fromEntries(req.nextUrl.searchParams.entries()),
	(method, path, data) => {
		const url = new URL(path)
		url.search = new URLSearchParams(data).toString()
		return fetch(url, { method })
	},
)
