"use client"

import { useState } from "react"
import { z } from "zod"

const parserInputNumber = z.string().min(1).pipe(z.coerce.number())

/**
 * Creates string state with 2 getters:
 * coerced number and the string itself
 */
export default function useStrAsNumber() {
	const [str, set] = useState<string>("")
	return [parserInputNumber.safeParse(str).data, str, set] as const
}