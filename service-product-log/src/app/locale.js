"use client"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"

export function LocaleProvider(props) {
	return (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			{props.children}
		</LocalizationProvider>
	)
}
