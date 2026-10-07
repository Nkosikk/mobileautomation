import { BaseScreen } from './base.screen.js';
import { textSelector } from '../support/selectors.js';

class FormsScreen extends BaseScreen {
  protected readonly screenSelector = '~Forms-screen';

  private get textInput() {
    return $('~text-input');
  }

  private get textResult() {
    return $('~input-text-result');
  }

  private get formSwitch() {
    return $('~switch');
  }

  private get switchStateText() {
    return $('~switch-text');
  }

  private get activeButton() {
    return $('~button-Active');
  }

  private get dropdown() {
    return $('~Dropdown');
  }

  private get inactiveButton() {
    return $('~button-Inactive');
  }

  async enterText(value: string): Promise<void> {
    await this.textInput.setValue(value);
  }

  async expectEnteredText(value: string): Promise<void> {
    await expect(this.textResult).toHaveText(value);
  }

  async enableSwitch(): Promise<void> {
    if ((await this.switchStateText.getText()).includes('ON')) {
      await this.formSwitch.click();
    }
    await expect(this.switchStateText).toHaveText(
      expect.stringContaining('OFF'),
    );
  }

  async selectDropdownOption(option: string): Promise<void> {
    await this.dropdown.click();

    if (driver.isAndroid) {
      const optionElement = $(textSelector(option));
      await optionElement.waitForDisplayed();
      await optionElement.click();
    } else {
      const picker = $('~Dropdown picker');
      await picker.waitForDisplayed();
      await picker.setValue(option);
    }

    await expect($(textSelector(option))).toBeDisplayed();
  }

  async submit(): Promise<void> {
    await this.activeButton.click();
  }

  async tapInactiveButton(): Promise<void> {
    await this.inactiveButton.click();
  }
}

export const formsScreen = new FormsScreen();
