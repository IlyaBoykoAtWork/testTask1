"use client"
import { green, lightGreen } from "@mui/material/colors"
import { createTheme } from "@mui/material/styles"

export default createTheme({
	typography: {
		fontFamily: "var(--font-roboto)",
	},
	colorSchemes: {
		dark: true,
		light: true,
	},
	cssVariables: {
		colorSchemeSelector: "class",
	},
	palette: {
		primary: lightGreen,
		secondary: green,
	},
})
