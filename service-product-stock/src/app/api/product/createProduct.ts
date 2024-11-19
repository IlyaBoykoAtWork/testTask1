import { NextResponse } from "next/server"
import { z } from "zod"

import { createRouteJSON } from "@/app/templates/createRouteJSON"
import { db } from "@/../../shared/db"

export const { POST, fetch: createProduct } = createRouteJSON(
	"POST",
	"/api/product",
	z.object({
		plu: z.number().int().optional(),
		name: z.string(),
	}),
	async (body) => {
		const { product } = await db.log.create({
			data: {
				shop_id: undefined,
				product: {
					create: body,
				},
				action: "PRODUCT_CREATED",
			},
			select: {
				product: true,
			},
		})
		return NextResponse.json(product)
	},
)
