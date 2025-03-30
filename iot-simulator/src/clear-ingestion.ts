/*
 * Clear Dynatrace metrics.
 *
 * Author: Pier Luigi Fiorini
 * License: MIT
 */

import https from "https";
import { Config } from "./core/config";
import { Metrics } from "./core/metrics";

// Configuration
const config = Config.getInstance("./config/simulator.yaml");
if (!config.tenantUrl || !config.apiToken) {
    throw new Error("Tenant URL and/or API token must be defined in the configuration file.");
}

// List of metrics to be deleted
const metricsToDelete = Object.values(Metrics);

function deleteMetric(metricId: string) {
    const uri = new URL(config.tenantUrl);
    const options: https.RequestOptions = {
        hostname: uri.hostname,
        path: `/api/v2/metrics/${encodeURIComponent(metricId)}`,
        method: "DELETE",
        headers: {
            Authorization: `Api-Token ${config.apiToken}`,
        },
    };

    const req = https.request(options, (res) => {
        if (res.statusCode === 204) {
            console.info(`Metric "${metricId}" successfully deleted.`);
        } else {
            console.error(`Error deleting metric "${metricId}": ${res.statusCode}`);
        }
    });

    req.on("error", (error) => {
        console.error(`Error while deleting metric "${metricId}":`, error);
    });

    req.end();
}

function clearMetrics() {
    for (const metric of metricsToDelete) {
        deleteMetric(metric);
    }
}

console.info("Abot to remove metrics...");
clearMetrics();