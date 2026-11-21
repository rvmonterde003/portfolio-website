import { readdir, readFile } from "node:fs/promises"
import path from "node:path"

const names = ["GOOGLE_CLIENT_SECRET", "GOOGLE_REFRESH_TOKEN", "GOOGLE_CLIENT_ID", "UPSTASH_REDIS_REST_TOKEN", "TURNSTILE_SECRET_KEY"]
const secrets = names.filter((name) => process.env[name]).map((name) => {
  const value = process.env[name]
  return { name, forms: [value, encodeURIComponent(value), Buffer.from(value).toString("base64")].map((form) => Buffer.from(form)), failed: false }
})

async function scan(directory, include) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name)
    if (entry.isDirectory()) await scan(file, include)
    else if (entry.isFile() && include(file)) {
      const content = await readFile(file)
      for (const secret of secrets) if (secret.forms.some((form) => content.includes(form))) secret.failed = true
    }
  }
}

try {
  if (secrets.length) {
    await scan(path.resolve(".next/static"), () => true)
    await scan(path.resolve(".next/server/app"), (file) => /\.(html|rsc)$/.test(file))
  }
} catch {
  // Missing or unreadable build output cannot establish that credentials are absent.
  for (const secret of secrets) secret.failed = true
}
for (const secret of secrets) console.log(`${secret.name}: ${secret.failed ? "FAIL" : "PASS"}`)
process.exitCode = secrets.some((secret) => secret.failed) ? 1 : 0
