import { NextResponse } from "next/server"
import { z } from "zod"
import type { $Enums, Prisma } from "@prisma/client"

import { createRouteJSON } from "@/app/templates/createRouteJSON"
import { db } from "@/../prisma"

// Making separate routes for addition and subtraction is impractical,
// but is required by the ToR.
// This (and also code deduplication reasons) is why this function exists.

export function createRouteStockAmountUpdater(
	path: string,
	action: $Enums.actions,
	makeUpdater: (by: number) => Prisma.IntFieldUpdateOperationsInput,
) {
	return createRouteJSON(
		"PATCH",
		path,
		z.object({
			shop_id: z.number().int(),
			product_plu: z.number().int(),
			by: z.number().int().min(1),
		}),
		async (body) => {
			const [stock] = await db.$transaction([
				db.stock.update({
					where: {
						shop_id_product_plu: body,
					},
					data: {
						amount_shelf: makeUpdater(body.by),
					},
				}),
				db.log.create({
					data: {
						shop_id: body.shop_id,
						product_plu: body.product_plu,
						action,
					},
				}),
			])
			return NextResponse.json(stock)
		},
	)
}
