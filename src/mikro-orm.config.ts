import { defineConfig } from "@mikro-orm/mongodb";

const config = defineConfig({
  clientUrl: process.env.MONGO_URL || "mongodb://localhost:27017",
  dbName: "avistandoo",
  entities: ["./dist/entities"], //prod (compiled)
  entitiesTs: ["./src/entities"], //dev (TypeScript)
});

export default config;
