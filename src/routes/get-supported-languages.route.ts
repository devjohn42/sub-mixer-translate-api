import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { LANGUAGES } from '../config/languages'

export const getSupportedLanguages: FastifyPluginAsyncZod = async (app) => {
	app.get('/languages', async () => {
		return {
			languages: Object.entries(LANGUAGES).map(([code, info]) => ({
				code,
				name: info.name,
				flag: info.flag
			}))
		}
	})
}
