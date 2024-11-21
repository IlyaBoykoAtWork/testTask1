"use client"
import { useQuery } from "@tanstack/react-query"
import clsx from "clsx"
import { Fragment, useRef, useState } from "react"
import { z } from "zod"

import { filterProduct } from "../api/product/filterProduct"
import SectionGrid from "../_components/SectionGrid"
import Throbber from "../_components/Throbber"
import TextLine from "../_components/TextLine"
import Input from "../_components/Input"
import Button from "../_components/Button"
import { createProduct } from "../api/product/createProduct"
import { useDebounce } from "@uidotdev/usehooks"

const parserInputPLU = z.string().min(1).pipe(z.coerce.number())

export default function Products() {
	const [filterPLU, setFilterPLU] = useState<string | undefined>()
	const [filterName, setFilterName] = useState<string | undefined>()

	const plu = parserInputPLU.safeParse(filterPLU).data
	const name = filterName || undefined // undefined if empty string

	const { data, isFetching, refetch } = useQuery({
		queryKey: ["products", useDebounce(plu, 1000), useDebounce(name, 500)],
		queryFn: ({ queryKey }) =>
			filterProduct({
				plu: queryKey[1] as number | undefined,
				name: queryKey[2] as string | undefined,
			}),
	})
	const lastData = useRef(data)
	if (data) {
		lastData.current = data
	}

	async function onAddClick() {
		if (
			name === undefined || !confirm(
				`Добавить товар "${name}"?`,
			)
		) {
			return
		}

		await createProduct({ plu, name })
		await refetch()
	}

	return (
		<SectionGrid colsTemplate="minmax(0, 1fr) 1fr" className="p-3">
			<TextLine>PLU</TextLine>
			<TextLine>Название</TextLine>
			<Input
				type="number"
				value={filterPLU}
				onChange={setFilterPLU}
			/>
			<Input
				type="text"
				maxLength={1000}
				value={filterName}
				onChange={setFilterName}
			/>
			<Button
				onClick={onAddClick}
				disabled={name === undefined}
				className="my-2"
			>
				+ Добавить
			</Button>
			<Button
				onClick={() => refetch()}
				disabled={isFetching}
				className="my-2"
			>
				Обновить
			</Button>
			<div className="flex flex-col col-span-2">
				<Throbber className="self-center" enabled={isFetching} />
			</div>
			<SectionGrid
				colsTemplate="subgrid"
				className={clsx(
					"p-4",
					"bg-slate-400 dark:bg-slate-700",
					"rounded-lg shadow-md",
					"col-span-2",
				)}
			>
				{lastData.current?.map((product) => (
					<>
						<Fragment key={product.plu}>
							<TextLine>{product.plu}</TextLine>
							<TextLine>{product.name}</TextLine>
						</Fragment>
						<hr className="opacity-40 col-span-2" />
					</>
				))}
			</SectionGrid>
		</SectionGrid>
	)
}
