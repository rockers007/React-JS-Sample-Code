import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { Card } from "react-bootstrap";

import {isRTL} from "../../../../../../constants"

import "./CategoryDonutChart.scss";

const CategoryDonutChart = (props) => {
	const [labels, setLabels] = useState([]);
	const [series, setSeries] = useState([]);

	useEffect(() => {
		if (props?.categoryChartData) {
			setLabels([]);
	 		setSeries([]);
			for (const [key, value] of Object.entries(props?.categoryChartData )) {
				setLabels(label => [...label, key])
				setSeries(series => [...series, parseFloat(value)])
			}
		}
	}, [props?.categoryChartData]);

	return (
		<Card className="category-chart-card">
			<Card.Body className="category-chart-card-body">
				<Chart
					options={{
						//colors: [ "#66DA26", "#546E7A", "#E91E63", "#FF9800"],
						chart: {
							id: "categoryDonutChart",
						},
						responsive: [
							{
								breakpoint: 480,
								options: {
									chart: {
										width: "100%",
										height: 200 + (40 * labels?.length),
									},
									legend: {
										position: "bottom",
										width: 350,
									},
								},
							},
							{
								breakpoint: 900,
								options: {
									chart: {
										width: "100%",
										height: 200 + ( 15 * labels?.length),
									},
									legend: {
										position: "bottom",
										width: 400,
									},
								},
							}
						],
						labels,
						legend: {
							position: isRTL ?  "left" : "right", 
							fontSize: "15px",
							fontWeight: 400,
							width: 280,
							markers: {
								strokeWidth: 10,
								width: "30%",
								height: 12,
								radius: 12,
							},
						},
						dataLabels: {
							enabled: false
						},
						tooltip: {
							y: {
							  formatter: value => {
								return `${value} %`
							  }
							}
						}
					}}
					series={series}
					position="bottom"
					type="donut"
					width="100%"
				/>
			</Card.Body>
		</Card>
	);
};

export default CategoryDonutChart;
