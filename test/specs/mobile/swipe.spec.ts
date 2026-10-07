import { navigationComponent } from '../../page-objects/components/navigation.component.js';
import { swipeScreen } from '../../page-objects/swipe.screen.js';

describe('Swipe gestures', () => {
  beforeEach(async () => {
    await navigationComponent.open('Swipe');
    await swipeScreen.waitForDisplayed();
  });

  it('changes carousel content and reveals hidden vertical content', async () => {
    await swipeScreen.expectCard('FULLY OPEN SOURCE');
    await swipeScreen.swipeCarouselLeft();
    await swipeScreen.expectCard('GREAT COMMUNITY');

    await swipeScreen.scrollToHiddenLogo();
    await expect($('~WebdriverIO logo')).toBeDisplayed();
  });
});
