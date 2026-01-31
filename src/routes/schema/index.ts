import { z } from 'zod'

// Schema para validação de idiomas
export const languageSchema = z.enum(['pt', 'en', 'ja'])

// Schema para validação de legenda SRT
export const validateSubtitleSchema = z.object({
	subtitle: z.string().min(1, 'Arquivo de legenda não pode ser vazio')
})
