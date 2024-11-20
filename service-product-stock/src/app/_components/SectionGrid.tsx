"use client"
import clsx from "clsx"

export default function SectionGrid({
	colsTemplate,
	children,
	className,
}: Readonly<{
	colsTemplate: string
	children: React.ReactNode
	className?: string
}>) {
	return (
		<section
			className={clsx(
				"ml-4 mr-4 p-3",
				"grid gap-x-4",
				className,
			)}
			style={{
				gridTemplateColumns: colsTemplate,
			}}
		>
			{children}
		</section>
	)
}
