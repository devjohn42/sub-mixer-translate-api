import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { TranslationService } from '../services/translation-service'

export const ApiUsageRoute: FastifyPluginAsyncZod = async (app) => {
	app.get('/usage', async (_, reply) => {
		try {
			const translationService = TranslationService.getInstance()
			const usage = await translationService.getUsage()

			return {
				success: true,
				usage: {
					used: usage.used,
					limit: usage.limit,
					remaining: usage.remaining,
					percentage: ((usage.used / usage.limit) * 100).toFixed(2) + '%'
				}
			}
		} catch (error: any) {
			return reply.code(500).send({
				success: false,
				error: 'Falha ao obter informações de uso',
				message: error.message
			})
		}
	})
}
