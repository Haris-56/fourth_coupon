
const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const dotenv = require('dotenv');

async function pushEnv() {
    try {
        const envConfig = dotenv.parse(fs.readFileSync('.env.local'));
        console.log('Detected keys:', Object.keys(envConfig));

        for (const [key, value] of Object.entries(envConfig)) {
            console.log(`\nProcessing ${key}...`);

            // 1. Remove existing to ensure we start fresh
            const environments = ['production', 'preview', 'development'];
            for (const env of environments) {
                process.stdout.write(`  Removing ${key} from ${env}... `);
                try {
                    execSync(`vercel env rm ${key} ${env} --yes`, { stdio: 'ignore' });
                    console.log('DONE');
                } catch (e) {
                    console.log('NOT FOUND/SKIPPED');
                }
            }

            // 2. Add value to all environments
            for (const env of environments) {
                process.stdout.write(`  Adding ${key} to ${env}... `);
                // Vercel CLI command: vercel env add NAME VALUE ENV
                const result = spawnSync('vercel', ['env', 'add', key, value, env], {
                    encoding: 'utf-8',
                    stdio: 'pipe'
                });
                
                if (result.status !== 0) {
                    console.log('FAILED');
                    console.error('    Error:', result.stderr.trim());
                } else {
                    console.log('SUCCESS');
                }
            }
        }
        
        console.log('\nEnvironment variables updated. Starting production deployment...');
        // We'll run deployment separately in the next step to be safe
        process.exit(0);
    } catch (error) {
        console.error('CRITICAL ERROR:', error.message);
        process.exit(1);
    }
}

pushEnv();
