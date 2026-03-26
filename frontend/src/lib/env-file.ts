import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function serializeEnvValue(value: string) {
  if (/^[A-Za-z0-9._:@/+-]+$/.test(value)) {
    return value;
  }

  return JSON.stringify(value);
}

export function resolveFrontendEnvPath() {
  const cwd = process.cwd();
  const directEnvPath = path.resolve(cwd, ".env");
  const nestedEnvPath = path.resolve(cwd, "frontend", ".env");

  if (path.basename(cwd).toLowerCase() === "frontend") {
    return directEnvPath;
  }

  if (existsSync(nestedEnvPath)) {
    return nestedEnvPath;
  }

  if (existsSync(directEnvPath)) {
    return directEnvPath;
  }

  return nestedEnvPath;
}

export async function updateEnvFile(values: Record<string, string>) {
  const envPath = resolveFrontendEnvPath();

  let content = "";
  try {
    content = await readFile(envPath, "utf8");
  } catch (error: any) {
    if (error?.code !== "ENOENT") {
      throw error;
    }
  }

  let nextContent = content;

  for (const [key, value] of Object.entries(values)) {
    const line = `${key}=${serializeEnvValue(value)}`;
    const pattern = new RegExp(`^${escapeRegExp(key)}=.*$`, "m");

    if (pattern.test(nextContent)) {
      nextContent = nextContent.replace(pattern, line);
    } else {
      nextContent = nextContent.trimEnd();
      nextContent = nextContent ? `${nextContent}\n${line}` : line;
    }
  }

  if (!nextContent.endsWith("\n")) {
    nextContent += "\n";
  }

  await writeFile(envPath, nextContent, "utf8");
  return envPath;
}
