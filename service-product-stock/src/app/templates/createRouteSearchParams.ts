import createRouteZodCreator from "./createRouteZodAbstract"

/**
 * Creator for routes that read GET search params and respond with JSON.
 */
export const createRouteSearchParams = createRouteZodCreator<
	Record<string, string | number | undefined>,
	Record<string, string>,
	"GET"
>(
	(req) => Object.fromEntries(req.nextUrl.searchParams.entries()),
	(data) =>
		Object.fromEntries(
			Object
				.entries(data)
				// Filter out undefined entries
				.filter((e) => e[1] !== undefined)
				.map(([k, v]) => [k, v!.toString()]),
		),
	(method, path, data) => {
		return fetch(path + "?" + new URLSearchParams(data), { method })
	},
)
