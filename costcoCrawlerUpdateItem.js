require('dotenv').config()
const AWS = require('aws-sdk')
const axios = require('axios');
const gql = require('graphql-tag');
const graphql = require('graphql');

AWS.config.update({
    region: "us-west-2",
    endpoint: "https://dynamodb.us-west-2.amazonaws.com"
});

var docClient = new AWS.DynamoDB.DocumentClient();



var params = {
    TableName: "coupon-cpsma7xquzdu7cvzp2z5uzrqve-dev",
    ProjectionExpression: "id, itemNumber, dateValid",
    FilterExpression: " begins_with(dateValid, :letter1)",
    ExpressionAttributeValues: {
        ":letter1": "Valid A"
    }


}


console.log("Scanning Coupons table.");
docClient.scan(params, onScan);

function onScan(err, data) {
    if (err) {
        console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        // print all the movies
        console.log("Scan succeeded.");
        data.Items.forEach(function (coupon) {
            console.log(
                coupon.id + ";",
                coupon.dateValid, ";", coupon.itemNumber);
        });

        // continue scanning if we have more movies, because
        // scan can retrieve a maximum of 1MB of data
        if (typeof data.LastEvaluatedKey != "undefined") {
            console.log("Scanning for more...");
            params.ExclusiveStartKey = data.LastEvaluatedKey;
            docClient.scan(params, onScan);
        }
    }
}

