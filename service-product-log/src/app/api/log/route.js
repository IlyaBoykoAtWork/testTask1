import { NextResponse } from "next/server"
import z from "zod"

import { $Enums, db } from "@/../shared/db"

const zStrIntOpt = z.coerce.number().int().optional()
const zStrIntDateOpt = z.coerce.date(z.coerce.number().int()).optional()

const schema = z.object({
	shop_id: zStrIntOpt,
	plu: zStrIntOpt,

	date_min: zStrIntDateOpt,
	date_max: zStrIntDateOpt,

	action: z.enum(
		Object.values($Enums.actions),
	),
}).refine((o) =>
	// Make sure min is not bigger than max
	!(o.date_min && o.date_max && o.date_min.valueOf() >= o.date_max.valueOf())
)

/**
 * Filters and returns logs.
 * @param {import("next/server").NextRequest} req
 * @returns {Promise<NextResponse>}
 */
export async function GET(req) {
	const { success, data } = schema.safeParse(
		await req.json().catch(() => null),
	)
	if (!success) {
		return new NextResponse(null, { status: 400 })
	}

	const logs = await db.log.findMany({
		where: {
			shop_id: data.shop_id,
			product_plu: data.plu,
			date: {
				gte: data.date_min,
				lte: data.date_max,
			},
			action: data.action,
		},
	})

	return NextResponse.json(logs)
}
