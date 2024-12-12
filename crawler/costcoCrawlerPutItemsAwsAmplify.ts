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
          'div[data-testid="below_the_ad_text_content"] > div ',
        ),
      ];

      return elements.map((element, index): Coupon | null => {
        const discountPrimaryDollar =
          element
            .querySelector(
              'div[data-testid="prices_and_percentages_prices"] div:nth-child(2) > div:nth-child(1)',
            )
            ?.textContent?.trim() ?? null;
        const discountPrimaryCents =
          element
            .querySelector(
              'div[data-testid="prices_and_percentages_prices"] div:nth-child(2) > div:nth-child(2)',
            )
            ?.textContent?.trim() ?? null;
        const discountSecondaryText =
          element
            .querySelector(
              'div[data-testid="Text_prices_and_percentages_append_text"]',
            )
            ?.textContent?.trim() ?? null;
        const itemName =
          element
            .querySelector(':scope > div:nth-child(2)')
            ?.textContent?.trim() ?? null;
        const itemDetails =
          element
            .querySelector(':scope > div:nth-child(3)')
            ?.textContent?.trim() ?? null;
        const descriptionPattern =
          /^(?!Item|Limit)(.*?)(?=\s+(?:Item|Limit)|$)/i;
        const itemNumberPattern = /Item [0-9, ]+(?=,)|Item numbers vary/i;
        const limitPattern = /Limit.+?(?:\.)/i;
        const otherDetailsPattern =
          /(Item[0-9, ]+[,.])(^| )?(Limit.+?\.)?(^| )?(.*)?/i;
        const discountSecondaryValuePattern = /(?:after \$)([0-9,]+)(?: off)/i;
        const shippingPattern = /plus s&h/i;
        const description =
          itemDetails?.match(descriptionPattern)?.[0]?.trim() ?? null;
        const itemNumber =
          itemDetails?.match(itemNumberPattern)?.[0]?.trim() ?? null;
        const limit =
          itemDetails
            ?.match(limitPattern)?.[0]
            ?.trim()
            .slice(0, -1)
            .toUpperCase() ?? null;
        const otherDetails =
          itemDetails?.match(otherDetailsPattern)?.[5]?.trim() ?? null;
        const discountSecondaryValue =
          discountSecondaryText
            ?.match(discountSecondaryValuePattern)?.[1]
            ?.trim() ?? null;
        const shipping =
          discountSecondaryText?.match(shippingPattern)?.[0] ?? null;

        if (itemNumber === null) return null; // ignore coupons without item numbers
        return {
          dateValid: dateValid,
          itemDiscountSummary: discountSecondaryText,
          itemName: itemName,
          itemDescription: description,
          itemLimit: limit,
          itemNumber: itemNumber,
          itemOther: otherDetails,
          itemDiscountDollar: discountSecondaryText
            ? discountSecondaryValue
            : discountPrimaryDollar,
          itemDiscountCents: discountSecondaryText
            ? null
            : discountPrimaryCents,
          itemYourCost: discountSecondaryText
            ? `${discountPrimaryDollar}.${discountPrimaryCents ? discountPrimaryCents : '00'}`
            : null,
          itemShipping: shipping,
        };
      });
    });
    console.log('coupons:', coupons);

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
                itemOther: coupon.itemOther,
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
