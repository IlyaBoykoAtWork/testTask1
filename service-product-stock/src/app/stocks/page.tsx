"use client"
import { useQuery } from "@tanstack/react-query"
import clsx from "clsx"
import { Fragment, useRef, useState } from "react"

import SectionGrid from "../_components/SectionGrid"
import Throbber from "../_components/Throbber"
import TextLine from "../_components/TextLine"
import Input from "../_components/Input"
import Button from "../_components/Button"
import { useDebounce } from "@uidotdev/usehooks"
import { createStock } from "../api/stock/createStock"
import { filterStock } from "../api/stock/filterStock"
import useStrAsNumber from "../templates/useStrAsNumber"
import InputRange from "../_components/InputRange"
import InputNumberConfirmable from "../_components/InputNumberConfirmable"
import { addStock } from "../api/stock/add/addStock"
import { subStock } from "../api/stock/sub/subStock"

const titles = ["PLU", "№ Магазина", "На полке", "В заказе"].map((s, i) => (
	<TextLine key={i}>{s}</TextLine>
))

export default function Products() {
	const [plu, strPLU, setStrPLU] = useStrAsNumber()
	const [shop_id, strShop, setStrShop] = useStrAsNumber()
	const [shelf_min, strShelfMin, setStrShelfMin] = useStrAsNumber()
	const [shelf_max, strShelfMax, setStrShelfMax] = useStrAsNumber()
	const [ordered_min, strOrderedMin, setStrOrderedMin] = useStrAsNumber()
	const [ordered_max, strOrderedMax, setStrOrderedMax] = useStrAsNumber()

	const [isAddOpen, setIsAddOpen] = useState(false)
	const [isAddFetching, setIsAddFetching] = useState(false)
	const addData = Array.from({ length: 4 }, useStrAsNumber)

	const { data, isFetching, refetch } = useQuery({
		queryKey: [
			"stocks",
			useDebounce(plu, 1000),
			useDebounce(shop_id, 1000),
			useDebounce(shelf_min, 500),
			useDebounce(shelf_max, 500),
			useDebounce(ordered_min, 500),
			useDebounce(ordered_max, 500),
		] as const,
		queryFn: ({ queryKey }) =>
			filterStock({
				plu: queryKey[1],
				shop_id: queryKey[2],
				shelf_min: queryKey[3],
				shelf_max: queryKey[4],
				ordered_min: queryKey[5],
				ordered_max: queryKey[6],
			}),
	})
	const lastData = useRef(data)
	if (data) {
		lastData.current = data
	}

	async function onAddClick() {
		const data = addData.map((state) => state[0])
		if (data.includes(undefined)) {
			return
		}
		setIsAddFetching(true)
		try {
			await createStock({
				product_plu: data[0]!,
				shop_id: data[1]!,
				amount_shelf: data[2]!,
				amount_ordered: data[3]!,
			})
		} catch (e) {
			if (e instanceof Error) {
				return alert("Ошибка!\n" + e.message)
			} else throw e
		} finally {
			setIsAddFetching(false)
		}
		await refetch()
	}

	async function onShelfUpdate(plu: number, shop_id: number, delta: number) {
		try {
			const fn = delta > 0 ? addStock : subStock
			await fn({
				product_plu: plu,
				shop_id,
				by: Math.abs(delta),
			})
		} catch (e) {
			if (e instanceof Error) {
				return alert("Ошибка!\n" + e.message)
			} else throw e
		}
		await refetch()
	}

	return (
		<SectionGrid
			colsTemplate="repeat(4, minmax(0, 1fr))"
			className="p-3"
		>
			{titles}
			<Input type="number" value={strPLU} onChange={setStrPLU} />
			<Input type="number" value={strShop} onChange={setStrShop} />
			<InputRange
				min={shelf_min}
				strMin={strShelfMin}
				setStrMin={setStrShelfMin}
				max={shelf_max}
				strMax={strShelfMax}
				setStrMax={setStrShelfMax}
			/>
			<InputRange
				min={ordered_min}
				strMin={strOrderedMin}
				setStrMin={setStrOrderedMin}
				max={ordered_max}
				strMax={strOrderedMax}
				setStrMax={setStrOrderedMax}
			/>
			<Button
				className="my-2 col-span-2"
				onClick={setIsAddOpen.bind(null, true)}
				disabled={isAddOpen}
			>
				+ Добавить
			</Button>
			<Button
				onClick={() => refetch()}
				disabled={isFetching}
				className="my-2 col-span-2"
			>
				Обновить
			</Button>
			{isAddOpen &&
				(
					<SectionGrid
						colsTemplate="subgrid"
						className={clsx(
							"p-4 mt-2",
							"bg-slate-400 dark:bg-slate-700",
							"rounded-lg shadow-md",
							"col-span-4",
						)}
					>
						{titles}
						{addData.map(([, val, set], i) => (
							<Input
								key={i}
								type="number"
								value={val}
								onChange={set}
							/>
						))}
						<Button
							className="my-2"
							onClick={onAddClick}
							disabled={addData.some((state) =>
								state[0] === undefined
							)}
						>
							Применить
						</Button>
						<Button
							className="my-2"
							onClick={setIsAddOpen.bind(null, false)}
						>
							Отменить
						</Button>
					</SectionGrid>
				)}
			<div className="flex flex-col col-span-4">
				<Throbber
					className="self-center"
					enabled={isFetching || isAddFetching}
				/>
			</div>
			<SectionGrid
				colsTemplate="subgrid"
				className={clsx(
					"p-4",
					"bg-slate-400 dark:bg-slate-700",
					"rounded-lg shadow-md",
					"col-span-4",
				)}
			>
				{lastData.current?.map((product) => (
					<Fragment key={product.product_plu + ";" + product.shop_id}>
						<TextLine>{product.product_plu}</TextLine>
						<TextLine>{product.shop_id}</TextLine>
						<InputNumberConfirmable
							initial={product.amount_shelf}
							onConfirm={onShelfUpdate.bind(
								null,
								product.product_plu,
								product.shop_id,
							)}
						/>
						<TextLine>{product.amount_ordered}</TextLine>
						<hr className="opacity-40 col-span-4" />
					</Fragment>
				))}
			</SectionGrid>
		</SectionGrid>
	)
}
