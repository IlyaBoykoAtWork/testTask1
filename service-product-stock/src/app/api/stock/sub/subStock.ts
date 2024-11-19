import { createRouteStockAmountUpdater } from "../createRouteStockAmountUpdater"

export const { PATCH, fetch: subStock } = createRouteStockAmountUpdater(
	"/api/stock/sub",
	"STOCK_DECREASED",
	(by) => ({ decrement: by }),
)
