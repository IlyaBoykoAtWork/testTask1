import clsx from "clsx"

import Input from "./Input"

export default function InputRange(props: {
	min: number | undefined
	max: number | undefined
	strMin: string
	strMax: string
	setStrMin: (m: string) => void
	setStrMax: (m: string) => void
}) {
	return (
		<div
			className={clsx(
				props.min != null && props.max != null &&
					props.min > props.max &&
					"bg-red-800 dark:bg-red-500",
				"p-1 rounded-md",
				"grid grid-cols-2",
			)}
		>
			<label className="grid grid-cols-subgrid">
				от
				<Input
					type="number"
					value={props.strMin}
					onChange={props.setStrMin}
				/>
			</label>
			<label className="grid grid-cols-subgrid">
				до
				<Input
					type="number"
					value={props.strMax}
					onChange={props.setStrMax}
				/>
			</label>
		</div>
	)
}