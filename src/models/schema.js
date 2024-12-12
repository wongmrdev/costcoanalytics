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
                }
            ]
        }
    },
    "enums": {},
    "nonModels": {},
    "codegenVersion": "3.4.4",
    "version": "c528d853410df231b65bd02b17aae529"
};