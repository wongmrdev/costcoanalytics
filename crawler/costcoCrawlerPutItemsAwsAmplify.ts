import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import 'dotenv/config';

import puppeteer from 'puppeteer';
import random_ua = require('modern-random-ua');
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { gql } from 'graphql-tag';
import { print } from 'graphql';
import { type Coupon, isCoupon } from './utils.js';

const preparePageForTests = async (page: puppeteer.Page) => {
  const userAgent: string = random_ua.generate();
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

async function crawlCouponsAndCreateCoupons(dryRun: boolean) {
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
    await page.waitForSelector('div[data-testid="below_the_ad_text_content"]', {
      timeout: 10000,
    });

    // Check if document.body is retrieved successfully
    const bodyContent = await page.evaluate(() =>
      document.body?.innerHTML?.slice(100000, 100500),
    ); // First 500 characters
    // Wait for the specific selector
    // Get all coupon nodes and log them

    if (!bodyContent) {
      console.error(
        'Failed to retrieve document.body or the content is empty.',
      );
      await browser.close();
      return;
    } else {
      console.log(
        "Successfully retrieved document.body content. Here's a snippet:",
        bodyContent,
      );
    }

    const coupons: (Coupon | null)[] = await page.evaluate(() => {
      const dateValid = 'Valid 11/20/24 - 12/24/24';
      const elements = [
        ...document.querySelectorAll(
          'div[data-testid="below_the_ad_text_content"]',
        ),
      ];

      return elements.map((element, index): Coupon | null => {
        const itemDiscountPrefixSymbol =
          element
            .querySelector(
              'div[data-testid="prices_and_percentages_prices"] div:nth-child(1)',
            )
            ?.innerHTML.trim() ?? null;
        const itemDiscountDollar =
          element
            .querySelector(
              'div[data-testid="prices_and_percentages_prices"] div:nth-child(2) > div:nth-child(1)',
            )
            ?.innerHTML.trim() ?? null;
        const itemDiscountCents =
          element
            .querySelector(
              'div[data-testid="prices_and_percentages_prices"] div:nth-child(2) > div:nth-child(2)',
            )
            ?.innerHTML.trim() ?? null;
        const discountText =
          element
            .querySelector(
              'div[data-testid="Text_prices_and_percentages_append_text"]',
            )
            ?.innerHTML.trim() ?? null;
        const itemName =
          element
            .querySelector('div div[data-testid="Text"]')
            ?.innerHTML.trim() ?? null;
        if (
          [
            itemDiscountPrefixSymbol,
            itemDiscountDollar,
            itemDiscountCents,
            discountText,
            itemName,
          ].every((item) => item === null)
        )
          return null;
        return {
          dateValid: dateValid,
          itemDiscountSummary: discountText,
          itemName: itemName,
          itemDescription: 'itemDescription',
          itemLimit: 'itemLimit',
          itemNumber: 'itemNumber',
          itemShipping: 'itemShipping',
          itemDiscountDollar: itemDiscountDollar,
          itemDiscountCents: itemDiscountCents,
          itemYourCost: `${itemDiscountDollar}.${itemDiscountCents}`,
        };
      });
    });
    console.log('coupons:', coupons);

    const couponsElementsXML = await page.evaluate(() => {
      const couponElements = [
        ...document.querySelectorAll(
          'div[data-testid="below_the_ad_text_content"] ',
        ),
      ].map((node) => {
        const serializer = new XMLSerializer();
        const rawHTML = serializer.serializeToString(node);
        const formattedHTML = rawHTML.replace(/></g, '>\n<'); // Simple line-break insertion
        return formattedHTML;
      });

      if (!couponElements) {
        return 'Not found';
      }

      return couponElements;
    });
    console.log('couponsElementsXML:', couponsElementsXML.slice(0, 5));

    await browser.close();

    // Set the AWS Region
    const REGION = 'us-west-2';

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
    if (coupons.filter(isCoupon).length === 0)
      throw new Error('No Coupons found');

    coupons.filter(isCoupon).forEach(async function (coupon: Coupon) {
      if (!dryRun) {
        if (!process.env.API_URL) {
          throw new Error('API_URL is not set in the environment.');
        }
        console.log({ coupon });
        const graphqlData = await axios.post(
          process.env.API_URL,
          {
            query: print(createCoupon),
            variables: {
              input: {
                id: uuidv4(),
                itemNumber: coupon.itemNumber,
                dateValid: coupon.dateValid,
                itemName: coupon.itemName,
                itemDescription: coupon.itemDescription,
                itemOther: null,
                itemVaries: null,
                itemShipping: coupon.itemShipping,
                itemYourCost: coupon.itemYourCost,
                itemDiscountDollar: coupon.itemDiscountDollar,
                itemDiscountCents: coupon.itemDiscountCents,
                itemDiscountLimit: coupon.itemLimit,
              },
            },
          },
          {
            headers: {
              'x-api-key': process.env.API_COSTCO_GRAPHQLAPIKEYOUTPUT,
            },
          },
        );

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
