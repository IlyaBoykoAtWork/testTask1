import type { Metadata } from "next"
import "./globals.css"
import Header from "./_components/Header"
import ClientProviders from "./_components/ClientProviders"

export const metadata: Metadata = {
	title: "Stock",
	description: "Stock management service",
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body className="antialiased flex flex-col">
				<Header />
				<ClientProviders>
					{children}
				</ClientProviders>
			</body>
		</html>
	)
}
