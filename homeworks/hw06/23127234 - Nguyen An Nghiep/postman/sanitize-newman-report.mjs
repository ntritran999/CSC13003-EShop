import fs from "node:fs/promises";
import path from "node:path";

const targetDirectory = path.resolve(process.argv[2] || "../reports/newman");
const entries = await fs.readdir(targetDirectory, { withFileTypes: true });
const htmlFiles = entries.filter((entry) => entry.isFile() && entry.name.endsWith(".html"));

for (const entry of htmlFiles) {
  const file = path.join(targetDirectory, entry.name);
  const original = await fs.readFile(file, "utf8");
  const sanitized = original
    .replace(/Bearer\s+(?:[A-Za-z0-9_-]+\.){1,2}[A-Za-z0-9_.-]+/g, "Bearer [REDACTED]")
    .replace(/eyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}/g, "[REDACTED-JWT]")
    .replace(/((?:password|jwtSecret)\s*[=:]\s*)[^<\s,"']+/gi, "$1[REDACTED]");
  await fs.writeFile(file, sanitized, "utf8");
}

console.log(`Sanitized ${htmlFiles.length} Newman HTML report(s) in ${targetDirectory}`);
