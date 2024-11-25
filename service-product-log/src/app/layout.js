import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter"
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript"
import { ThemeProvider } from "@mui/material/styles"
import { Roboto } from "next/font/google"
import { CssBaseline } from "@mui/material"

import theme from "./theme"
import { LocaleProvider } from "./locale"

export const roboto = Roboto({
	weight: ["300", "400", "500", "700"],
	subsets: ["latin"],
	display: "swap",
	variable: "--font-roboto",
})

export const metadata = {
	title: "Logs",
	description: "Log viewer service",
}

export const viewport = {
	width: "device-width",
	initialScale: 1,
}

export default function RootLayout({ children }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={roboto.className}>
				<AppRouterCacheProvider>
					<InitColorSchemeScript attribute="class" />
					<ThemeProvider theme={theme}>
						<CssBaseline />
						<LocaleProvider>
							{children}
						</LocaleProvider>
					</ThemeProvider>
				</AppRouterCacheProvider>
			</body>
		</html>
	)
}
