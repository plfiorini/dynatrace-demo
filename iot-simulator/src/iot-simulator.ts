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
import { Command } from "commander";

const program = new Command();

program
    .version("1.0.0")
    .description("IoT Simulator that sends metrics to Dynatrace")
    .option("-c, --config <path>", "Path to the configuration file", "./config/simulator.yaml")
    .option("-i, --interval <ms>", "Interval in milliseconds for sending metrics", "10000")
    .option("-d, --degrade-line <line>", "Degrade the specified line")
    .option("-s, --stop-line <line>", "Stop the specified line")
    .option("--spike <line>", "Simulate a spike of scraps of the specified line")
    .on("--help", () => {
        process.exit(0); // Exit the process after displaying help
    });

program.parse(process.argv);

const options = program.opts();
const configPath = options.config;
const interval = parseInt(options.interval, 10);

if (isNaN(interval) || interval <= 0) {
    throw new Error("Interval must be a positive number.");
}

// Configuration
const config = Config.getInstance(configPath);
if (!config.tenantUrl || !config.apiToken) {
    throw new Error("Tenant URL and/or API token must be defined in the configuration file.");
}

// Production lines
const lines = ["line1", "line2", "line3"];

function generateMetrics(lineId: string) {
    // Case 1: degraded line, send nothing
    if (options.degradeLine && options.degradeLine === lineId) {
        console.debug(`⚠️ Line ${lineId} is degraded. No metrics sent.`);
        return [];
    }

    // Case 2: stopped line, send 0 pieces, otherwise random
    const isStopped = (options.stopLine && options.stopLine === lineId);
    if (isStopped) {
        console.debug(`🛑 Line ${lineId} is stopped. Sending 0 pieces.`);
    }

    // Case 3: scraps spike
    if (options.spike && options.spike === lineId) {
        console.debug(`⚡ Simulating a spike of scraps for line ${lineId}`);
        const spikeScraps = Math.floor(Math.random() * 10) + 5; // 5-14 scraps
        return [
            `${Metrics.SCRAPS},line=${lineId} ${spikeScraps} ${Date.now()}`,
        ];
    }

    // Case 4: normal operation
    const pieces = isStopped ? 0 : Math.floor(Math.random() * 3); // 0-2 pieces
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
    if (metrics.length === 0) {
        return;
    }

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
        if (metrics.length > 0) {
            console.log(`[${line}]`, metrics);
        }
        sendMetrics(metrics);
    }
}

console.info(`== IoT Simulator (interval ${interval} ms) ==`);

if (options.degradeLine) {
    console.info(`⚠️ Degrading line ${options.degradeLine}`);
}
if (options.stopLine) {
    console.info(`🛑 Stopping line ${options.stopLine}`)
}

setInterval(simulateIoT, interval);
