import "./globals.css"

export const metadata = {
	title: "Logs",
	description: "Log viewer service",
}

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className="antialiased">
				{children}
			</body>
		</html>
	)
}