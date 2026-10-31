import fs from "fs";
import path from "path";

const categoryDir = path.resolve("src/schemas/categories");
const outputFile = path.join(categoryDir, "moduleMap.ts");

function generateRegistry() {
  const files = fs
    .readdirSync(categoryDir)
    .filter((f) => f.endsWith(".ts") && !["index.ts", "loader.ts", "moduleMap.ts"].includes(f));

  const entries = files
    .map((file) => {
      const key = file.replace(".ts", "");
      return `  "${key}": () => import("./${key}"),`;
    })
    .join("\n");

  const content = `/**
 * ⚙️ Auto-generated category registry
 * Do not edit manually — run "npm run build:categories" to update
 */
export const categoryModuleMap = {
${entries}
} as const;
`;

  fs.writeFileSync(outputFile, content);
  console.log(`✅ Category registry built with ${files.length} categories.`);
}

generateRegistry();

