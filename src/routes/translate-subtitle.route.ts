import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { SubtitleService } from '../services/subtitle-service'
import { generateSRT, parseSRT } from '../utils/subtitle-parser'
import { translateSubtitleSchema } from './schema'

export const translateSubtitleRoute: FastifyPluginAsyncZod = async (app) => {
	app.post('/translate/subtitle', async (request, reply) => {
		try {
			// Validação com Zod
			const body = translateSubtitleSchema.parse(request.body)

			// Validar formato SRT
			const blocks = parseSRT(body.subtitle)

			if (blocks.length === 0) {
				return reply.code(400).send({
					success: false,
					error: 'Nenhum bloco de legenda válido encontrado'
				})
			}

			// Traduzir
			const subtitleService = new SubtitleService()
			const translatedBlocks = await subtitleService.translateSubtitle(
				body.subtitle,
				body.sourceLang,
				body.targetLang
			)

			// Retornar no formato solicitado
			if (body.format === 'json') {
				return {
					success: true,
					blocks: translatedBlocks,
					from: body.sourceLang,
					to: body.targetLang,
					total: translatedBlocks.length
				}
			}

			// Formato SRT (padrão)
			const srtContent = generateSRT(translatedBlocks)

			return reply
				.header('Content-Type', 'text/plain; charset=utf-8')
				.header(
					'Content-Disposition',
					`attachment; filename="translated_${body.sourceLang}_to_${body.targetLang}.srt"`
				)
				.send(srtContent)
		} catch (error: any) {
			if (error.name === 'ZodError') {
				return reply.code(400).send({
					success: false,
					error: 'Dados inválidos',
					details: error.errors
				})
			}

			return reply.code(500).send({
				success: false,
				error: 'Falha na tradução da legenda',
				message: error.message
			})
		}
	})
}
