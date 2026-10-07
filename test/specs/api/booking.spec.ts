import { expect, test } from '@playwright/test';
import {
  validBooking,
  type BookingPayload,
} from '../../data/booking.data.js';

interface CreateBookingResponse {
  bookingid: number;
  booking: BookingPayload;
}

test.describe('Restful Booker bookings', () => {
  test('creates a booking matching the request', async ({ request }) => {
    const response = await request.post('/booking', {
      data: validBooking,
    });

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const body = (await response.json()) as CreateBookingResponse;
    expect(body.bookingid).toEqual(expect.any(Number));
    expect(body.bookingid).toBeGreaterThan(0);
    expect(body.booking).toEqual(validBooking);
  });
});
