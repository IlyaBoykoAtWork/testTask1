import { NextResponse } from "next/server"
import { z } from "zod"

import { createRouteJSON } from "@/app/templates/createRouteJSON"
import { db } from "@/../prisma"

const zInt = z.number().int()

export const { POST, fetch: createStock } = createRouteJSON(
	"POST",
	"/api/stock",
	z.object({
		shop_id: zInt,
		product_plu: zInt,
		amount_shelf: zInt,
		amount_ordered: zInt,
	}),
	async (body) => {
		const [stock] = await db.$transaction([
			db.stock.create({
				data: body,
			}),

			db.log.create({
				data: {
					shop_id: body.shop_id,
					product_plu: body.product_plu,
					action: "STOCK_CREATED",
				},
			}),
		])

		return NextResponse.json(stock)
	},
)
