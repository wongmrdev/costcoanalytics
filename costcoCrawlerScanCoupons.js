require("dotenv").config();
const AWS = require("aws-sdk");

AWS.config.update({
  region: "us-west-2",
  endpoint: "https://dynamodb.us-west-2.amazonaws.com",
});

var docClient = new AWS.DynamoDB.DocumentClient();
var params = {
  TableName: "coupon-cpsma7xquzdu7cvzp2z5uzrqve-dev",
  //FilterExpression: "createdAt >= :day",
  //ExpressionAttributeValues: { ":day": "2022-01-22T23:05:13.607Z" },
  ProjectionExpression: "id, itemNumber, dateValid, createdAt",
  Limit: 2000,
};
// eslint-disable-next-line no-useless-escape
const regex1 = new RegExp(`/2022`, "i");
docClient.scan(params, function (err, data) {
  if (err) {
    console.log(err);
  } else {
    console.log("scanning...");
    data.Items.filter((coupon) => regex1.test(coupon.dateValid)).forEach(
      (coupon) => console.log(coupon)
    );
  }
  if (data.LastEvaluatedKey) {
    params.ExclusiveStartKey = data.LastEvaluatedKey;
    docClient.scan(params, function (err, data) {
      if (err) {
        console.log(err);
      } else {
        console.log("continuing the scan");
        data.Items.filter((coupon) => regex1.test(coupon.dateValid)).forEach(
          (coupon) => console.log(coupon)
        );
      }
    });
  }
});
