require("dotenv").config();
const AWS = require("aws-sdk");
const axios = require("axios");
const gql = require("graphql-tag");
const graphql = require("graphql");

AWS.config.update({
  region: "us-west-2",
  endpoint: "https://dynamodb.us-west-2.amazonaws.com",
});

var docClient = new AWS.DynamoDB.DocumentClient();
var params = {
  TableName: "coupon-cpsma7xquzdu7cvzp2z5uzrqve-dev",
  ProjectionExpression: "id, itemNumber, dateValid, createdAt",
};
//
//console.log("Setting Regex for type Valid September 1 -  26, 2021'");
const regex1 = new RegExp(
  "Valid (january|february|march|april|may|june|july|august|september|october|november|december)([\\s,]+)(\\d{1,2})([\\s,]+)-([\\s,]+)(\\d{1,2})([, ]+)(\\d{4})",
  "i"
);
const dateTransformer1 = function (regexExecGroups) {
  let beginMonthAsLetters = regexExecGroups[1];
  let endMonthAsLetters = regexExecGroups[1];
  let beginMonth = getYearNumberFromMonthAsLetters(beginMonthAsLetters);
  let endMonth = getYearNumberFromMonthAsLetters(endMonthAsLetters);
  let beginDay = regexExecGroups[3];
  let endDay = regexExecGroups[6];
  let beginYear = regexExecGroups[8];
  let endYear = regexExecGroups[8];
  return {
    beginMonth: beginMonth,
    endMonth: endMonth,
    beginDay: beginDay,
    endDay: endDay,
    beginYear: beginYear,
    endYear: endYear,
  };
};
//Valid March 9 - April 3, 2022
//Valid April 13 - May 8, 2022
//Valid May 18 - June 12, 2022
//console.log("Valid September 29 - October 24, 2021");
const regex2 = new RegExp(
  "Valid (january|february|march|april|may|june|july|august|september|october|november|december)([\\s,]+)(\\d{1,2})([\\s,]+)-([\\s,]+)(january|february|march|april|may|june|july|august|september|october|november|december)([\\s,]+)(\\d{1,2})([, ]+)(\\d{4})",
  "i"
);
const dateTransformer2 = function (regexExecGroups) {
  let beginMonthAsLetters = regexExecGroups[1];
  let endMonthAsLetters = regexExecGroups[6];
  let beginMonth = getYearNumberFromMonthAsLetters(beginMonthAsLetters);
  let endMonth = getYearNumberFromMonthAsLetters(endMonthAsLetters);
  let beginDay = regexExecGroups[3];
  let endDay = regexExecGroups[8];
  let beginYear = regexExecGroups[10];
  let endYear = regexExecGroups[10];
  return {
    beginMonth: beginMonth,
    endMonth: endMonth,
    beginDay: beginDay,
    endDay: endDay,
    beginYear: beginYear,
    endYear: endYear,
  };
};
//console.log("Valid December 29, 2021 - January 23, 2022");
//don't forget to check the capture groups
const regex3 = new RegExp(
  "Valid (january|february|march|april|may|june|july|august|september|october|november|december)([\\s,]+)(\\d{1,2})([, ]+)(\\d{4})([, ]+)-([\\s,]+)(january|february|march|april|may|june|july|august|september|october|november|december)([\\s,]+)(\\d{1,2})([, ]+)(\\d{4})",
  "i"
);
const dateTransformer3 = function (regexExecGroups) {
  let beginMonthAsLetters = regexExecGroups[1];
  let endMonthAsLetters = regexExecGroups[8];
  let beginMonth = getYearNumberFromMonthAsLetters(beginMonthAsLetters);
  let endMonth = getYearNumberFromMonthAsLetters(endMonthAsLetters);
  let beginDay = regexExecGroups[3];
  let endDay = regexExecGroups[10];
  let beginYear = regexExecGroups[5];
  let endYear = regexExecGroups[12];
  return {
    beginMonth: beginMonth,
    endMonth: endMonth,
    beginDay: beginDay,
    endDay: endDay,
    beginYear: beginYear,
    endYear: endYear,
  };
};
//Valid February 2 to 27, 2022
const regex4 = new RegExp(
  "Valid (january|february|march|april|may|june|july|august|september|october|november|december)([\\s,]+)(\\d{1,2})([\\s,]+)to([\\s,]+)(\\d{1,2})([, ]+)(\\d{4})",
  "i"
);
const dateTransformer4 = function (regexExecGroups) {
  let beginMonthAsLetters = regexExecGroups[1];
  let endMonthAsLetters = regexExecGroups[1];
  let beginMonth = getYearNumberFromMonthAsLetters(beginMonthAsLetters);
  let endMonth = getYearNumberFromMonthAsLetters(endMonthAsLetters);
  let beginDay = regexExecGroups[3];
  let endDay = regexExecGroups[6];
  let beginYear = regexExecGroups[8];
  let endYear = regexExecGroups[8];
  return {
    beginMonth: beginMonth,
    endMonth: endMonth,
    beginDay: beginDay,
    endDay: endDay,
    beginYear: beginYear,
    endYear: endYear,
  };
};
console.log("Scanning Coupons table.");
//docClient.scan(params, regexDateValidUpdateOnScan(regex1, dateTransformer1)); //this function call scans for all coupons and updates the dateValid with a standard formatter
//docClient.scan(params, regexDateValidUpdateOnScan(regex2, dateTransformer2)); //this function call scans for all coupons and updates the dateValid with a standard formatter
docClient.scan(params, regexDateValidUpdateOnScan(regex2, dateTransformer2)); //this function call scans for all coupons and updates the dateValid with a standard formatter

function regexDateValidUpdateOnScan(regex, dateTransformer) {
  //Constructor to take in any regex and it's helper date transformation function and output a callback to DynamoDB.scan(err, callback)
  return function (err, data) {
    //return a dynamic function to call in scan
    if (err) {
      console.error(
        "Unable to scan the table. Error JSON:",
        JSON.stringify(err, null, 2)
      );
    } else {
      //Scan for items
      console.log("Scan succeeded.");
      //javascript regex constructor string needs special character groups escaped with \ (e.g. \\s for whitespace)

      //filter items which match regex, then update each item in DynamoDB
      data.Items.filter((coupon) => regex.test(coupon.dateValid)).forEach(
        function (coupon) {
          console.log(
            "updating: " + coupon.id + ";",
            coupon.dateValid,
            ";",
            coupon.createdAt
          );
          //match dateValid to regex of interest (parameter), then transform
          let regexExecGroups = regex.exec(coupon.dateValid);
          const { beginMonth, endMonth, beginDay, endDay, beginYear, endYear } =
            dateTransformer(regexExecGroups);
          console.log(
            "newDateValid " +
              beginMonth +
              "/" +
              beginDay +
              "/" +
              beginYear +
              " - " +
              endMonth +
              "/" +
              endDay +
              "/" +
              endYear
          );
          let newDateValid =
            "Valid " +
            beginMonth +
            "/" +
            beginDay +
            "/" +
            beginYear +
            " - " +
            endMonth +
            "/" +
            endDay +
            "/" +
            endYear; //Transformed DateValid

          //now lets update the item in DynamoDB tableName using update (aka updateItem) method
          var updateParams = {
            TableName: "coupon-cpsma7xquzdu7cvzp2z5uzrqve-dev",
            Key: { id: coupon.id },
            ExpressionAttributeNames: {
              "#DV": "dateValid",
            },
            ExpressionAttributeValues: {
              ":ndv": newDateValid,
            },
            UpdateExpression: "SET #DV= :ndv",
            ReturnValues: "ALL_NEW",
            ReturnItemCollectionMetrics: "SIZE",
          };
          //UpdateItems with ID and Transformed DateValid
          docClient.update(updateParams, function (err, data) {
            if (err)
              console.log(
                "error in the updateItem",
                err,
                err.stack
              ); // an error occurred
            else
              console.log(`successfully updated to: ${JSON.stringify(data)}`);
          });
        }
      );

      //updateCoupon continue scanning if we have more movies, because
      // scan can retrieve a maximum of 1MB of data
      if (typeof data.LastEvaluatedKey != "undefined") {
        console.log("Scanning for more...");
        params.ExclusiveStartKey = data.LastEvaluatedKey;
        docClient.scan(
          params,
          regexDateValidUpdateOnScan(regex, dateTransformer)
        );
      }
    }
  };
}

/*helper functions for dateValid reformatting*/
function getYearNumberFromMonthAsLetters(monthAsLetters) {
  try {
    var monthAsLettersLower = monthAsLetters.toLowerCase();
  } catch (err) {
    console.log(err, "can't to lower monthAsLetters");
  }

  switch (monthAsLettersLower) {
    case "january":
      return "1";
    case "february":
      return "2";
    case "march":
      return "3";
    case "april":
      return "4";
    case "may":
      return "5";
    case "june":
      return "6";
    case "july":
      return "7";
    case "august":
      return "8";
    case "september":
      return "9";
    case "october":
      return "10";
    case "november":
      return "11";
    case "december":
      return "12";
    case "jan":
      return "1";
    case "feb":
      return "2";
    case "mar":
      return "3";
    case "apr":
      return "4";
    //case  "may": return "5";
    case "jun":
      return "6";
    case "jul":
      return "7";
    case "aug":
      return "8";
    case "sep":
      return "9";
    case "oct":
      return "10";
    case "nov":
      return "11";
    case "dec":
      return "12";
    default:
      return "no matching month";
  }
}
