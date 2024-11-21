import { NextRequest, NextResponse } from "next/server"
import type { ZodType } from "zod"
import { Prisma } from "@/db"

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
	ReqAllowed,
	ReqRaw, // Serialized data format type
	Method extends string, // REST method
>(
	getDataFromReq: (req: NextRequest) => Promise<ReqRaw> | ReqRaw,
	serialize: (data: ReqAllowed) => ReqRaw,
	createFetch: (
		method: NoInfer<Method>,
		path: string,
		data: ReqRaw,
	) => Promise<Response>,
) {
	return function createRouteZod<Req extends ReqAllowed, Res>(
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
				try {
					return await handler(data)
				} catch (e) {
					if (e instanceof Prisma.PrismaClientKnownRequestError) {
						return new NextResponse(
							// Error description is at the last line of the message
							e.message.substring(
								e.message.lastIndexOf("\n") + 1,
							),
							{ status: 500 },
						)
					} else if (e instanceof Error) {
						return new NextResponse(e.message, { status: 500 })
					}
				}
			},
			/** Fetch data from the server client-side */
			async fetch(body) {
				const res = await createFetch(method, path, serialize(body))
				if (res.ok) {
					return res.json()
				}
				throw new Error(await res.text())
			},
		} as
			& {
				// Name of this property depends on runtime value of `method`
				[_ in Method]: (req: NextRequest) => Promise<NextResponse>
			}
			& {
				fetch: (body: Req) => Promise<Res>
			}
	}
}
