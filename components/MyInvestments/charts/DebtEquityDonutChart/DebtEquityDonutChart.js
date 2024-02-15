import i18n from "i18next";
import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { Card } from "react-bootstrap";

import "./DebtEquityDonutChart.scss";

const DebtEquityDonutChart = (props) => {
	const [labels, setLabels] = useState([]);
	const [series, setSeries] = useState([]);

	useEffect(() => {
		if (props?.slugChartData) {
			setLabels([]);
	 		setSeries([]);
			for (const [key, value] of Object.entries(props?.slugChartData )) {
				setLabels(labels => [...labels, i18n.t(`global.${key?.toLowerCase()}`)])
				setSeries(series => [...series, parseFloat(value)])
			}
		}
	}, [props?.slugChartData]);

	return (
		<Card className="debt-chart-card">
			<Card.Body className="debt-chart-card-body">
				<Chart
					options={{
						chart: {
							id: "debtEquityDonutChart",
						},
						responsive: [
							{
								breakpoint: 600,
								options: {
									chart: {
										width: "100%",
										height: 250,
									},
								},
							},
							{
								breakpoint: 480,
								options: {
									chart: {
										width: "100%",
									},
									legend: {
										position: "bottom",
									},
								},
							},
						],
						labels,
						legend: {
							fontSize: "20px",
							fontWeight: 400,
							position: "bottom",
							markers: {
								width: "30%",
								height: 12,
								radius: 12,
								strokeWidth: 1,
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
					width="110%"
				/>
			</Card.Body>
		</Card>
	);
};

export default DebtEquityDonutChart;
