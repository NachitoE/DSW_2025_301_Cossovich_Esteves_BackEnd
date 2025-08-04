import { Options } from "@mikro-orm/core";

const config: Options = {
  clientUrl: process.env.MONGO_URL || "mongodb://localhost:27017",
  dbName: "avistandoo",
  entities: ["./dist/entities"], //prod (compiled)
  entitiesTs: ["./src/entities"], //dev (TypeScript)
};

export default config;
