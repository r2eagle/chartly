#!/usr/bin/env node

/**
 * Build script for ChartFlow runtime
 * Generates dist/runtime.min.js from the minified script in constants
 */

const fs = require('fs');
const path = require('path');

// Read the minified runtime from constants
const constantsPath = path.join(__dirname, '../src/constants/scripts.ts');
const constantsContent = fs.readFileSync(constantsPath, 'utf8');

// Extract CHARTFLOW_RUNTIME_SCRIPT value using regex
const match = constantsContent.match(/export const CHARTFLOW_RUNTIME_SCRIPT = `([^`]+)`/);

if (!match) {
  console.error('❌ Error: Could not find CHARTFLOW_RUNTIME_SCRIPT in constants/scripts.ts');
  process.exit(1);
}

const runtimeScript = match[1];

// Create dist directory if it doesn't exist
const distDir = path.join(__dirname, '../dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Write minified version
const minifiedPath = path.join(distDir, 'runtime.min.js');
fs.writeFileSync(minifiedPath, runtimeScript, 'utf8');

// Also write a readable version with comments
const readablePath = path.join(distDir, 'runtime.js');
const readableContent = fs.readFileSync(
  path.join(__dirname, '../public/chartflow-runtime.js'),
  'utf8'
);
fs.writeFileSync(readablePath, readableContent, 'utf8');

// Create a simple TypeScript declaration file
const dtsPath = path.join(distDir, 'runtime.d.ts');
const dtsContent = `/**
 * ChartFlow Runtime - Initializes Chart.js charts on Webflow sites
 * @see https://github.com/r2eagle/chartly
 */
declare module '@r2eagle/chartflow' {
  // ChartFlow runtime is a self-executing script
  // No exports are provided as it runs automatically on page load
}
`;
fs.writeFileSync(dtsPath, dtsContent, 'utf8');

console.log('✅ ChartFlow runtime built successfully!');
console.log(`   📦 Minified: ${minifiedPath} (${Buffer.byteLength(runtimeScript)} bytes)`);
console.log(`   📄 Readable: ${readablePath} (${Buffer.byteLength(readableContent)} bytes)`);
console.log(`   📘 Types: ${dtsPath}`);
