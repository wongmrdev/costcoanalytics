// Import necessary modules
import axios, { AxiosResponse } from 'axios';
import 'dotenv/config';
import { gql } from 'graphql-tag';
import { print } from 'graphql';

// Define TypeScript interfaces

// Structure of a single coupon
interface Coupon {
  id: string;
  dateValid: string;
  itemDescription: string;
  createdAt: string;
  _version: number;
  // Add other fields as needed
}

// Structure of the FetchCoupons query response
interface FetchCouponsResponse {
  data: {
    listCouponsByDateValid: {
      items: Coupon[];
    };
  };
  errors?: any[]; // Consider defining a more specific type for errors
}

// Structure of the UpdateCoupon mutation response
interface UpdateCouponResponse {
  data: {
    updateCoupon: {
      id: string;
      dateValid: string;
      // Add other fields as needed
    };
  };
  errors?: any[];
}

// Main asynchronous function to fetch and update coupons
async function fetchAndUpdateCoupons(): Promise<void> {
  try {
    // Validate environment variables
    const { API_URL, API_COSTCO_GRAPHQLAPIKEYOUTPUT } = process.env;
    if (!API_URL) throw new Error("Environment variable API_URL is not set.");
    if (!API_COSTCO_GRAPHQLAPIKEYOUTPUT) throw new Error("Environment variable API_COSTCO_GRAPHQLAPIKEYOUTPUT is not set.");

    // Define the incorrect and correct dateValid values
    const incorrectDateValid = "Valid 12/23/24 - 11/17/24";
    const correctDateValid = "Valid 10/23/24 - 11/17/24";

    console.log(`Fetching coupons with dateValid = "${incorrectDateValid}"...`);

    // Step 1: Define the GraphQL query to fetch coupons
    const fetchCoupons = gql`
      query FetchCouponsByDateValid($dateValid: String!, $limit: Int) {
        listCouponsByDateValid(dateValid: $dateValid, limit: $limit) {
          items {
            id
            dateValid
            itemDescription
            createdAt
            _version
          }
        }
      }
    `;

    // Execute the fetchCoupons query with proper typing
    const fetchResponse: AxiosResponse<FetchCouponsResponse> = await axios.post<FetchCouponsResponse>(
      API_URL,
      {
        query: print(fetchCoupons),
        variables: {
          dateValid: incorrectDateValid,
          limit: 100, // Adjust limit as needed
        },
      },
      {
        headers: {
          'x-api-key': API_COSTCO_GRAPHQLAPIKEYOUTPUT,
          'Content-Type': 'application/json',
        },
      }
    );

    // Handle GraphQL errors if any
    if (fetchResponse.data.errors && fetchResponse.data.errors.length > 0) {
      console.error('GraphQL Errors:', fetchResponse.data.errors);
      throw new Error('Failed to fetch coupons due to GraphQL errors.');
    }

    const couponsToUpdate: Coupon[] = fetchResponse.data.data.listCouponsByDateValid.items;

    console.log(`Found ${couponsToUpdate.length} coupon(s) to update.`);

    // Step 2: Define the GraphQL mutation to update a coupon
    const updateCouponMutation = gql`
      mutation UpdateCoupon($input: UpdateCouponInput!) {
        updateCoupon(input: $input) {
          id
          dateValid
        }
      }
    `;

    // Iterate over each coupon and perform the update
    for (const coupon of couponsToUpdate) {
      try {
        console.log(`Updating coupon ID: ${coupon.id}...`);

        // Define the input for the updateCoupon mutation
        const updateInput = {
          id: coupon.id,
          dateValid: correctDateValid,
          _version: coupon._version, // Include version to satisfy DynamoDB conditional update
        };

        console.log("Updating with payload:", JSON.stringify(updateInput));

        // Execute the updateCoupon mutation with proper typing
        const updateResponse: AxiosResponse<UpdateCouponResponse> = await axios.post<UpdateCouponResponse>(
          API_URL,
          {
            query: print(updateCouponMutation),
            variables: {
              input: updateInput,
            },
          },
          {
            headers: {
              'x-api-key': API_COSTCO_GRAPHQLAPIKEYOUTPUT,
              'Content-Type': 'application/json',
            },
          }
        );

        // Handle GraphQL errors if any
        if (updateResponse.data.errors && updateResponse.data.errors.length > 0) {
          console.error(`GraphQL Errors while updating coupon ID ${coupon.id}:`, updateResponse.data.errors);
          continue; // Skip to the next coupon
        }

        const updatedCoupon = updateResponse.data.data.updateCoupon;
        console.log(`Successfully updated coupon ID: ${updatedCoupon.id} with dateValid: "${updatedCoupon.dateValid}"`);

      } catch (updateError) {
        console.error(`Error updating coupon ID ${coupon.id}:`, updateError);
        // Optionally, implement retry logic or log the error for further analysis
      }
    }

    console.log("All eligible coupons have been processed.");

  } catch (error) {
    console.error("An error occurred during the fetch and update process:", error);
  }
}

// Invoke the main function
fetchAndUpdateCoupons();
