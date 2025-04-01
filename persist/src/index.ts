import { initTracing } from "./tracing";
import { startServer } from "./app";
import { Config } from "./core/config";
import { version } from "../package.json";
import { Command } from "commander";

const program = new Command();

program
    .version(version)
    .description("HTTP server that emulates slow responses and failures")
    .option("-c, --config <path>", "Path to the configuration file", "./config/persist.yaml")
    .on("--help", () => {
        process.exit(0); // Exit the process after displaying help
    });

program.parse(process.argv);

const options = program.opts();
const configPath = options.config;
if (!configPath) {
    throw new Error("Configuration file path must be provided.");
}

const config = Config.getInstance(configPath);
if (!config.tenantUrl || !config.otelToken) {
    throw new Error("Tenant URL and/or API token must be defined in the configuration file.");
}

console.debug(`Starting Persist with configuration file: ${configPath}`);
console.debug(`Tenant URL: ${config.tenantUrl}`);
console.debug(`API Token: ${config.otelToken}`);

initTracing(config.tenantUrl, config.otelToken);
startServer();
