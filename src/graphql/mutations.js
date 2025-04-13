/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createCoupon = /* GraphQL */ `
  mutation CreateCoupon(
    $input: CreateCouponInput!
    $condition: ModelcouponConditionInput
  ) {
    createCoupon(input: $input, condition: $condition) {
      id
      dateValid
      itemNumber
      itemName
      itemDescription
      itemOther
      itemVaries
      itemShipping
      itemYourCost
      itemDiscountDollar
      itemDiscountCents
      itemDiscountLimit
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      owner
      __typename
    }
  }
`;
export const updateCoupon = /* GraphQL */ `
  mutation UpdateCoupon(
    $input: UpdateCouponInput!
    $condition: ModelcouponConditionInput
  ) {
    updateCoupon(input: $input, condition: $condition) {
      id
      dateValid
      itemNumber
      itemName
      itemDescription
      itemOther
      itemVaries
      itemShipping
      itemYourCost
      itemDiscountDollar
      itemDiscountCents
      itemDiscountLimit
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      owner
      __typename
    }
  }
`;
export const deleteCoupon = /* GraphQL */ `
  mutation DeleteCoupon(
    $input: DeleteCouponInput!
    $condition: ModelcouponConditionInput
  ) {
    deleteCoupon(input: $input, condition: $condition) {
      id
      dateValid
      itemNumber
      itemName
      itemDescription
      itemOther
      itemVaries
      itemShipping
      itemYourCost
      itemDiscountDollar
      itemDiscountCents
      itemDiscountLimit
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      owner
      __typename
    }
  }
`;
