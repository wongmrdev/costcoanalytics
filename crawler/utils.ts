export type Coupon = {
  dateValid: string;
  itemDiscountDollar: string | null;
  itemDiscountCents: string | null;
  itemDiscountSummary: string | null;
  itemName: string | null;
  itemDescription?: string;
  itemLimit?: string;
  itemNumber: string;
  itemShipping?: string;
  itemYourCost: string | null;
};

export function isCoupon(coupon: Coupon | null): coupon is Coupon {
  return coupon !== null;
}