import { textSelector } from '../../support/selectors.js';

export class AlertComponent {
  async waitForText(expectedText: string): Promise<void> {
    if (driver.isAndroid) {
      await $(textSelector(expectedText)).waitForDisplayed({
        timeout: 5_000,
        timeoutMsg: `Expected an alert containing "${expectedText}"`,
      });
      return;
    }

    await browser.waitUntil(
      async () => (await browser.getAlertText()).includes(expectedText),
      {
        timeout: 5_000,
        timeoutMsg: `Expected an alert containing "${expectedText}"`,
      },
    );
  }

  async accept(): Promise<void> {
    if (driver.isAndroid) {
      await $('android=new UiSelector().resourceId("android:id/button1")').click();
      return;
    }

    await browser.acceptAlert();
  }

  async isOpen(): Promise<boolean> {
    if (driver.isAndroid) {
      return $(
        'android=new UiSelector().resourceId("android:id/button1")',
      ).isDisplayed();
    }

    return browser
      .getAlertText()
      .then(() => true)
      .catch(() => false);
  }
}

export const alertComponent = new AlertComponent();
