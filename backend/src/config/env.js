// Centralized environment variable loader
// This module loads environment variables from the project root .env file once
// and exports the process.env object for use throughout the application.
// It ensures that all modules share the same environment configuration
// without requiring individual dotenv.config() calls.

const path = require('path');
// Load .env from the project root (two levels up from this file)
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

module.exports = process.env;
