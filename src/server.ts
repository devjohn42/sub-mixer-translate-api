import fastifyCors from '@fastify/cors'
import fastify from 'fastify'
import {
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider
} from 'fastify-type-provider-zod'
import { getApiHealth } from './routes/get-api-health.route'
import { getSupportedLanguages } from './routes/get-supported-languages.route'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, {
	origin: '*'
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(getApiHealth)
app.register(getSupportedLanguages)

app.listen({ port: 3333 }).then(() => {
	console.log('🎬 Sub Mixer Translate API is Running')
})
