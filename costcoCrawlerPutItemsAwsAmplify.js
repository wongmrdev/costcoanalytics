import { DynamoDBClient  } from "@aws-sdk/client-dynamodb";
import dotenv from 'dotenv';
dotenv.config();

import puppeteer from 'puppeteer';
import random_ua from 'modern-random-ua';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import gql from 'graphql-tag';
import { graphql, print } from 'graphql';



const preparePageForTests = async (page) => {
  const userAgent = random_ua.generate();
  await page.setUserAgent(userAgent);
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', {
      get: () => false,
    });
  });

  await page.evaluateOnNewDocument(() => {
    // Overwrite the `plugins` property to use a custom getter.
    Object.defineProperty(navigator, 'languages', {
      get: () => ['en-US', 'en'],
    });
  });
};

async function crawlCouponsAndCreateCoupons() {
  console.log('crawlCouponsAndCreateCoupons');
  try {
    const URL = 'https://www.costco.com/online-offers.html';
    const browser = await puppeteer.launch({});
    const page = await browser.newPage();
    await page.setDefaultTimeout(60000);
    await preparePageForTests(page);
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      if (request.resourceType() === 'document') {
        request.continue();
      } else {
        request.abort();
      }
    });
    await page.goto(URL);
    await page.waitForTimeout(5000);
    var coupons = await page.evaluate(() => {
      var ecoCouponNodeList = [...document.querySelectorAll('li.eco-coupons')];
      var dateValid = document.querySelector(
        '#eco-webCoupons > div.row > div:nth-child(2) > p',
      )?.textContent;
      var couponsList = [];
      var couponsList = ecoCouponNodeList.map((ecoCouponNodeList) => ({
        dateValid: 'Valid 9/25/24 - 10/20/24',
        itemNumber:
          ecoCouponNodeList.querySelector('div.eco-items')?.textContent ?? '',
        itemName:
          ecoCouponNodeList.querySelector('div.eco-sl1')?.textContent ?? '',
        itemDescription:
          ecoCouponNodeList.querySelector('div.eco-sl2')?.textContent ?? '',
        itemOther:
          ecoCouponNodeList.querySelector('div.eco-other')?.textContent ?? '',
        itemVaries:
          ecoCouponNodeList.querySelector('div.eco-varies')?.textContent ?? '',
        itemShipping:
          ecoCouponNodeList.querySelector('div.eco-shipping')?.textContent ??
          '',
        itemYourCost:
          ecoCouponNodeList.querySelector(
            'tr.eco-border_top span.eco-priceTable',
          )?.textContent ?? '',
        itemDiscountDollar:
          ecoCouponNodeList.querySelector('table.eco-price span.eco-dollar')
            ?.textContent ?? '',
        itemDiscountCents:
          ecoCouponNodeList.querySelector('table.eco-price span.eco-cents')
            ?.textContent ?? '',
        itemDiscountLimit:
          ecoCouponNodeList.querySelector('table.eco-price td.eco-superScript')
            ?.textContent ?? '',
      }));
      return couponsList;
    });
    await browser.close();
    console.log(coupons.length);

    // Set the AWS Region
    const REGION = "us-west-2"; 

    // Create an Amazon DynamoDB service client object
    const dbclient = new DynamoDBClient({ region: REGION });

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
    var datenow = new Date();
    if (dryRun) console.log('Dry Run: ', dryRun);
    console.log(`found ${coupons.length} coupons on ${datenow.toISOString()}`);

    console.log(process.env.API_COSTCO_GRAPHQLAPIKEYOUTPUT);
    coupons.forEach(async function (coupon) {
      if (!dryRun) {
        console.log(coupon.itemNumber);
        const graphqlData = await axios({
          url: process.env.API_URL,
          method: 'post',
          headers: {
            'x-api-key': process.env.API_COSTCO_GRAPHQLAPIKEYOUTPUT,
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
          coupon: coupon,
          message: 'successfully created Coupon!',
        };
        console.log(body);
        return {
          statusCode: 200,
          body: JSON.stringify(body),
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        };
      }
    });
  } catch (err) {
    console.log('error crawling coupons: ', err);
  }
}

const dryRun = process.argv.includes('--dry-run');
crawlCouponsAndCreateCoupons(dryRun);
