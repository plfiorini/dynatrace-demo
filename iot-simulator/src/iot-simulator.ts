/*
 * IoT Simulator that sends metrics to Dynatrace.
 *
 * Author: Pier Luigi Fiorini
 * License: MIT
 */

import https from "https";
import { setInterval } from "timers";
import { Config } from "./core/config";
import { Metrics } from "./core/metrics";

// Configuration
const config = Config.getInstance("./config/simulator.yaml");
if (!config.tenantUrl || !config.apiToken) {
    throw new Error("Tenant URL and/or API token must be defined in the configuration file.");
}

// Production lines
const lines = ["line1", "line2"];

function generateMetrics(lineId: string) {
    const pieces = Math.floor(Math.random() * 3); // 0-2 pieces
    const scraps = Math.floor(Math.random() * 2); // 0-1 scraps
    const stop = Math.random() < 0.05 ? 1 : 0; // 5% probability of stop

    const now = Date.now();
    const metrics = [
        `${Metrics.PIECES},line=${lineId} ${pieces} ${now}`,
        `${Metrics.SCRAPS},line=${lineId} ${scraps} ${now}`,
        `${Metrics.STOPS},line=${lineId} ${stop} ${now}`,
    ];

    return metrics;
}

function sendMetrics(metrics: string[]) {
    const data = metrics.join("\n");

    const uri = new URL(config.tenantUrl);
    const options: https.RequestOptions = {
        hostname: uri.hostname,
        path: "/api/v2/metrics/ingest",
        method: "POST",
        headers: {
            Authorization: `Api-Token ${config.apiToken}`,
            "Content-Type": "text/plain; charset=utf-8",
        },
    };

    const req = https.request(options, (res) => {
        console.debug(`Metrics ingested: ${res.statusCode}`);
    });

    req.on("error", (error) => {
        console.error("Error during metrics ingestion:", error);
    });

    req.write(data);
    req.end();
}

function simulateIoT() {
    for (const line of lines) {
        const metrics = generateMetrics(line);
        console.log(`[${line}]`, metrics);
        sendMetrics(metrics);
    }
}

console.info("== IoT Simulator ==");
setInterval(simulateIoT, config.interval);
