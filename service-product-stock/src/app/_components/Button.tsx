import clsx from "clsx"

export default function Button(props: JSX.IntrinsicElements["button"]) {
	return (
		<button
			{...props}
			className={clsx(
				"p-1",
				"bg-gradient-to-br from-zinc-500 via-zinc-300 to-zinc-500",
				"dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-800",
				props.disabled || [
					"hover:from-zinc-400 hover:via-zinc-200 hover:to-zinc-400",
					"hover:dark:from-zinc-700 hover:dark:via-zinc-600 hover:dark:to-zinc-700",
					"opacity-90",
				],
				"rounded-md shadow-inner",
				props.className,
			)}
		/>
	)
}
