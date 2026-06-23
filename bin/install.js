#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const packageRoot = path.resolve(path.dirname(__filename), "..");
const home = os.homedir();
const pluginName = "hk-broker-tax-reconcile";

function usage() {
  console.log(`HK Broker Tax Reconcile installer

Usage:
  npx hk-broker-tax-reconcile install          Install Codex plugin (default)
  npx hk-broker-tax-reconcile install plugin   Install Codex plugin
  npx hk-broker-tax-reconcile install skill    Install standalone Agent Skill
  npx hk-broker-tax-reconcile install all      Install both

Options:
  --force       Replace existing installed files
  --dry-run     Print actions without writing
  --help        Show this help
`);
}

function parseArgs(argv) {
  const args = argv.slice(2);
  if (args.includes("--help") || args.includes("-h")) {
    return { help: true };
  }
  const dryRun = args.includes("--dry-run");
  const force = args.includes("--force");
  const words = args.filter((arg) => !arg.startsWith("--"));
  const command = words[0] || "install";
  const target = words[1] || "plugin";
  return { command, target, dryRun, force };
}

function ensureDir(dir, dryRun) {
  if (dryRun) {
    console.log(`[dry-run] mkdir -p ${dir}`);
    return;
  }
  fs.mkdirSync(dir, { recursive: true });
}

function copyDir(src, dest, { force, dryRun }) {
  if (!fs.existsSync(src)) {
    throw new Error(`Source does not exist: ${src}`);
  }
  if (fs.existsSync(dest)) {
    if (!force) {
      throw new Error(`Destination exists: ${dest}\nRe-run with --force to replace it.`);
    }
    if (dryRun) {
      console.log(`[dry-run] remove ${dest}`);
    } else {
      fs.rmSync(dest, { recursive: true, force: true });
    }
  }
  ensureDir(path.dirname(dest), dryRun);
  if (dryRun) {
    console.log(`[dry-run] copy ${src} -> ${dest}`);
    return;
  }
  fs.cpSync(src, dest, {
    recursive: true,
    filter: (source) => !source.includes(`${path.sep}__pycache__${path.sep}`) && !source.endsWith(".pyc")
  });
}

function readJson(file, fallback) {
  if (!fs.existsSync(file)) return fallback;
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, data, dryRun) {
  ensureDir(path.dirname(file), dryRun);
  if (dryRun) {
    console.log(`[dry-run] write ${file}`);
    console.log(JSON.stringify(data, null, 2));
    return;
  }
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}

function installSkill(options) {
  const src = path.join(packageRoot, "skills", pluginName);
  const dest = path.join(home, ".agents", "skills", pluginName);
  copyDir(src, dest, options);
  console.log(`Installed standalone skill: ${dest}`);
}

function installPlugin(options) {
  const src = path.join(packageRoot, "plugins", pluginName);
  const pluginDest = path.join(home, "plugins", pluginName);
  copyDir(src, pluginDest, options);

  const marketplacePath = path.join(home, ".agents", "plugins", "marketplace.json");
  const marketplace = readJson(marketplacePath, {
    name: "personal",
    interface: { displayName: "Personal" },
    plugins: []
  });
  if (!Array.isArray(marketplace.plugins)) {
    throw new Error(`${marketplacePath} has non-array plugins field.`);
  }
  const entry = {
    name: pluginName,
    source: {
      source: "local",
      path: `./plugins/${pluginName}`
    },
    policy: {
      installation: "AVAILABLE",
      authentication: "ON_INSTALL"
    },
    category: "Productivity"
  };
  const existingIndex = marketplace.plugins.findIndex((item) => item && item.name === pluginName);
  if (existingIndex >= 0) {
    marketplace.plugins[existingIndex] = entry;
  } else {
    marketplace.plugins.push(entry);
  }
  writeJson(marketplacePath, marketplace, options.dryRun);
  console.log(`Installed Codex plugin: ${pluginDest}`);
  console.log(`Updated marketplace: ${marketplacePath}`);
  console.log("Restart Codex, then open Plugins and choose the Personal marketplace.");
}

function main() {
  const options = parseArgs(process.argv);
  if (options.help) {
    usage();
    return;
  }
  if (options.command !== "install") {
    usage();
    throw new Error(`Unknown command: ${options.command}`);
  }
  if (!["plugin", "skill", "all"].includes(options.target)) {
    usage();
    throw new Error(`Unknown install target: ${options.target}`);
  }
  if (options.target === "skill" || options.target === "all") {
    installSkill(options);
  }
  if (options.target === "plugin" || options.target === "all") {
    installPlugin(options);
  }
}

try {
  main();
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
}
