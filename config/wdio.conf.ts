import 'dotenv/config';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import type { Capabilities, Options } from '@wdio/types';

const platform = (process.env.PLATFORM ?? 'android').toLowerCase();
const projectRoot = path.resolve(import.meta.dirname, '..');

function optionalCapability(
  name: string,
  value: string | undefined,
): Record<string, string> {
  return value ? { [name]: value } : {};
}

function getAndroidCapabilities(): WebdriverIO.Capabilities {
  return {
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': process.env.ANDROID_DEVICE_NAME ?? 'Android Device',
    'appium:app': path.resolve(
      projectRoot,
      process.env.ANDROID_APP_PATH ?? 'apps/android.wdio.native.app.apk',
    ),
    'appium:autoGrantPermissions': true,
    'appium:newCommandTimeout': 120,
    ...optionalCapability('appium:udid', process.env.ANDROID_UDID),
    ...optionalCapability(
      'appium:platformVersion',
      process.env.ANDROID_PLATFORM_VERSION,
    ),
  };
}

function getIosCapabilities(): WebdriverIO.Capabilities {
  return {
    platformName: 'iOS',
    'appium:automationName': 'XCUITest',
    'appium:deviceName': process.env.IOS_DEVICE_NAME ?? 'iPhone 17',
    'appium:app': path.resolve(
      projectRoot,
      process.env.IOS_APP_PATH ??
        'apps/ios.simulator.wdio.native.app.app',
    ),
    'appium:newCommandTimeout': 120,
    ...optionalCapability(
      'appium:platformVersion',
      process.env.IOS_PLATFORM_VERSION,
    ),
  };
}

if (!['android', 'ios'].includes(platform)) {
  throw new Error(`Unsupported PLATFORM "${platform}". Use "android" or "ios".`);
}

type WdioConfig = Options.Testrunner & {
  capabilities: Capabilities.TestrunnerCapabilities;
};

export const config: WdioConfig = {
  runner: 'local',
  hostname: process.env.APPIUM_HOST ?? '127.0.0.1',
  port: Number(process.env.APPIUM_PORT ?? 4723),
  path: '/',
  specs: [path.join(projectRoot, 'test/specs/mobile/**/*.spec.ts')],
  maxInstances: 1,
  capabilities: [
    platform === 'android'
      ? getAndroidCapabilities()
      : getIosCapabilities(),
  ],
  logLevel: 'info',
  bail: 0,
  waitforTimeout: 10_000,
  connectionRetryTimeout: 120_000,
  connectionRetryCount: 2,
  framework: 'mocha',
  reporters: [
    'spec',
    [
      'junit',
      {
        outputDir: path.join(projectRoot, 'artifacts/junit/mobile'),
        outputFileFormat: ({ cid }) => `results-${cid}.xml`,
      },
    ],
  ],
  mochaOpts: {
    ui: 'bdd',
    timeout: 60_000,
  },
  services: [
    [
      'appium',
      {
        command: path.join(
          projectRoot,
          'node_modules',
          '.bin',
          process.platform === 'win32' ? 'appium.cmd' : 'appium',
        ),
        logPath: path.join(projectRoot, 'artifacts/logs'),
        args: {
          address: process.env.APPIUM_HOST ?? '127.0.0.1',
          port: Number(process.env.APPIUM_PORT ?? 4723),
        },
      },
    ],
  ],
  onPrepare: async function () {
    await Promise.all([
      mkdir(path.join(projectRoot, 'artifacts/junit/mobile'), {
        recursive: true,
      }),
      mkdir(path.join(projectRoot, 'artifacts/logs'), { recursive: true }),
      mkdir(path.join(projectRoot, 'artifacts/screenshots'), {
        recursive: true,
      }),
    ]);
  },
  afterTest: async function (test, _context, { error }) {
    const timestamp = new Date().toISOString().replaceAll(':', '-');
    const title = test.title.replaceAll(/[^a-zA-Z0-9]+/g, '-').toLowerCase();
    const status = error ? 'failure' : 'success';
    await browser.saveScreenshot(
      path.join(
        projectRoot,
        `artifacts/screenshots/${status}-${title}-${timestamp}.png`,
      ),
    );
  },
};
