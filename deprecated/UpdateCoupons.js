
require('dotenv').config();
const AWS = require('aws-sdk');
const axios = require('axios');
const graphql = require('graphql');
const gql = require('graphql-tag')
const { print } = graphql

const listCoupons = gql`
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
      }
      nextToken
      startedAt
    }
  }
`;

const getCoupon = gql`
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
    }
  }
`;

async function updateCoupons() {
  try {
    AWS.config.update({
      region: "us-west-2",
      endpoint: "https://dynamodb.us-west-2.amazonaws.com"
    });

    //updateCoupon()
    const variables = {
      "limit": 200,
    }

    let graphqlDataResponse = {};
    graphqlDataResponse = await axios({
      url: process.env.API_URL,
      method: 'post',
      headers: {
        "x-api-key": process.env.API_COSTCO_GRAPHQLAPIKEYOUTPUT
      },
      data: {
        query: print(listCoupons),
        variables: variables
      }

    })

    console.log(graphqlDataResponse.data.data.listCoupons)
    console.log(`nextToken: ${graphqlDataResponse.data.data.listCoupons.nextToken}`)
    while (graphqlDataResponse.data.data.listCoupons.nextToken) {
      variables.nextToken = graphqlDataResponse.data.data.listCoupons.nextToken
      graphqlDataResponse = await axios({
        url: process.env.API_URL,
        method: 'post',
        headers: {
          "x-api-key": process.env.API_COSTCO_GRAPHQLAPIKEYOUTPUT
        },
        data: {
          query: print(listCoupons),
          variables: variables
        }

      })
      console.log(`nextToken: ${variables.nextToken}`)
      console.log(`inside while loop ${graphqlDataResponse.data.data.listCoupons}`)
    }
    //filter dates to update
    //const regex = new RegExp("Valid (january|february|march|april|may|june|july|august|september|october|november|december)([\\s,]+)(\\d+)([\\s,]+)-([\\s,]+)(\\d+)([, ]+)(\\d{4})", "i")
    //javascript regex constructor string needs special character groups escaped with \ (e.g. \\s for whitespace)
    //console.log(regex.test('Valid September 1 -  26, 2021'))
    // const filteredItems = graphqlData.data.data.listCoupons.items
    //     .filter(item => regex.test(item.dateValid))
    // console.log(filteredItems.forEach(item => console.log(item.dateValid)))




    //set response status to success
    const body = {
      message: "successfully created Coupon!"
    }
    return {
      statusCode: 200,
      body: JSON.stringify(body),
      headers: {
        "Access-Control-Allow-Origin": "*",
      }
    }
      ;
  } catch (err) {
    console.log('error updating to appsync: ', err);
  }

}

updateCoupons();