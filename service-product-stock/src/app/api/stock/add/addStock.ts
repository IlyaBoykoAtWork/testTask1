import { createRouteStockAmountUpdater } from "../createRouteStockAmountUpdater"

export const { PATCH, fetch: addStock } = createRouteStockAmountUpdater(
	"/api/stock/add",
	"STOCK_INCREASED",
	(by) => ({ increment: by }),
)
