# CostcoAnalytics

## By Matthew Wong

### This app's front end can be found [here](https://master.d2ma2xsnuu3nlm.amplifyapp.com/)

The entire backend is hosted on AWS, managed by AWS amplify CI/CD from github repo.

This app is built with Typescript, ReactJS, AWS DynamoDB, AWS Amplify, AWS AppSync, git, NodeJS.

Data is scraped from Costco's web coupon book issued every month by _costcoCrawlerPutItemsAwsAmplify_.js, deprecated versions of the data extraction were ~~costcoCrawlerPutItemsDynamoDB.js~~

Data can be retrieved and updated/transformed through the use of _costcoCrawlerScanCoupons.js_ and _costcoCrawlerUpdateItem.js_

# Screenshots

![image](https://user-images.githubusercontent.com/20716672/144202482-d7a4d2d9-d34e-46a9-9f90-1b1e752fdf5c.png)
DynamoDB Table of Coupons
![image](https://user-images.githubusercontent.com/20716672/144202930-5e390b3d-87d2-4ff3-9189-89bc4c9ed049.png)

# Useful Commands

```bash
# typescript compile
npx tsc
```

```bash
# run the script
node ./dist/crawler/costcoCrawlerPutItemsAwsAmplify.js
```
