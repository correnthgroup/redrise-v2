import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const topic = process.argv.slice(2).join(" ").trim().toLowerCase();

const domains = {
  auth: {
    module: "memory/modules/auth.md",
    files: [
      "src/app/(auth)/login/page.tsx",
      "src/app/(auth)/signup/page.tsx",
      "src/components/login-form.tsx",
      "src/components/signup-form.tsx",
      "src/lib/user-profile.ts",
      "src/lib/supabase.ts",
    ],
    graph: "auth flow login signup profile active sessions",
  },
  settings: {
    module: "memory/modules/settings.md",
    files: [
      "src/app/(dashboard)/settings/page.tsx",
      "src/app/(dashboard)/settings/general/page.tsx",
      "src/app/(dashboard)/settings/team/page.tsx",
      "src/app/(dashboard)/settings/billing/page.tsx",
      "src/app/(dashboard)/settings/limits/page.tsx",
      "src/lib/team-members.ts",
      "src/lib/user-profile.ts",
      "src/lib/billing.ts",
    ],
    graph: "settings general team billing limits profile language",
  },
  billing: {
    module: "memory/modules/billing.md",
    files: [
      "src/lib/billing.ts",
      "src/app/(dashboard)/settings/billing/page.tsx",
      "supabase/functions/billing-checkout/index.ts",
      "supabase/functions/billing-webhook/index.ts",
    ],
    graph: "billing subscriptions checkout webhook corporate plan",
  },
  workstation: {
    module: "memory/modules/workstation.md",
    files: [
      "src/lib/workspaces.ts",
      "src/lib/flows.ts",
      "src/lib/tasks.ts",
      "src/hooks/use-workspaces.ts",
      "src/hooks/use-flows.ts",
      "src/hooks/use-tasks.ts",
    ],
    graph: "workstation workspace flows tasks actions",
  },
  agents: {
    module: "memory/modules/agents.md",
    files: [
      "src/app/(dashboard)/agents/page.tsx",
      "src/lib/agents.ts",
      "src/hooks/use-agents.ts",
      "supabase/functions/agent-provider-test/index.ts",
    ],
    graph: "agents models engine analytics tasks execution",
  },
  supabase: {
    module: "memory/modules/supabase.md",
    files: ["src/lib/supabase.ts", "supabase/migrations", "supabase/functions"],
    graph: "supabase migrations rls edge functions profiles billing tasks agents",
  },
  deploy: {
    module: "memory/modules/testing-deploy.md",
    files: ["package.json", "render.yaml", ".env.example", "supabase/config.toml"],
    graph: "testing deploy render supabase build validation",
  },
};

domains.testing = domains.deploy;

const selectedKey = Object.keys(domains).find((key) => topic.includes(key)) ?? topic.split(/\s+/)[0];
const selected = domains[selectedKey];

function readIfExists(path) {
  const absolute = resolve(path);
  return existsSync(absolute) ? readFileSync(absolute, "utf8") : null;
}

function printSection(title, body) {
  console.log(`\n## ${title}\n`);
  console.log(body.trimEnd());
}

if (!topic) {
  console.error("Usage: npm run context:pack -- <topic>");
  console.error(`Topics: ${Object.keys(domains).filter((key) => key !== "testing").join(", ")}`);
  process.exit(1);
}

const boot = readIfExists("memory/BOOT.md");
const index = readIfExists("memory/INDEX.md");

printSection("Topic", topic);

if (boot) printSection("memory/BOOT.md", boot);
if (index) printSection("memory/INDEX.md", index);

if (!selected) {
  printSection("No Direct Module Match", `No module mapping found for "${topic}". Use memory/INDEX.md to choose a module.`);
  process.exit(0);
}

const moduleBody = readIfExists(selected.module);
if (moduleBody) printSection(selected.module, moduleBody);

printSection("Source Paths", selected.files.map((file) => `- ${file}`).join("\n"));
printSection("Graphify Query Suggestion", `python -m graphify query "${selected.graph}" --budget 2500`);
