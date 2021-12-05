import React from 'react'
import styled from 'styled-components';

const StyledSpan = styled.span`
  position: relative;
  display: block
  color: #000000;
  background-color: #FFFFFF;
  flex: 1 1 0px;
  transition: transform 500ms;
  min-width: 200px;
  padding: 5px;
  border-width: 3px;
  border-style: dotted;
  border-color: red;
  border-image-slice: 30%;
  border-radius: 5%;
  margin: 5px;
`;
const StyledDateValid = styled.span`
font-size: calc(6px + .75vmin)
`;
const StyledItemName = styled.span`
font-size: calc(8px+ .75vmin)
`;
const StyledItemNumber = styled.span`
font-size: calc(6px + .5vmin)
`;
const StyledItemYourCost = styled.span`
  font-style: italic;
  color: green;
`;
const StyledItemDiscount = styled.span`
  font-style: italic;
  color: red;
`;

function Item(item) {
  return (
    <StyledSpan key={item.id} onClick={item.onClick}>
      <StyledDateValid>{item.dateValid}</StyledDateValid>
      <br></br>
      <StyledItemName>{item.itemName}</StyledItemName>
      <br></br>
      <StyledItemNumber>{item.itemNumber}</StyledItemNumber>
      <br></br>
      <StyledItemDiscount>Coupon -${item.itemDiscountDollar}.{item.itemDiscountCents}</StyledItemDiscount>
      <br></br>
      <StyledItemYourCost>Your cost: {item.itemYourCost}</StyledItemYourCost>
    </StyledSpan>
  )
}

export default Item;