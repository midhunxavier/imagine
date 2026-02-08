import { figures } from '../src/figures/manifest';

function hasFlag(name: string) {
  return process.argv.includes(name);
}

if (hasFlag('--json')) {
  process.stdout.write(JSON.stringify({ figures }, null, 2) + '\n');
  process.exit(0);
}

for (const fig of figures) {
  // eslint-disable-next-line no-console
  console.log(`${fig.id}  —  ${fig.title}  (${fig.variants.length} variant${fig.variants.length === 1 ? '' : 's'})`);
  for (const v of fig.variants) {
    // eslint-disable-next-line no-console
    console.log(`  - ${v.id}${v.title ? `  —  ${v.title}` : ''}`);
  }
}

