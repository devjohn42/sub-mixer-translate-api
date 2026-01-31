import fastifyCors from '@fastify/cors'
import fastify from 'fastify'
import {
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider
} from 'fastify-type-provider-zod'
import { ApiUsageRoute } from './routes/api-usage.route'
import { getApiHealthRoute } from './routes/get-api-health.route'
import { getSupportedLanguagesRoute } from './routes/get-supported-languages.route'
import { validateSubtitleRoute } from './routes/validate-subtitle.route'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, {
	origin: '*'
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(getApiHealthRoute)
app.register(ApiUsageRoute)
app.register(getSupportedLanguagesRoute)
app.register(validateSubtitleRoute)

app.listen({ port: 3333 }).then(() => {
	console.log('🎬 Sub Mixer Translate API is Running')
})
