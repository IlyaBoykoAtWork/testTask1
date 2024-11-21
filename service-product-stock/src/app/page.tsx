import clsx from "clsx"
import Link from "next/link"

export default function Home() {
	return (
		<nav className="flex flex-wrap">
			{["/products", "/stocks"].map((href) => (
				<div
					key={href}
					className={clsx(
						"p-8 m-4",
						"bg-slate-400 dark:bg-slate-700",
						"filter hover:contrast-125",
						"relative top-0 hover:top-2",
						"transition-[filter,top]",
						"rounded-lg shadow-lg",
					)}
				>
					<Link href={href} className="text-6xl underline">
						{href}
					</Link>
				</div>
			))}
		</nav>
	)
}
