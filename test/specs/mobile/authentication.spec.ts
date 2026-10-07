import { alertComponent } from '../../page-objects/components/alert.component.js';
import { navigationComponent } from '../../page-objects/components/navigation.component.js';
import { loginScreen } from '../../page-objects/login.screen.js';
import {
  createUserCredentials,
  invalidCredentials,
} from '../../support/test-data.js';

describe('Authentication', () => {
  beforeEach(async () => {
    await navigationComponent.open('Login');
    await loginScreen.waitForDisplayed();
  });

  it('creates a new account', async () => {
    await loginScreen.signup(createUserCredentials());

    await alertComponent.waitForText('You successfully signed up!');
    await alertComponent.accept();
  });

  it('logs in with valid credentials', async () => {
    await loginScreen.login(createUserCredentials());

    await alertComponent.waitForText('You are logged in!');
    await alertComponent.accept();
  });

  it('rejects an invalid password', async () => {
    await loginScreen.login(invalidCredentials);

    await loginScreen.expectPasswordValidation(
      'Please enter at least 8 characters',
    );
    await expect(await alertComponent.isOpen()).toBe(false);
  });
});
