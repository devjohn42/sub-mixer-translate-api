import fastifyCors from '@fastify/cors'
import fastify from 'fastify'

const app = fastify()

app.register(fastifyCors, {
	origin: '*'
})

app.listen({ port: 3333 }).then(() => {
	console.log('🎬 Sub Mixer Trasnalte API is Running')
})
