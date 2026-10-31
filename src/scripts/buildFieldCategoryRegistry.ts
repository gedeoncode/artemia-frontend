import fs from "fs";
import path from "path";

const fieldsDir = path.resolve("src/components/categorySection/categoryFields");
const outputFile = path.join(fieldsDir, "moduleMap.ts");

function generateFieldRegistry() {
  const files = fs
    .readdirSync(fieldsDir)
    .filter(
      (f) => f.endsWith("Fields.tsx") && !["GenericFields.tsx"].includes(f)
    );

  const entries = files
    .map((file) => {
      const key = file.replace("Fields.tsx", "").toLowerCase();
      return `  "${key}": () => import("./${file}"),`;
    })
    .join("\n");

  const content = `/**
 * ⚙️ Auto-generated Field Registry
 * Do not edit manually — run "npm run build:fields" to update
 */
export const categoryFieldModuleMap = {
${entries}
} as const;
`;

  fs.writeFileSync(outputFile, content);
  console.log(
    `✅ Field registry built with ${files.length} category field components.`
  );
}

generateFieldRegistry();
