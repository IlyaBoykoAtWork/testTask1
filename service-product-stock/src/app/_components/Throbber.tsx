import clsx from "clsx"

export default function Throbber({
	className,
	enabled,
}: Readonly<{
	className?: string
	enabled: boolean
}>) {
	return (
		<svg
			className={clsx(
				"m-2 h-5 w-5 animate-spin",
				"drop-shadow-lg",
				"transition-[height]",
				enabled && "delay-1000",
				className,
			)}
			style={{
				height: enabled ? undefined : 0,
			}}
			viewBox="0 0 24 24"
		>
			<circle
				className="opacity-25"
				cx="12"
				cy="12"
				r="10"
				stroke="currentColor"
				strokeWidth="4"
			>
			</circle>
			<path
				className="opacity-75"
				fill="currentColor"
				d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
			>
			</path>
		</svg>
	)
}
