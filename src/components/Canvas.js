import React, { useContext, useState, useEffect } from 'react'
import styled from 'styled-components';
import { Line, Bar, Bubble, Pie, Scatter } from "react-chartjs-2";
import { CouponContext } from "../App"


export default function Canvas() {
    const { selectedCoupon } = useContext(CouponContext)

    const chartData = (
        {
            labels: [selectedCoupon.dateValid],             //an array of x-axis items

            datasets: [
                {
                    label: "Your Cost",
                    fill: false,
                    lineTension: 0.5,
                    backgroundColor: 'rgba(75,192,192,1)',
                    borderColor: 'rgba(0,0,0,1)',
                    borderWidth: 2,
                    data: [selectedCoupon.itemYourCost ? parseFloat(selectedCoupon.itemYourCost.replace(/\$|,/g, '')) : 0]
                },
                {
                    label: "Discount",
                    fill: false,
                    lineTension: 0.5,
                    backgroundColor: "rgb(255, 69, 0)",
                    borderColor: 'rgba(0,0,0,1)',
                    borderWidth: 2,
                    data: [selectedCoupon.itemDiscountDollar ? parseInt(selectedCoupon.itemDiscountDollar) : (0)]
                }
            ]
        }
    )

    const options = {
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom"
            }
        },
        scales: {
            x: { stacked: true, },
            y:
            {
                stacked: true,
                ticks: {
                    beginAtZero: true,
                },
            },

        },
    }

    function handleChartDataChange() {

    }

    useEffect(() => {
        window.scrollTo(0, 0);

    }, [selectedCoupon])


    return (
        <div>
            <Line
                data={chartData}
                height={400}
                options={options}
            />
        </div>
    );

}
