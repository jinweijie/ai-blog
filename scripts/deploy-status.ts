import { execFileSync } from "node:child_process";

type StatusPayload = {
  state?: string;
  statuses?: Array<{
    context?: string;
    state?: string;
    description?: string;
    target_url?: string;
    created_at?: string;
  }>;
  sha?: string;
};

function run(command: string, args: string[]) {
  return execFileSync(command, args, { encoding: "utf8" }).trim();
}

function safeRun(command: string, args: string[]) {
  try {
    return run(command, args);
  } catch {
    return null;
  }
}

function resolveRepo(): string {
  const remote = safeRun("git", ["remote", "get-url", "origin"]);
  if (!remote) {
    throw new Error("Unable to determine git origin remote.");
  }

  if (remote.startsWith("git@github.com:")) {
    return remote.replace("git@github.com:", "").replace(/\.git$/, "");
  }

  if (remote.startsWith("https://github.com/")) {
    return remote.replace("https://github.com/", "").replace(/\.git$/, "");
  }

  throw new Error(`Unsupported git remote format: ${remote}`);
}

function resolveSha(ref: string): string {
  const sha = safeRun("git", ["rev-parse", ref]) ?? safeRun("git", ["rev-parse", "HEAD"]);
  if (!sha) {
    throw new Error(`Unable to resolve git ref: ${ref}`);
  }
  return sha;
}

function pickVercel(statuses: StatusPayload["statuses"]) {
  if (!statuses || statuses.length === 0) {
    return null;
  }
  return statuses.find((status) => status.context === "Vercel") ?? null;
}

function main() {
  const ref = process.argv[2] ?? "origin/main";
  const repo = resolveRepo();
  const sha = resolveSha(ref);

  const raw = safeRun("gh", ["api", `repos/${repo}/commits/${sha}/status`]);
  if (!raw) {
    throw new Error("Failed to query GitHub API. Ensure `gh auth status` is OK.");
  }

  const payload = JSON.parse(raw) as StatusPayload;
  const vercel = pickVercel(payload.statuses);

  console.log(`Repo: ${repo}`);
  console.log(`Commit: ${payload.sha ?? sha}`);
  if (!vercel) {
    console.log("Vercel: no deployment status found");
    return;
  }

  console.log(`Vercel: ${vercel.state ?? "unknown"}`);
  if (vercel.description) {
    console.log(`Detail: ${vercel.description}`);
  }
  if (vercel.target_url) {
    console.log(`URL: ${vercel.target_url}`);
  }
  if (vercel.created_at) {
    console.log(`Updated: ${vercel.created_at}`);
  }
}

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exit(1);
}
