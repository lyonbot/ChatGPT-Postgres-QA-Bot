import { shutdownDatabase } from "./db";
import { shutdownApp, startApp } from "./http/server";

console.log('-----------------------------')
console.log('| Beatrice start since: ' + new Date().toLocaleString())
console.log('-----------------------------')
startApp().catch(err => {
  console.error(err)
  process.exit(1)
})

process.on('SIGTERM', async () => {
  await shutdownApp()
  await shutdownDatabase()
  process.exit(0)
})
