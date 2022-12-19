import React, { useContext, useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import * as queries from "../graphql/queries";
import { CouponContext } from "../App";
import { API } from "aws-amplify";
export default function Canvas() {
  const [selectedCouponData, setSelectedCouponData] = useState([]);
  const { selectedCoupon } = useContext(CouponContext);
  useEffect(() => {
    console.log("running canvas useEffect");
    async function fetchData() {
      try {
        var selectedCouponData = await API.graphql({
          query: queries.couponByItemNumber,
          variables: { itemNumber: selectedCoupon.itemNumber },
        });
        setSelectedCouponData(selectedCouponData.data.couponByItemNumber.items);
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, [selectedCoupon]);
  console.log({ selectedCouponData });
  const chartData = {
    labels: selectedCouponData.map((coupon) => coupon.dateValid),

    datasets: [
      {
        label: "Your Cost",
        fill: false,
        lineTension: 0.5,
        backgroundColor: "rgba(75,192,192,1)",
        borderColor: "rgba(0,0,0,1)",
        borderWidth: 2,
        data: selectedCouponData.map((coupon) =>
          coupon.itemYourCost
            ? parseFloat(coupon.itemYourCost.replace(/\$|,/g, ""))
            : 0
        ),
      },
      {
        label: "Discount",
        fill: false,
        lineTension: 0.5,
        backgroundColor: "rgb(255, 69, 0)",
        borderColor: "rgba(0,0,0,1)",
        borderWidth: 2,
        data: selectedCouponData.map((coupon) =>
          coupon.itemDiscountDollar
            ? parseFloat(coupon.itemDiscountDollar.replace(/\$|,/g, ""))
            : null
        ),
      },
    ],
  };
  console.log({ chartData });
  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
    scales: {
      x: { stacked: true },
      y: {
        stacked: false,
        ticks: {
          beginAtZero: true,
        },
      },
    },
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedCoupon]);

  return (
    <div>
      <Line data={chartData} height={400} options={options} />
    </div>
  );
}
