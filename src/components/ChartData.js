import React, { useState, useEffect } from "react";
import { Flex } from "@aws-amplify/ui-react";
export default function ChartData(data, selectedCouponData) {
  const [showingData, setShowingData] = useState(false);
  const toggleShowingData = () => setShowingData(!showingData);
  useEffect(() => {
    setShowingData(false);
  }, [data, selectedCouponData]);
  return (
    <>
      <Flex direction="row" justifyContent="center">
        <button onClick={() => toggleShowingData()}>
          {!showingData ? `Show` : `Hide`} Data
        </button>
      </Flex>
      {showingData && data && selectedCouponData ? (
        <div style={{ padding: "0.5rem", wordWrap: "wrap", whiteSpace: "pre" }}>
          {JSON.stringify(data, undefined, "\t")}
          <p>selectedCouponData</p>
          {JSON.stringify(selectedCouponData, undefined, "\t")}
        </div>
      ) : null}
    </>
  );
}
