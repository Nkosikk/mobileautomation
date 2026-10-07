export interface BookingPayload {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: {
    checkin: string;
    checkout: string;
  };
  additionalneeds: string;
}

export const validBooking: BookingPayload = {
  firstname: 'Ada',
  lastname: 'Lovelace',
  totalprice: 325,
  depositpaid: true,
  bookingdates: {
    checkin: '2027-03-15',
    checkout: '2027-03-20',
  },
  additionalneeds: 'Breakfast',
};
