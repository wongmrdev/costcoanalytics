import './App.css';
import Amplify, { API, Auth } from 'aws-amplify';
import awsconfig from './aws-exports';
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import * as queries from './graphql/queries';
import React, { useState, useEffect, } from 'react';
import Item from './components/Item';
import styled from "styled-components";
import Canvas from "./components/Canvas.js";
Amplify.configure(awsconfig);

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
    <div className="App">
      <header className="App-header">
        <AmplifySignOut />
        <StyledLogo>
          Costco Analytics

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
  );
}

export default withAuthenticator(App);
