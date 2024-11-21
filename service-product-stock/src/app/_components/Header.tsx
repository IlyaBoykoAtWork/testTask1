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
			<Link href="/" className="flex gap-4">
				<Image
					src="/favicon.ico"
					alt="Logo"
					height={32}
					width={32}
				/>
				<h2 className="text-3xl">Stock</h2>
			</Link>
			{["/products", "/stocks"].map((href) => (
				<Link key={href} href={href} className="text-2xl">
					{href}
				</Link>
			))}
		</header>
	)
}
