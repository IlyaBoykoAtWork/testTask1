import { NextResponse } from "next/server"
import z from "zod"

import { $Enums, db } from "@/db"

const zStrIntOpt = z.coerce.number().int().optional()
const zStrIntDateOpt = z.coerce.number().int().pipe(z.coerce.date()).optional()

const schema = z.object({
	shop_id: zStrIntOpt,
	plu: zStrIntOpt,

	date_min: zStrIntDateOpt,
	date_max: zStrIntDateOpt,

	action: z.nativeEnum($Enums.actions).optional(),

	page: z.coerce.number().int().min(0),
	pageSize: z.coerce.number().pipe(z.union([
		z.literal(10),
		z.literal(50),
		z.literal(100),
	])),
})

/**
 * Filters and returns logs.
 * @param {import("next/server").NextRequest} req
 * @returns {Promise<NextResponse>}
 */
export async function GET(req) {
	const { success, data } = schema.safeParse(
		Object.fromEntries(req.nextUrl.searchParams.entries()),
	)
	if (!success) {
		return new NextResponse(null, { status: 400 })
	}

	return await db.log.findMany({
		where: {
			shop_id: data.shop_id,
			product_plu: data.plu,
			date: {
				gte: data.date_min,
				lte: data.date_max,
			},
			action: data.action,
		},
		orderBy: {
			date: "desc",
		},
		skip: data.pageSize * data.page,
		take: data.pageSize,
	})
		.then(NextResponse.json)
		.catch((e) =>
			new NextResponse(
				e instanceof Error ? e.message : null,
				{ status: 500 },
			)
		)
}
