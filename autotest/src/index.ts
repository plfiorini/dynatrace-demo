import { Command } from 'commander';
import { run } from 'node:test';
import { runTests } from './tests';

const program = new Command();

program
    .option('--server <url>', 'Specify the server URL')
    .parse(process.argv);

const options = program.opts();

if (options.server) {
    console.log(`Server URL: ${options.server}`);
} else {
    console.log('No server URL provided.');
}

async function main() {
    try {
        await runTests(options.server);
    } catch (error) {
        console.error('An error occurred while running tests:', error);
        process.exit(1);
    }
}

main();
