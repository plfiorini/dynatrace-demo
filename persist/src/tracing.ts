import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from "@opentelemetry/semantic-conventions";
import { name as serviceName, version as serviceVersion } from "../package.json";
import { Config } from "./core/config";

export function initTracing(tenantUrl: string, token: string) {
    const config = Config.getInstance("./config/persist.yaml");
    if (!config.tenantUrl || !config.otelToken) {
        throw new Error("Tenant URL and/or API token must be defined in the configuration file.");
    }
    const sdk = new NodeSDK({
        traceExporter: new OTLPTraceExporter({
            url: tenantUrl,
            headers: {
                Authorization: `Api-Token ${token}`,
            }
        }),
        instrumentations: [
            getNodeAutoInstrumentations(),
        ],
        resource: resourceFromAttributes({
            [ATTR_SERVICE_NAME]: serviceName,
            [ATTR_SERVICE_VERSION]: serviceVersion,
        })
    });


    sdk.start();

    process.on("SIGTERM", () => {
        sdk.shutdown()
            .then(
                () => console.log("Tracing terminated"),
                (error) => console.log("Error terminating tracing", error)
            )
            .finally(() => process.exit(0));
    });
}
