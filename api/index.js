// This file is the serverless entry point for Vercel.
// It loads the bundled CommonJS Express app from 'dist/server.cjs' produced by the build step.
const app = require('../dist/server.cjs');

module.exports = app.default || app;
