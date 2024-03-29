import './App.css';
import { Amplify, Auth, API } from 'aws-amplify';
import awsConfig from './aws-exports';
import * as queries from './graphql/queries';
import React, { useState, useEffect, } from 'react';
import Item from './components/Item';
import styled from "styled-components";
import Canvas from "./components/Canvas.js";
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { theme } from './theme';

const isLocalhost = Boolean(
  window.location.hostname === "localhost" ||
  // [::1] is the IPv6 localhost address.
  window.location.hostname === "[::1]" ||
  // 127.0.0.1/8 is considered localhost for IPv4.
  window.location.hostname.match(
    /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
  )
);

// Assuming you have two redirect URIs, and the first is for localhost and second is for production
const [
  localRedirectSignIn,
  productionRedirectSignIn,
] = awsConfig.oauth.redirectSignIn.split(",");

const [
  localRedirectSignOut,
  productionRedirectSignOut,
] = awsConfig.oauth.redirectSignOut.split(",");

const updatedAwsConfig = {
  ...awsConfig,
  oauth: {
    ...awsConfig.oauth,
    redirectSignIn: isLocalhost ? localRedirectSignIn : productionRedirectSignIn,
    redirectSignOut: isLocalhost ? localRedirectSignOut : productionRedirectSignOut,
  }
}
Amplify.configure(updatedAwsConfig);
// Auth.configure(updatedAwsConfig);
API.configure(updatedAwsConfig);
export const CouponContext = React.createContext() //allow global access of variables and functions, 
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
`
const StyledLogo = styled.span`
  font-size: 2rem;
  background: -webkit-linear-gradient(217deg, rgba(255,0,0,.8), rgba(255,0,0,0) 70.71%),
  -webkit-linear-gradient(127deg, rgba(0,255,0,.8), rgba(0,255,0,0) 70.71%),
  -webkit-linear-gradient(336deg, rgba(0,0,255,.8), rgba(0,0,255,0) 70.71%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`
const StyledItemName = styled.span`
  font-size: 1.5rem;
  color: black;
`
function App() {

  const [coupons, setCoupons] = useState([]) //array of objects expected
  const [selectedCouponID, setselectedCouponID] = useState('')
  const selectedCoupon = selectedCouponID !== '' ? coupons.find(coupon => selectedCouponID === coupon.id) : { itemNumber: "no selected item", itemName: "no selected item" }
  const couponContextValue = {
    selectedCoupon
  }
  useEffect(() => {
    async function fetchData() {
      var couponsGot = await API.graphql({ query: queries.listCoupons, variables: { limit: 1500 } })
      console.log(couponsGot.data.listCoupons.items)
      setCoupons(couponsGot.data.listCoupons.items)
    }
    fetchData()
  }, [])


  function handleCouponSelect(id) {
    if (id === selectedCouponID) {

      return
    } else {
      setselectedCouponID(id)
    }
  }



  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div className="App">
          <header className="App-header">
            <button onClick={signOut}>Sign out</button>
            <StyledLogo>
              NemoNemoNemo

            </StyledLogo>
            <StyledItemName>
              {selectedCoupon.itemName}
            </StyledItemName>

          </header>
          <CouponContext.Provider value={couponContextValue}>
            <Canvas></Canvas>
          </CouponContext.Provider>
          <StyledDiv>
            {coupons.map(coupon => <Item
              key={coupon.id}
              dateValid={coupon.dateValid.match(/\d{1,2}[/ .-]\d{1,2}[/ .-]\d{2}/)}
              itemName={coupon.itemName} itemNumber={coupon.itemNumber}
              itemYourCost={coupon.itemYourCost}
              itemDiscountDollar={coupon.itemDiscountDollar}
              itemDiscountCents={coupon.itemDiscountCents}
              onClick={() => handleCouponSelect(coupon.id)}
            >
            </Item>)}
          </StyledDiv>

        </div>
      )}
    </Authenticator>

  );
}

export default App;
