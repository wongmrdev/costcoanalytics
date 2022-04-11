import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





export declare class coupon {
  readonly id: string;
  readonly dateValid?: string | null;
  readonly itemNumber?: string | null;
  readonly itemName?: string | null;
  readonly itemDescription?: string | null;
  readonly itemOther?: string | null;
  readonly itemVaries?: string | null;
  readonly itemShipping?: string | null;
  readonly itemYourCost?: string | null;
  readonly itemDiscountDollar?: string | null;
  readonly itemDiscountCents?: string | null;
  readonly itemDiscountLimit?: string | null;
  constructor(init: ModelInit<coupon>);
  static copyOf(source: coupon, mutator: (draft: MutableModel<coupon>) => MutableModel<coupon> | void): coupon;
}