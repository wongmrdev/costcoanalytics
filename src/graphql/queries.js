/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const syncCoupons = /* GraphQL */ `
  query SyncCoupons(
    $filter: ModelcouponFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncCoupons(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
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
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const getCoupon = /* GraphQL */ `
  query GetCoupon($id: ID!) {
    getCoupon(id: $id) {
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
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listCoupons = /* GraphQL */ `
  query ListCoupons(
    $filter: ModelcouponFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCoupons(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const couponsByItemNumber = /* GraphQL */ `
  query CouponsByItemNumber(
    $itemNumber: String
    $sortDirection: ModelSortDirection
    $filter: ModelcouponFilterInput
    $limit: Int
    $nextToken: String
  ) {
    couponsByItemNumber(
      itemNumber: $itemNumber
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const couponsByItemName = /* GraphQL */ `
  query CouponsByItemName(
    $itemName: String
    $sortDirection: ModelSortDirection
    $filter: ModelcouponFilterInput
    $limit: Int
    $nextToken: String
  ) {
    couponsByItemName(
      itemName: $itemName
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const listCouponsByDateValid = /* GraphQL */ `
  query ListCouponsByDateValid(
    $dateValid: String
    $sortDirection: ModelSortDirection
    $filter: ModelcouponFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCouponsByDateValid(
      dateValid: $dateValid
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
