import { NextResponse } from "next/server"
import { z } from "zod"

import { db } from "@/db"
import { createRouteSearchParams } from "@/app/templates/createRouteSearchParams"

const zStrIntOpt = z.coerce.number().int().optional()

export const { GET, fetch: filterStock } = createRouteSearchParams(
	"GET",
	"/api/stock",
	z.object({
		plu: zStrIntOpt,
		shop_id: zStrIntOpt,

		shelf_min: zStrIntOpt,
		shelf_max: zStrIntOpt,

		ordered_min: zStrIntOpt,
		ordered_max: zStrIntOpt,
	}),
	async (body) => {
		const stocks = await db.stock.findMany({
			where: {
				product_plu: body.plu,
				shop_id: body.shop_id,
				amount_shelf: {
					gte: body.shelf_min,
					lte: body.shelf_max,
				},
				amount_ordered: {
					gte: body.ordered_min,
					lte: body.ordered_max,
				},
			},
		})
		return NextResponse.json(stocks)
	},
)
