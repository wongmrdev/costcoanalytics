import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





export declare class coupon {
  readonly id: string;
  readonly dateValid?: string;
  readonly itemNumber?: string;
  readonly itemName?: string;
  readonly itemDescription?: string;
  readonly itemOther?: string;
  readonly itemVaries?: string;
  readonly itemShipping?: string;
  readonly itemYourCost?: string;
  readonly itemDiscountDollar?: string;
  readonly itemDiscountCents?: string;
  readonly itemDiscountLimit?: string;
  constructor(init: ModelInit<coupon>);
  static copyOf(source: coupon, mutator: (draft: MutableModel<coupon>) => MutableModel<coupon> | void): coupon;
}