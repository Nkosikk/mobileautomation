import { createWriteStream, existsSync, mkdirSync, rmSync } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import path from 'node:path';

const releaseUrl =
  'https://api.github.com/repos/webdriverio/native-demo-app/releases/latest';
const appsDirectory = path.resolve(import.meta.dirname, '..', 'apps');

mkdirSync(appsDirectory, { recursive: true });

const releaseResponse = await fetch(releaseUrl, {
  headers: { 'User-Agent': 'mobile-api-test-automation' },
});

if (!releaseResponse.ok) {
  throw new Error(
    `Unable to query the latest demo app release: ${releaseResponse.status}`,
  );
}

const release = await releaseResponse.json();
const assets = [
  {
    source: release.assets.find((asset) => asset.name.endsWith('.apk')),
    destination: path.join(appsDirectory, 'android.wdio.native.app.apk'),
  },
  {
    source: release.assets.find((asset) => asset.name.endsWith('.zip')),
    destination: path.join(appsDirectory, 'ios.simulator.wdio.native.app.zip'),
  },
];

for (const { source, destination } of assets) {
  if (!source) {
    throw new Error(`Expected app asset was not found in release ${release.tag_name}`);
  }

  if (existsSync(destination)) {
    console.log(`Already downloaded: ${path.basename(destination)}`);
    continue;
  }

  const response = await fetch(source.browser_download_url);
  if (!response.ok || !response.body) {
    throw new Error(`Unable to download ${source.name}: ${response.status}`);
  }

  const partialDestination = `${destination}.part`;
  try {
    await pipeline(response.body, createWriteStream(partialDestination));
    const { rename } = await import('node:fs/promises');
    await rename(partialDestination, destination);
    console.log(`Downloaded ${source.name} -> ${destination}`);
  } catch (error) {
    rmSync(partialDestination, { force: true });
    throw error;
  }
}
