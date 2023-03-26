import Fastify from 'fastify'
const app = Fastify()

app.get('/', async (request, reply) => {
  return { hello: 'world', time: new Date().toLocaleString() }
})

export async function startApp() {
  await app.ready()

  const addr = await app.listen({
    host: process.env.HOST || '0.0.0.0',
    port: +process.env.PORT! || 8080,
  })
  console.log('Server started on ' + addr)

  return app
}

export async function shutdownApp() {
  await app.close()
}