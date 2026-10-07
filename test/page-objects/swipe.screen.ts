import { BaseScreen } from './base.screen.js';
import { textSelector } from '../support/selectors.js';

class SwipeScreen extends BaseScreen {
  protected readonly screenSelector = '~Swipe-screen';

  async expectCard(title: string): Promise<void> {
    await expect($(textSelector(title))).toBeDisplayed();
  }

  async swipeCarouselLeft(): Promise<void> {
    await this.swipe('left', 0.55);
  }

  async scrollToHiddenLogo(): Promise<void> {
    const hiddenText = $(textSelector('You found me!!!'));
    for (let attempt = 0; attempt < 8; attempt += 1) {
      if (await hiddenText.isDisplayed()) {
        return;
      }

      await this.swipe('up');
    }
    await hiddenText.waitForDisplayed({ timeout: 5_000 });
  }
}

export const swipeScreen = new SwipeScreen();
