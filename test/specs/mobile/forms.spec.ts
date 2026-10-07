import { alertComponent } from '../../page-objects/components/alert.component.js';
import { navigationComponent } from '../../page-objects/components/navigation.component.js';
import { formsScreen } from '../../page-objects/forms.screen.js';

describe('Form interactions', () => {
  beforeEach(async () => {
    await navigationComponent.open('Forms');
    await formsScreen.waitForDisplayed();
  });

  it('fills and submits the form', async () => {
    const input = 'WebdriverIO mobile automation';

    await formsScreen.enterText(input);
    await formsScreen.expectEnteredText(input);
    await formsScreen.enableSwitch();
    await formsScreen.selectDropdownOption('Appium is awesome');
    await formsScreen.submit();

    await alertComponent.waitForText('This button is active');
    await alertComponent.accept();
  });

  it('keeps the inactive button disabled', async () => {
    await formsScreen.tapInactiveButton();
    await expect(await alertComponent.isOpen()).toBe(false);
  });
});
