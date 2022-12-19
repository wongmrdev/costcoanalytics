import { ModelInit, MutableModel } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled } from "@aws-amplify/datastore";

type Eagercoupon = {
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
}

type Lazycoupon = {
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
}

export declare type coupon = LazyLoading extends LazyLoadingDisabled ? Eagercoupon : Lazycoupon

export declare const coupon: (new (init: ModelInit<coupon>) => coupon) & {
  copyOf(source: coupon, mutator: (draft: MutableModel<coupon>) => MutableModel<coupon> | void): coupon;
}