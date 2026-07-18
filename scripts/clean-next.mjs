import { rm } from "node:fs/promises"
import { dirname, resolve } from "node:path"

const workspaceRoot = resolve(process.cwd())
const nextOutputRoot = resolve(workspaceRoot, ".next")
const nextDevOutput = resolve(nextOutputRoot, "dev")

if (dirname(nextDevOutput) !== nextOutputRoot) {
  throw new Error("Refusing to clean a Next.js output directory outside the workspace.")
}

await rm(nextDevOutput, { recursive: true, force: true })
console.log(`Removed generated Next.js development output: ${nextDevOutput}`)
