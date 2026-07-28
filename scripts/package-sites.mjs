import { cp, mkdir, rm } from "node:fs/promises";

const root = process.cwd();
const dist = `${root}/dist`;

await rm(dist, { recursive: true, force: true });
await mkdir(`${dist}/client`, { recursive: true });
await mkdir(`${dist}/server`, { recursive: true });
await mkdir(`${dist}/.openai`, { recursive: true });
await cp(`${root}/out`, `${dist}/client`, { recursive: true });
await cp(`${root}/sites-runtime/index.js`, `${dist}/server/index.js`);
await cp(`${root}/.openai/hosting.json`, `${dist}/.openai/hosting.json`);
