import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

export const getApiHealthRoute: FastifyPluginAsyncZod = async (app) => {
	app.get('/health', async () => {
		return {
			status: 'ok',
			service: 'sub-mixer-translate-api',
			timestamp: new Date().toISOString()
		}
	})
}
