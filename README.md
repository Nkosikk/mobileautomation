# Mobile Test Automation & API Testing

A TypeScript test framework for the WebdriverIO Native Demo App and the
Restful Booker API.

## Technology

- WebdriverIO 10 with Mocha
- Appium 3 with UiAutomator2 (Android) or XCUITest (optional iOS simulator)
- Playwright APIRequestContext for REST API tests
- TypeScript with strict type checking
- Page Object Model with reusable navigation and alert components

## Project structure

```text
config/                         Runner configurations
scripts/                        Demo-app download utility
test/
  data/                         API request data
  page-objects/
    components/                 Shared UI components
    *.screen.ts                 Screen-level page objects
  specs/
    api/                        Playwright API tests
    mobile/                     WebdriverIO mobile tests
  support/                      Selectors and test-data factories
artifacts/                      Generated logs, reports, and screenshots
```

Tests contain intent and assertions. Selectors, waits, gestures, and UI actions
are kept in page objects. Platform differences are isolated in configuration
and selector helpers.

## Prerequisites

- Node.js 20 or 22 LTS. Node.js 24 is currently incompatible with the
  WebdriverIO Appium service on Windows.
- Java JDK 17 or newer with `JAVA_HOME` set to the JDK root
- Android SDK with `ANDROID_HOME` configured
- A physical Android device with USB debugging enabled
- `adb devices` lists the device as `device`

The released iOS app is simulator-signed and cannot be installed on a physical
iPhone. Android is therefore the primary platform for this assignment. The
shared tests and XCUITest capability are included for optional execution on a
macOS iOS simulator.

## Install

```bash
npm install
npm run download:apps
```

The repository includes `.nvmrc` for Node.js 22. If a version manager is
available, run `nvm use` before installing dependencies.

`download:apps` retrieves the APK and iOS simulator archive from the latest
Native Demo App GitHub release. The APK is stored at the path expected by the
default capability. The pinned `appium-uiautomator2-driver` dependency is
installed and registered with Appium by `npm install`.

Copy `.env.example` to `.env` if custom values are needed; both runner
configurations load it automatically. Values can also be set in the shell. On
PowerShell, for example:

```powershell
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21"
$env:ANDROID_UDID = "DEVICE_SERIAL_FROM_ADB"
$env:ANDROID_PLATFORM_VERSION = "16"
npm run test:mobile:android
```

The Android UDID and platform version are optional when only one device is
connected. To use an APK at another location:

```powershell
$env:ANDROID_APP_PATH = "C:\apps\android.wdio.native.app.apk"
```

## Run tests

### API

```bash
npm run test:api
```

The API suite uses Playwright's built-in request fixture. It verifies:

1. `POST /auth` returns a non-empty token.
2. `POST /booking` returns a numeric booking ID and booking data exactly
   matching the request.

### Android mobile

Connect and unlock the device, then run:

```bash
npm run test:mobile:android
```

The WebdriverIO Appium service starts and stops a local Appium server
automatically.

### Optional iOS simulator

On macOS, install Xcode and the XCUITest driver:

```bash
npm run setup:ios
```

Extract `apps/ios.simulator.wdio.native.app.zip`, set `IOS_APP_PATH` to the
extracted `.app` directory, and run:

```bash
npm run test:mobile:ios
```

### Static validation

```bash
npm run typecheck
```

## Mobile scenarios

1. **Signup:** switches to signup, enters unique account details, and verifies
   the success alert.
2. **Login happy path:** enters syntactically valid credentials and verifies
   the success alert.
3. **Invalid credentials:** submits a deliberately invalid short password and
   verifies the application's validation message and absence of a success
   alert.
4. **Form interaction:** enters text, checks its live result, enables the
   switch, selects a dropdown option, submits, and verifies the result alert.
5. **Swipe/scroll:** swipes the horizontal carousel and verifies the next card,
   then scrolls vertically and verifies the hidden logo.
6. **Bonus - inactive form action:** verifies the inactive button is disabled
   and cannot open an alert. This protects an important negative UX path and
   complements the active-button scenario.

### Native Demo App credential limitation

The demo app does not create accounts or authenticate against a backend. It
accepts any valid email and any password of at least eight characters. A
literal “wrong but well-formed password” therefore succeeds by design. The
invalid-credentials scenario exercises the real negative path exposed by the
app: password validation.

## Execution evidence

The framework generates evidence under `artifacts/`:

- Mobile JUnit XML: `artifacts/junit/mobile/`
- Appium logs: `artifacts/logs/`
- Success and failure screenshots for every mobile test:
  `artifacts/screenshots/`
- API JUnit XML: `artifacts/junit/api/results.xml`
- API HTML report: `artifacts/playwright-report/index.html`

For submission, run both suites, retain these generated artifacts outside Git
or attach them to the GitHub repository release, and optionally record the
physical device during the mobile run.

## GitHub Actions

The workflow in `.github/workflows/test.yml` runs two independent jobs on
pushes to `main` or `master`, pull requests, and manual dispatches:

1. **API tests:** installs dependencies, checks TypeScript, and runs the
   Playwright API suite.
2. **Android tests:** starts an Android 35 emulator and runs the shared
   WebdriverIO/Appium mobile suite.

Each job uploads its execution evidence from the `artifacts/` directory even
when a test fails. In GitHub, open the workflow run and download
`api-test-evidence-*` or `android-test-evidence-*` from the **Artifacts**
section. Artifacts are retained for 14 days.

## Troubleshooting

- Run `npm run check:android` to diagnose Android prerequisites.
- If multiple devices are connected, set `ANDROID_UDID`.
- Keep the physical device unlocked while starting a session.
- If port 4723 is occupied, set `APPIUM_PORT` to a free port.
- API tests use the public Restful Booker service and require internet access.
