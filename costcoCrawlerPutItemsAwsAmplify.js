require("dotenv").config();
const puppeteer = require("puppeteer");
const AWS = require("aws-sdk");
const random_ua = require("modern-random-ua");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");
const gql = require("graphql-tag");
const graphql = require("graphql");
const { print } = graphql;

// const  { Amplify, API, Datastore } = require('aws-amplify');
// const {awsconfig} = require("./src/aws-exports")
// Amplify.configure(awsconfig);

const preparePageForTests = async (page) => {
  const userAgent = random_ua.generate();
  await page.setUserAgent(userAgent);
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, "webdriver", {
      get: () => false,
    });
  });

  await page.evaluateOnNewDocument(() => {
    // Overwrite the `plugins` property to use a custom getter.
    Object.defineProperty(navigator, "languages", {
      get: () => ["en-US", "en"],
    });
  });
};

async function getCoupons() {
  try {
    const URL = "https://www.costco.com/online-offers.html";
    const browser = await puppeteer.launch({});
    const page = await browser.newPage();
    await page.setDefaultTimeout(60000);
    await preparePageForTests(page);
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      if (request.resourceType() === "document") {
        request.continue();
      } else {
        request.abort();
      }
    });
    await page.goto(URL);
    await page.waitForTimeout(5000);
    var coupons = await page.evaluate(() => {
      var ecoCouponNodeList = [...document.querySelectorAll("li.eco-coupons")];
      var dateValid = document.querySelector(
        "#eco-webCoupons > div.row > div:nth-child(2) > p"
      )?.textContent;
      var couponsList = [];
      var couponsList = ecoCouponNodeList.map((ecoCouponNodeList) => ({
        dateValid: dateValid,
        itemNumber:
          ecoCouponNodeList.querySelector("div.eco-items")?.textContent ?? "",
        itemName:
          ecoCouponNodeList.querySelector("div.eco-sl1")?.textContent ?? "",
        itemDescription:
          ecoCouponNodeList.querySelector("div.eco-sl2")?.textContent ?? "",
        itemOther:
          ecoCouponNodeList.querySelector("div.eco-other")?.textContent ?? "",
        itemVaries:
          ecoCouponNodeList.querySelector("div.eco-varies")?.textContent ?? "",
        itemShipping:
          ecoCouponNodeList.querySelector("div.eco-shipping")?.textContent ??
          "",
        itemYourCost:
          ecoCouponNodeList.querySelector(
            "tr.eco-border_top span.eco-priceTable"
          )?.textContent ?? "",
        itemDiscountDollar:
          ecoCouponNodeList.querySelector("table.eco-price span.eco-dollar")
            ?.textContent ?? "",
        itemDiscountCents:
          ecoCouponNodeList.querySelector("table.eco-price span.eco-cents")
            ?.textContent ?? "",
        itemDiscountLimit:
          ecoCouponNodeList.querySelector("table.eco-price td.eco-superScript")
            ?.textContent ?? "",
      }));
      return couponsList;
    });
    await browser.close();

    //Upload to AWS
    AWS.config.update({
      region: "us-west-2",
      endpoint: "https://dynamodb.us-west-2.amazonaws.com",
    });

    const createCoupon = gql`
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
        }
      }
    `;
    var datenow = new Date().now;

    coupons.forEach(async function (coupon) {
      console.log(coupon.itemNumber);
      const graphqlData = await axios({
        url: process.env.API_URL,
        method: "post",
        headers: {
          "x-api-key": process.env.API_COSTCO_GRAPHQLAPIKEYOUTPUT,
        },
        data: {
          query: print(createCoupon),
          variables: {
            input: {
              id: uuidv4(),
              itemNumber: coupon.itemNumber,
              dateValid: coupon.dateValid,
              itemName: coupon.itemName,
              itemDescription: coupon.itemDescription,
              itemOther: coupon.itemOther,
              itemVaries: coupon.itemVaries,
              itemShipping: coupon.itemShipping,
              itemYourCost: coupon.itemYourCost,
              itemDiscountDollar: coupon.itemDiscountDollar,
              itemDiscountCents: coupon.itemDiscountCents,
              itemDiscountLimit: coupon.itemDiscountLimit,
            },
          },
        },
      });
      const body = {
        message: "successfully created Coupon!",
      };
      console.log(body);
      return {
        statusCode: 200,
        body: JSON.stringify(body),
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      };
    });
  } catch (err) {
    console.log("error posting to appsync: ", err);
  }
}

getCoupons();
