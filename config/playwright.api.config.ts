import 'dotenv/config';
import path from 'node:path';
import { defineConfig } from '@playwright/test';

const projectRoot = path.resolve(import.meta.dirname, '..');

export default defineConfig({
  testDir: path.join(projectRoot, 'test/specs/api'),
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  timeout: 30_000,
  reporter: [
    ['list'],
    [
      'html',
      {
        outputFolder: path.join(projectRoot, 'artifacts/playwright-report'),
        open: 'never',
      },
    ],
    [
      'junit',
      {
        outputFile: path.join(projectRoot, 'artifacts/junit/api/results.xml'),
      },
    ],
  ],
  use: {
    baseURL:
      process.env.API_BASE_URL ??
      'https://restful-booker.herokuapp.com',
    extraHTTPHeaders: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  },
  outputDir: path.join(projectRoot, 'artifacts/playwright-results'),
});
