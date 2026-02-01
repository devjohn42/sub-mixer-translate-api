import { z } from 'zod'

// Schema para validação de idiomas
export const languageSchema = z.enum(['pt', 'en', 'ja'])

// Schema para validação de legenda SRT
export const validateSubtitleSchema = z.object({
	subtitle: z.string().min(1, 'Arquivo de legenda não pode ser vazio')
})

// Schema para tradução de legenda
export const translateSubtitleSchema = z
	.object({
		subtitle: z.string().min(1, 'Arquivo de legenda não pode ser vazio'),
		sourceLang: languageSchema,
		targetLang: languageSchema,
		format: z.enum(['srt', 'json']).default('srt')
	})
	.refine((data) => data.sourceLang !== data.targetLang, {
		message: 'Idioma de origem e destino devem ser diferentes'
	})
