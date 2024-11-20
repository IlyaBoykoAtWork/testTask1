import clsx from "clsx"
import Image from "next/image"
import Link from "next/link"

export default function Header() {
	return (
		<header
			className={clsx(
				"p-2 sticky",
				"flex flex-row gap-4 items-center",
				"bg-slate-400 dark:bg-slate-700",
			)}
		>
			<Link href="/">
				<Image
					src="/favicon.ico"
					alt="Logo"
					height={32}
					width={32}
				/>
			</Link>
			<h2 className="text-3xl">Stock</h2>
		</header>
	)
}
