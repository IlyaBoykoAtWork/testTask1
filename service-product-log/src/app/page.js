// @ts-check
"use client"
import { $Enums } from "@/db"
import {
	ArrowBack,
	ArrowForward,
	FilterAlt,
	NoteAdd,
	TrendingDown,
	TrendingUp,
} from "@mui/icons-material"
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Grid2,
	IconButton,
	MenuItem,
	Paper,
	Select,
	Skeleton,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	Typography,
} from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers"
import { QueryClient, useQuery } from "@tanstack/react-query"
import dayjs from "dayjs"
import Image from "next/image"
import React, { useState } from "react"

// deno-fmt-ignore
const actionIcons = {
	"STOCK_INCREASED": <>Stock<TrendingUp/></>,
	"STOCK_DECREASED": <>Stock<TrendingDown/></>,
	"STOCK_CREATED": <>Stock<NoteAdd/></>,
	"PRODUCT_CREATED": <>Product<NoteAdd/></>,
}

const columns = [
	{
		field: "product_plu",
		headerName: "PLU",
		transform: (n) => <Typography fontSize={20}>{n}</Typography>,
	},
	{
		field: "shop_id",
		headerName: "№ Магазина",
		transform: (n) => <Typography fontSize={20}>{n}</Typography>,
	},
	{
		field: "date",
		headerName: "Дата",
		transform: (d) => (
			<Typography fontSize={16}>{dayjs(d).format("L LTS")}</Typography>
		),
	},
	{
		field: "action",
		headerName: "Действие",
		transform: (n) => (
			<Paper sx={{ display: "flex", alignItems: "center" }}>
				{actionIcons[n]}
			</Paper>
		),
	},
]

const qClient = new QueryClient()

export default function Home() {
	const [page, setPage] = useState(0)
	const [pageSize, setPageSize] = useState(10)
	const [filterDlgColumn, setFilterDlgColumn] = useState(null)

	const [filterPLU, setFilterPLU] = useState("")
	const [filterShop, setFilterShop] = useState("")
	const [filterDateMin, setFilterDateMin] = useState(null)
	const [filterDateMax, setFilterDateMax] = useState(null)
	const [filterAction, setFilterAction] = useState("")

	const { data, error, refetch, isFetching } = useQuery({
		queryKey: [
			page,
			pageSize,
			filterPLU,
			filterShop,
			filterDateMin,
			filterDateMax,
			filterAction,
		],
		async queryFn({ queryKey }) {
			const params = new URLSearchParams({
				page: queryKey[0].toString(),
				pageSize: queryKey[1].toString(),
			})
			for (
				const [name, val] of [
					["plu", queryKey[2]],
					["shop_id", queryKey[3]],
					["date_min", +queryKey[4]],
					["date_max", +queryKey[5]],
					["action", queryKey[6]],
				]
			) {
				if (val) {
					params.set(name, val)
				}
			}
			const res = await fetch("api/log?" + params)
			if (res.ok) {
				/** @type {{ shop_id: number | null; product_plu: number; date: string; action: $Enums.actions;}[]} */
				const data = await res.json()
				return data
			} else throw new Error(await res.text())
		},
	}, qClient)

	const primaryMouse = matchMedia("(pointer:fine)").matches

	return (
		<>
			<Dialog open={error !== null}>
				<DialogTitle>Ошибка</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Не удалось получить данные: {error?.message}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => refetch()} disabled={isFetching}>
						Попробовать снова
					</Button>
				</DialogActions>
			</Dialog>
			<Dialog open={filterDlgColumn !== null}>
				<DialogTitle>{filterDlgColumn?.headerName}</DialogTitle>
				<DialogContent>
					{[
						<TextField
							helperText="Фильтр для точного значения PLU"
							type="number"
							value={filterPLU}
							onChange={(e) => setFilterPLU(e.target.value)}
						/>,
						<TextField
							helperText="Фильтр для точного № магазина"
							type="number"
							value={filterShop}
							onChange={(e) => setFilterShop(e.target.value)}
						/>,
						<>
							<DatePicker
								label="С"
								value={filterDateMin}
								onChange={setFilterDateMin}
							/>
							<DatePicker
								label="По"
								value={filterDateMax}
								onChange={setFilterDateMax}
							/>
						</>,
						<Select
							sx={{ minWidth: "20rem" }}
							displayEmpty
							value={filterAction}
							onChange={(e) => setFilterAction(e.target.value)}
						>
							<MenuItem value="">
								<em>Нет фильтра</em>
							</MenuItem>
							{Object.values($Enums.actions).map((act) => (
								<MenuItem key={act} value={act}>
									{act}
								</MenuItem>
							))}
						</Select>,
					][columns.indexOf(filterDlgColumn)]}
				</DialogContent>
				<DialogActions>
					<Button onClick={setFilterDlgColumn.bind(null, null)}>
						Выйти
					</Button>
				</DialogActions>
			</Dialog>
			<Box
				sx={{
					position: "fixed",
					inset: "0",
					display: "grid",
					grid: "auto 1fr auto / 1fr",
				}}
			>
				<Paper
					sx={{ display: "flex", alignItems: "center", gap: "1rem" }}
				>
					<Image
						src="/favicon.ico"
						alt="Logo"
						width={64}
						height={64}
						priority={false}
					/>
					<Typography variant="h4">Logs</Typography>
				</Paper>
				<TableContainer sx={{ flexGrow: 1 }}>
					<Table stickyHeader>
						<TableHead>
							<TableRow>
								{columns.map((column) => (
									<TableCell
										key={column.field}
										sx={{
											"&:hover": {
												"button": { opacity: 1 },
											},
										}}
									>
										{column.headerName}
										{primaryMouse &&
											(
												<IconButton
													sx={{ opacity: 0 }}
													onClick={setFilterDlgColumn
														.bind(
															null,
															column,
														)}
												>
													<FilterAlt />
												</IconButton>
											)}
									</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							{data
								? data.map((row) => (
									<TableRow
										hover
										tabIndex={-1}
										key={row.date}
									>
										{columns.map((column) => (
											<TableCell key={column.field}>
												{column.transform(
													row[column.field],
												)}
											</TableCell>
										))}
									</TableRow>
								))
								: Array.from(
									{ length: pageSize },
									(_, i) => (
										<TableRow key={i}>
											{columns.map((column) => (
												<TableCell key={column.field}>
													<Skeleton></Skeleton>
												</TableCell>
											))}
										</TableRow>
									),
								)}
						</TableBody>
					</Table>
				</TableContainer>
				<Grid2
					container
					justifyContent="space-around"
					alignItems="center"
				>
					<Grid2 container alignItems="center">
						<IconButton
							disabled={page <= 0}
							onClick={setPage.bind(null, page - 1)}
						>
							<ArrowBack />
						</IconButton>
						<Typography variant="body1">
							Страница №{page + 1}
						</Typography>
						<IconButton
							disabled={data == null || data.length < pageSize}
							onClick={setPage.bind(null, page + 1)}
						>
							<ArrowForward />
						</IconButton>
					</Grid2>
					<Grid2 container alignItems="center" gap="1rem">
						<Typography variant="body1">
							Элементов на странице:
						</Typography>
						<Select
							value={pageSize}
							onChange={(e) => setPageSize(+e.target.value)}
						>
							{[10, 50, 100].map((n) => (
								<MenuItem key={n} value={n}>{n}</MenuItem>
							))}
						</Select>
					</Grid2>
				</Grid2>
			</Box>
		</>
	)
}
