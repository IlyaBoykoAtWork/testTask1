import { NextResponse } from "next/server"
import { z } from "zod"

import { db } from "@/../prisma"
import { createRouteSearchParams } from "@/app/templates/createRouteSearchParams"

export const { GET, fetch: filterProduct } = createRouteSearchParams(
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
