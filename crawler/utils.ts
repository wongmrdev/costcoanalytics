export type Coupon = {
  dateValid: string;
  itemDiscountDollar: string | null;
  itemDiscountCents: string | null;
  itemDiscountSummary: string | null;
  itemName: string | null;
  itemDescription: string | null;
  itemLimit: string | null;
  itemNumber: string;
  itemShipping: string | null;
  itemYourCost: string | null;
  itemOther: string | null;
};

export function isCoupon(coupon: Coupon | null): coupon is Coupon {
  return coupon !== null;
}