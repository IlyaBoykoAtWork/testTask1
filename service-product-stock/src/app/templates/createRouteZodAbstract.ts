import { NextRequest, NextResponse } from "next/server"
import type { ZodType } from "zod"

/**
 * @module
 * Essentially recreates tRPC
 */

/**
 * The ultimate route creator - makes route creators for various input and output data formats.
 * @param getDataFromReq Transformer from request to input data, that would be verified and passed to handlers.
 * @param createFetch Callback that makes a request to this endpoint with given data of the specified format.
 * @returns Route creator for the specified data format.
 */
export default function createRouteZodAbstract<
	ReqRaw, // Serialized data format type
	Method extends string, // REST method
>(
	getDataFromReq: (req: NextRequest) => Promise<ReqRaw> | ReqRaw,
	createFetch: (
		method: NoInfer<Method>,
		path: string,
		data: ReqRaw,
	) => Promise<Response>,
) {
	return function createRouteZod<Req, Res>(
		/** REST method */
		method: Method,
		/** URL path */
		path: string,
		dataValidator: ZodType<Req>,
		handler: (body: Req) => Promise<NextResponse<Res>>,
	) {
		return {
			async [method](req: NextRequest) {
				let data
				try {
					data = dataValidator.parse(await getDataFromReq(req))
				} catch {
					// Validation failed
					return new NextResponse(null, { status: 400 })
				}
				return await handler(data)
			},
			/** Fetch data from the server client-side */
			async fetch(body) {
				const res = await createFetch(method, path, body)
				return await res.json()
			},
		} as
			& {
				// Name of this property depends on runtime value of `method`
				[_ in Method]: (req: NextRequest) => Promise<NextResponse>
			}
			& {
				fetch: (body: ReqRaw) => Promise<Res>
			}
	}
}
