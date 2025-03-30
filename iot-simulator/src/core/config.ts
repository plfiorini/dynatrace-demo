import * as fs from 'fs';
import * as yaml from 'js-yaml';

export class Config {
    private static instance: Config;

    public tenantUrl: string;
    public apiToken: string;
    public interval: number;

    private constructor(filePath: string) {
        const config = this.loadConfig(filePath);
        this.tenantUrl = config.tenantUrl;
        this.apiToken = config.apiToken;
        this.interval = config.interval || 10000; // Default to 10 seconds if not specified
    }

    public static getInstance(filePath: string): Config {
        if (!Config.instance) {
            Config.instance = new Config(filePath);
        }
        return Config.instance;
    }

    private loadConfig(filePath: string): any {
        try {
            const fileContents = fs.readFileSync(filePath, 'utf8');
            return yaml.load(fileContents);
        } catch (error) {
            console.error(`Failed to load configuration from ${filePath}:`, error);
            throw error;
        }
    }
}
