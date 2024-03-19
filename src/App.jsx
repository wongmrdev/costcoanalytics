import "./App.css";
import { ThemeProvider, useTheme, View, Image } from '@aws-amplify/ui-react';
import { Amplify } from "aws-amplify";
import { generateClient } from 'aws-amplify/api';
import '@aws-amplify/ui-react/styles.css';
import awsConfig from "./aws-exports.js";
import * as queries from "./graphql/queries.js";
import React, { useState, useEffect, useMemo } from "react";
import Item from "./components/Item";
import styled from "styled-components";
import Canvas from "./components/Canvas";
import { Authenticator, Flex, Icon } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import useDebounce from "./components/useDebounce.js";
import { addStartDate, sortDateAscending } from "./models/utils.js";
import { MdClear } from "react-icons/md";
const isLocalhost = Boolean(
  window.location.hostname === "localhost" ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === "[::1]" ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match("127.0.0.1")
);

// Assuming you have two redirect URIs, and the first is for localhost and second is for production
const [localRedirectSignIn, productionRedirectSignIn] =
  awsConfig.oauth.redirectSignIn.split(",");
const [localRedirectSignOut, productionRedirectSignOut] =
  awsConfig.oauth.redirectSignOut.split(",");

const updatedAwsConfig = {
  ...awsConfig,
  oauth: {
    ...awsConfig.oauth,
    redirectSignIn: isLocalhost
      ? localRedirectSignIn
      : productionRedirectSignIn,
    redirectSignOut: isLocalhost
      ? localRedirectSignOut
      : productionRedirectSignOut,
  },
};
console.log({updatedAwsConfig});
const client = generateClient();
Amplify.configure(updatedAwsConfig);
// Auth.configure(updatedAwsConfig);
export const CouponContext = React.createContext(); //allow global access of variables and functions,
//must add Context Wrapper Provider with prop of the objects or functions to make global
//<RecipeContext.Provider value={recipeContextValue}></RecipeContext.Provider>
// around Highest Level Component and ContextWrapper.Consumer
// around the component using the global varible
// Requires export and import
// Requires useContext Hook

const StyledDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  background: grey 50%;
  padding: 0.25rem 0.5rem;
`;

const StyledLogo = styled.span`
  font-size: 1.5rem;
  background: -webkit-linear-gradient(
      217deg,
      rgba(255, 0, 0, 0.8),
      rgba(255, 0, 0, 0) 70.71%
    ),
    -webkit-linear-gradient(127deg, rgba(0, 255, 0, 0.8), rgba(0, 255, 0, 0)
          70.71%),
    -webkit-linear-gradient(336deg, rgba(0, 0, 255, 0.8), rgba(0, 0, 255, 0)
          70.71%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;
const StyledInput = styled.input`
  font-size: 1rem;
  color: black;
`;
const StyledButton = styled.button`
  font-size: 1rem;
  color: black;
`;

const StyledItemName = styled.div`
  font-size: 0.75rem;
  color: black;
  display: flex;
  justify-content: center;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
`;
function App() {
  const [loading, setLoading] = useState(false);
  const [coupons, setCoupons] = useState([]); //array of objects expected
  const [selectedCouponId, setSelectedCouponId] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebounce(searchValue, 1500);
  const [, setNextToken] = useState(null);
  const selectedCoupon = useMemo(() => {
    return selectedCouponId !== ""
      ? coupons.find((coupon) => selectedCouponId === coupon.id)
      : { itemNumber: "No selected item", itemName: "No selected item" };
  }, [selectedCouponId, coupons]);

  const couponContextValue = {
    selectedCoupon,
  };


  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      var couponsGot = await client.graphql({
        query: queries.listCoupons,
        variables: {
          limit: 150,
          filter: { itemName: { contains: debouncedSearchValue } },
        },
      });
      setCoupons(couponsGot.data.listCoupons.items);
      setNextToken(couponsGot.data.nextToken);
      setLoading(false);
    }
    fetchData();
    return () => {
      setLoading(false);
    };
  }, [debouncedSearchValue]);

  const couponsDateDesc = coupons
    .map(addStartDate)
    .sort(sortDateAscending)
    .reverse();

  function handleCouponSelect(id) {
    if (id === selectedCouponId) {
      return;
    } else {
      setSelectedCouponId(id);
    }
  }

  const components = {
    Header() {
      const { tokens } = useTheme();
  
      return (
        <View textAlign="center" padding={tokens.space.large}>
          <Image
            alt="NemoNemoNemo logo"
            src="https://p1.hiclipart.com/preview/482/453/150/finding-nemo-vista-icons-findingnemo2-256-png-icon.jpg"
          />
        </View>
      );
    },
  };  

  return (
    <ThemeProvider>
      <Authenticator components={components}>
        {({ signOut, user }) => (
          <div className="App">
            <header
              className="App-header"
              style={{
                display: Flex,
                justifyContent: "space-between",
                flexDirection: "row",
                flexWrap: "wrap",
                padding: "0.25rem 0.5rem",
                minHeight: "5vh",
              }}
            >
              <StyledLogo>NemoNemoNemo v0.1</StyledLogo>
              <div>
                <StyledInput
                  placeholder="Search..."
                  type="text"
                  value={searchValue}
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                    setSelectedCouponId("");
                  }}
                ></StyledInput>{" "}
                {searchValue ? (
                  <Icon
                    ariaLabel="ClearSearch"
                    as={MdClear}
                    onClick={() => setSearchValue("")}
                  />
                ) : null}
              </div>
              <StyledButton onClick={signOut}>Sign out</StyledButton>
            </header>

            <StyledItemName>{`${selectedCoupon?.itemName} - ${selectedCoupon?.itemNumber}`}</StyledItemName>
            <CouponContext.Provider value={couponContextValue}>
              {selectedCoupon?.itemNumber === "No selected item" ||
              selectedCoupon?.itemNumber === "Item Numbers vary" ? null : (
                <Canvas />
              )}
            </CouponContext.Provider>
            {!loading ? (
              <StyledDiv>
                {couponsDateDesc.map((coupon) => (
                  <Item
                    key={coupon.id}
                    dateValid={coupon.dateValid.match(
                      /\d{1,2}[/ .-]\d{1,2}[/ .-]\d{2}/
                    )}
                    itemName={coupon.itemName}
                    itemNumber={coupon.itemNumber}
                    itemYourCost={coupon.itemYourCost}
                    itemDiscountDollar={coupon.itemDiscountDollar}
                    itemDiscountCents={coupon.itemDiscountCents}
                    onClick={() => handleCouponSelect(coupon.id)}
                  ></Item>
                ))}
              </StyledDiv>
            ) : (
              <div>loading...</div>
            )}
          </div>
        )}
      </Authenticator>
    </ThemeProvider>
  );
}

export default App;
