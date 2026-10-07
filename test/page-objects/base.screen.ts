export abstract class BaseScreen {
  protected abstract readonly screenSelector: string;

  async waitForDisplayed(): Promise<void> {
    await $(this.screenSelector).waitForDisplayed();
  }

  protected async swipe(
    direction: 'left' | 'up',
    distanceRatio = 0.65,
  ): Promise<void> {
    const { width, height } = await browser.getWindowSize();
    const centerX = Math.round(width / 2);
    const centerY = Math.round(height / 2);
    const horizontalDistance = Math.round(width * distanceRatio);
    const verticalDistance = Math.round(height * distanceRatio);

    const start =
      direction === 'left'
        ? { x: Math.round(width * 0.85), y: centerY }
        : { x: centerX, y: Math.round(height * 0.45) };
    const end =
      direction === 'left'
        ? { x: Math.max(1, start.x - horizontalDistance), y: centerY }
        : { x: centerX, y: Math.max(1, start.y - verticalDistance) };

    await browser.performActions([
      {
        type: 'pointer',
        id: 'finger',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, ...start },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration: 250 },
          { type: 'pointerMove', duration: 700, ...end },
          { type: 'pointerUp', button: 0 },
        ],
      },
    ]);
    await browser.releaseActions();
  }
}
