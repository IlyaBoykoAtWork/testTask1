"use client"

export default function TextLine({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<span className="text-nowrap whitespace-nowrap overflow-ellipsis">
			{children}
		</span>
	)
}
