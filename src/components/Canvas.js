import React, { useContext, useState, useEffect } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  TimeScale,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import ChartDataLabels from "chartjs-plugin-datalabels";
import * as queries from "../graphql/queries";
import { CouponContext } from "../App";
import { API } from "aws-amplify";
import { addStartDate, sortDateAscending } from "../models/utils";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  TimeScale,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  ChartDataLabels
);

export default function Canvas() {
  const [selectedCouponData, setSelectedCouponData] = useState([]);
  const { selectedCoupon } = useContext(CouponContext);

  useEffect(() => {
    console.log("running canvas useEffect");
    async function fetchData() {
      try {
        if (!selectedCoupon?.itemNumber)
          return alert("This item does not have an item number for lookup");
        var selectedCouponData = await API.graphql({
          query: queries.couponsByItemNumber,
          variables: { itemNumber: selectedCoupon.itemNumber },
        });
        setSelectedCouponData(
          selectedCouponData.data.couponsByItemNumber.items
        );
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, [selectedCoupon]);

  const augmentedData =
    selectedCouponData.map(addStartDate).sort(sortDateAscending) || new Date();

  const chartData = {
    labels: augmentedData.map((coupon) => coupon.startDate),

    datasets: [
      {
        label: "Your Cost",
        hidden: true,
        fill: false,
        lineTension: 0,
        backgroundColor: "rgba(75,192,192,1)",
        borderColor: "rgba(0,0,0,1)",
        borderWidth: 2,
        data: augmentedData.map((coupon) =>
          coupon.itemYourCost
            ? parseFloat(coupon.itemYourCost.replace(/\$|,/g, ""))
            : 0
        ),
        datalabels: {
          color: "#000000",
          align: "bottom",
          offset: "5",
          display: "auto",

          backgroundColor: "rgba(255,255,255,0.5)",
        },
      },
      {
        label: "Discount",
        fill: false,
        lineTension: 0,
        backgroundColor: "rgb(255, 69, 0)",
        borderColor: "rgba(0,0,0,1)",
        borderWidth: 2,
        data: augmentedData.map((coupon) =>
          coupon.itemDiscountDollar
            ? parseFloat(coupon.itemDiscountDollar.replace(/\$|,/g, ""))
            : null
        ),
        datalabels: {
          color: "#000000",
          align: "bottom",
          offset: "5",
          display: "auto",

          backgroundColor: "rgba(255,255,255,0.5)",
        },
      },
    ],
  };
  console.log({ chartData });
  const today = new Date();
  const options = {
    layout: {
      padding: { right: 5 },
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "month",
          timezone: "UTC",
        },
        stacked: false,
        ticks: {
          display: true,
        },
        suggestedMin: new Date("2021-01-01"),
        suggestedMax: today.setMonth(today.getMonth() + 1),
      },
      y: {
        title: { display: true, text: "Dollar Amount" },
        stacked: false,
        grace: "2%",
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
        suggestedMin: 0,
      },
    },
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedCoupon]);
  if (!selectedCouponData)
    return (
      <div
        style={{
          color: "red",
          display: "flex",
          justifyContent: "center",
          margin: "1rem",
        }}
      >
        No Item Number for Lookup
      </div>
    );

  console.log(selectedCouponData);
  return (
    <div>
      <Line data={chartData} height={300} options={options} />
    </div>
  );
}
