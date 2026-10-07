import { expect, test } from '@playwright/test';

test.describe('Restful Booker authentication', () => {
  test('generates a token with valid credentials', async ({ request }) => {
    const response = await request.post('/auth', {
      data: {
        username: 'admin',
        password: 'password123',
      },
    });

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const body: unknown = await response.json();
    expect(body).toEqual({
      token: expect.any(String),
    });
    expect((body as { token: string }).token.length).toBeGreaterThan(0);
  });
});
