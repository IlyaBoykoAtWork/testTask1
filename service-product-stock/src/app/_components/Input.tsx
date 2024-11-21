import clsx from "clsx"

type Override<A, B> = Omit<A, keyof B> & B

type InputProps = Override<JSX.IntrinsicElements["input"], {
	onChange: (value: string) => void
}>

export default function Input(props: InputProps) {
	return (
		<input
			{...props}
			onChange={(e) => props.onChange(e.target.value)}
			className={clsx(
				"p-1 min-w-0",
				"bg-blue-500 dark:bg-blue-900",
				"border border-solid border-slate-900 dark:border-slate-200",
				"rounded-md shadow-inner",
				props.className,
			)}
		/>
	)
}
