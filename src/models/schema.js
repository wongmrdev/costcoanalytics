export const schema = {
    "models": {
        "coupon": {
            "name": "coupon",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "dateValid": {
                    "name": "dateValid",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "itemNumber": {
                    "name": "itemNumber",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "itemName": {
                    "name": "itemName",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "itemDescription": {
                    "name": "itemDescription",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "itemOther": {
                    "name": "itemOther",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "itemVaries": {
                    "name": "itemVaries",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "itemShipping": {
                    "name": "itemShipping",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "itemYourCost": {
                    "name": "itemYourCost",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "itemDiscountDollar": {
                    "name": "itemDiscountDollar",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "itemDiscountCents": {
                    "name": "itemDiscountCents",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "itemDiscountLimit": {
                    "name": "itemDiscountLimit",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": []
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "coupons",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "aws_cognito_user_pools",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "couponsByItemNumber",
                        "fields": [
                            "itemNumber"
                        ],
                        "queryField": "couponsByItemNumber"
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "couponsByItemName",
                        "fields": [
                            "itemName"
                        ],
                        "queryField": "couponsByItemName"
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "ByDateValid",
                        "fields": [
                            "dateValid"
                        ],
                        "queryField": "listCouponsByDateValid"
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "ByCreatedAt",
                        "fields": [
                            "createdAt",
                            "id"
                        ],
                        "queryField": "listCouponsByCreatedAt"
                    }
                },
                {
                    "type": "auth",
                    "properties": {
                        "rules": [
                            {
                                "allow": "public",
                                "operations": [
                                    "read"
                                ]
                            },
                            {
                                "provider": "userPools",
                                "ownerField": "owner",
                                "allow": "owner",
                                "operations": [
                                    "create",
                                    "update",
                                    "delete"
                                ],
                                "identityClaim": "cognito:username"
                            }
                        ]
                    }
                }
            ]
        }
    },
    "enums": {},
    "nonModels": {},
    "codegenVersion": "3.4.4",
    "version": "6109619ef25060ed0700e5b5612855b6"
};