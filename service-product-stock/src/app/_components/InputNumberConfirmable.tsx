import { useState } from "react"

import useStrAsNumber from "../templates/useStrAsNumber"
import Button from "./Button"
import Input from "./Input"
import Throbber from "./Throbber"

export default function InputNumberConfirmable({
	initial,
	onConfirm,
}: Readonly<{
	initial: number
	onConfirm: (delta: number) => Promise<void>
}>) {
	const [current, str, setStr] = useStrAsNumber(initial.toString())
	const [isApplying, setIsApplying] = useState(false)

	async function apply() {
		if (current === undefined) {
			return
		}
		setIsApplying(true)
		try {
			await onConfirm(current - initial)
		} finally {
			setIsApplying(false)
		}
	}

	return (
		<div className="flex">
			<Input
				value={str}
				onChange={setStr}
				disabled={isApplying}
				className="flex-grow"
			/>
			<Throbber enabled={isApplying} />
			{!isApplying && current !== undefined && current !== initial && (
				<Button onClick={apply}>✔️</Button>
			)}
		</div>
	)
}
