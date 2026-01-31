import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { getSRTStats, parseSRT } from '../utils/subtitle-parser'
import { validateSubtitleSchema } from './schema'

export const validateSubtitleRoute: FastifyPluginAsyncZod = async (app) => {
	app.post('/validate/subtitle', async (request, reply) => {
		try {
			// Validação com Zod
			const { subtitle } = validateSubtitleSchema.parse(request.body)

			// Tentar parsear
			const blocks = parseSRT(subtitle)

			if (blocks.length === 0) {
				return reply.code(400).send({
					success: false,
					error: 'Nenhum bloco de legenda válido encontrado'
				})
			}

			// Retornar estatísticas
			const stats = getSRTStats(subtitle)

			return {
				success: true,
				valid: true,
				stats: {
					totalBlocks: stats.totalBlocks,
					totalCharacters: stats.totalCharacters,
					estimatedTime: `~${stats.estimatedTime}s`
				}
			}
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
				error: 'Falha na validação',
				message: error.message
			})
		}
	})
}
