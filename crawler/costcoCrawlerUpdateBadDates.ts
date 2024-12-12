
import axios from 'axios';
import 'dotenv/config';
import { gql } from 'graphql-tag';
import { print } from 'graphql';
// Step 1: Fetch coupons matching the condition
const fetchCoupons = gql`
  query FetchCoupons($filter: ModelCouponFilterInput) {
    listCoupons(filter: $filter) {
      items {
        id
        dateValid
      }
    }
  }
`;
if (!process.env.API_URL) throw new Error("no API_URL")
if (!process.env.API_COSTCO_GRAPHQLAPIKEYOUTPUT) throw new Error("no API_COSTCO_GRAPHQLAPIKEYOUTPUT")
// Fetch coupons where dateValid equals a specific value
const response = await axios.post(process.env.API_URL, {
  query: print(fetchCoupons),
  variables: {
    filter: {
      dateValid: { eq: "Valid 12/23/24 - 11/17/24" },
    },
  },
}, {
  headers: {
    'x-api-key': process.env.API_COSTCO_GRAPHQLAPIKEYOUTPUT,
    'Content-Type': 'application/json',
  },
});

const couponsToUpdate = response.data.data.listCoupons.items;

// Step 2: Update each coupon individually
for (const coupon of couponsToUpdate) {
  const updateCouponMutation = gql`
    mutation UpdateCoupon($input: UpdateCouponInput!) {
      updateCoupon(input: $input) {
        id
        dateValid
      }
    }
  `;

  await axios.post(process.env.API_URL, {
    query: print(updateCouponMutation),
    variables: {
      input: {
        id: coupon.id,
        dateValid: "Valid 10/23/24 - 11/17/24",
      },
    },
  }, {
    headers: {
      'x-api-key': process.env.API_COSTCO_GRAPHQLAPIKEYOUTPUT,
      'Content-Type': 'application/json',
    },
  });
}

console.log("success:", { couponsToUpdate })
