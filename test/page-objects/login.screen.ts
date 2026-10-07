import { BaseScreen } from './base.screen.js';
import { textSelector } from '../support/selectors.js';
import type { UserCredentials } from '../support/test-data.js';

class LoginScreen extends BaseScreen {
  protected readonly screenSelector = '~Login-screen';

  private get emailInput() {
    return $('~input-email');
  }

  private get passwordInput() {
    return $('~input-password');
  }

  private get confirmPasswordInput() {
    return $('~input-repeat-password');
  }

  private get loginModeButton() {
    return $('~button-login-container');
  }

  private get signupModeButton() {
    return $('~button-sign-up-container');
  }

  private get loginButton() {
    return $('~button-LOGIN');
  }

  private get signupButton() {
    return $('~button-SIGN UP');
  }

  async login(credentials: UserCredentials): Promise<void> {
    await this.loginModeButton.click();
    await this.emailInput.setValue(credentials.email);
    await this.passwordInput.setValue(credentials.password);
    await this.loginButton.click();
  }

  async signup(credentials: UserCredentials): Promise<void> {
    await this.signupModeButton.click();
    await this.emailInput.setValue(credentials.email);
    await this.passwordInput.setValue(credentials.password);
    await this.confirmPasswordInput.setValue(credentials.password);
    await this.signupButton.click();
  }

  async expectPasswordValidation(message: string): Promise<void> {
    await expect($(textSelector(message))).toBeDisplayed();
  }
}

export const loginScreen = new LoginScreen();
