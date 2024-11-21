import { NextResponse } from "next/server"
import { z } from "zod"

import { db } from "@/db"
import { createRouteSearchParams } from "@/app/templates/createRouteSearchParams"

export const { GET, fetch: filterStock } = createRouteSearchParams(
	"GET",
	"/api/product",
	z.object({
		name: z.string().optional(),
		plu: z.coerce.number().int().optional(),
	}),
	async (body) => {
		const products = await db.product.findMany({
			where: body,
		})
		return NextResponse.json(products)
	},
)
