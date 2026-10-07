export type MainTab = 'Login' | 'Forms' | 'Swipe';

export class NavigationComponent {
  async open(tab: MainTab): Promise<void> {
    const tabElement = await $(`~${tab}`);
    await tabElement.waitForDisplayed();
    await tabElement.click();
  }
}

export const navigationComponent = new NavigationComponent();
