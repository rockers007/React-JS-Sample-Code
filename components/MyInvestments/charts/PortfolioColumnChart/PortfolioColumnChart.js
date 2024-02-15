/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { Card, Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import Select from "react-select";
import i18n from "i18next";
import useSWR from "swr";

import { MY_INVESTMENTS_COLUMN_CHART_API } from "../../../../../../store/actions/apiCollections";
import { getInvestmentsColumnChartFetcher } from "../../../../../../swrHelpers/swrMyInvestments";
import { formatCurrency } from "../../../../../../helpers/numberFormat";

import "./PortfolioColumnChart.scss";

const PortfolioColumnChart = ({ currencyId }) => {
  const thisYear = new Date().getFullYear();
  const [labels, setLabels] = useState([
    i18n.t("global.debt"),
    i18n.t("global.equity"),
  ]);
  const [selectedYear, setSelectedYear] = useState(0);
  const [series, setSeries] = useState([
    {
      name: i18n.t("global.equity"),
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    {
      name: i18n.t("global.debt"),
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
  ]);
  const [yearList, setYear] = useState([
    { label: i18n.t("myInvestment.porfolioChart.thisYear"), value: 0 },
  ]);
  const { siteSettings } = useSelector((state) => state.siteSettings);
  const { currentUser } = useSelector((state) => state.getCurrentUser);

  /**
   * @Author Rockers Technology
   * This hook is used to fetch column chart data
   * It's related to My Investment module
   * @param $MY_INVESTMENTS_COLUMN_CHART_API - Unique api
   * @param $getInvestmentsColumnChartFetcher - swr fetcher helper
   *
   * @return column chart data
   */
  const { data: investmentsColumnChartData } = useSWR(
    `${MY_INVESTMENTS_COLUMN_CHART_API}?transactionYear=${selectedYear}${
      currencyId ? `&currencyId=${currencyId}` : ""
    }`,
    getInvestmentsColumnChartFetcher,
    {
      keepPreviousData: true,
      revalidateOnMount: true,
      suspense: true,
    }
  );

  useEffect(() => {
    if (investmentsColumnChartData) {
      setSeries([
        {
          name: i18n.t("global.equity"),
          data: investmentsColumnChartData?.Equity,
        },
        {
          name: i18n.t("global.debt"),
          data: investmentsColumnChartData?.Debt,
        },
      ]);
    }
  }, [investmentsColumnChartData]);

  useEffect(() => {
    if (currentUser?.createdAt) {
      for (
        let i = thisYear - 1;
        i >= new Date(currentUser?.createdAt).getFullYear();
        i--
      ) {
        yearList.push({ label: `${i}`, value: thisYear - i });
      }
    }
  }, [currentUser?.createdAt]);

  return (
    <Card className="chart-card">
      <Card.Body className="chart-card-body">
        <Row>
          <Col md={9}>
            <h3>{i18n.t("myInvestment.porfolioChart.title")}</h3>
          </Col>
          <Col md={3} className="pull-right">
            <Select
              defaultValue={yearList?.[0]}
              options={yearList}
              inputId="portfolioChartYear"
              classNamePrefix="react-select"
              className="react-select-container chart-card-year mr-2 ml-2"
              onChange={(val) => {
                setSelectedYear(val.value);
              }}
            />
          </Col>
        </Row>
        <Row className="mt-4 mb-3">
          <Col md={6}>
            <Card className="chart-card-investment">
              <Card.Body>
                <Card.Title>
                  {investmentsColumnChartData == null
                    ? ""
                    : formatCurrency(
                        investmentsColumnChartData?.totalInvestments ?? 0,
                        siteSettings.currencySymbolSide,
                        investmentsColumnChartData?.currencyData?.symbol,
                        investmentsColumnChartData?.currencyData?.code,
                        siteSettings.decimalPoints
                      )}
                </Card.Title>
                <Card.Text className="chart-card-brief text-secondary">
                  {i18n.t("myInvestment.porfolioChart.totalInvestment")}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="chart-card-repayment">
              <Card.Body>
                <Card.Title className="">
                  {investmentsColumnChartData == null
                    ? ""
                    : formatCurrency(
                        investmentsColumnChartData?.totalRepayment ?? 0,
                        siteSettings.currencySymbolSide,
                        investmentsColumnChartData?.currencyData?.symbol,
                        investmentsColumnChartData?.currencyData?.code,
                        siteSettings.decimalPoints
                      )}
                </Card.Title>
                <Card.Text className="chart-card-brief text-secondary">
                  {i18n.t("myInvestment.porfolioChart.totalRepayment")}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Chart
              options={{
                chart: {
                  id: "portfolioColumnChart",
                  toolbar: {
                    show: false,
                  },
                },
                labels,
                legend: {
                  fontSize: "20px",
                  fontWeight: 400,
                  position: "top",
                  horizontalAlign: "right",
                  markers: {
                    width: "30%",
                    height: 12,
                    radius: 12,
                    strokeWidth: 1,
                  },
                },
                dataLabels: {
                  enabled: false,
                },
                xaxis: {
                  categories: [
                    i18n.t("global.months.jan"),
                    i18n.t("global.months.feb"),
                    i18n.t("global.months.mar"),
                    i18n.t("global.months.apr"),
                    i18n.t("global.months.may"),
                    i18n.t("global.months.jun"),
                    i18n.t("global.months.jul"),
                    i18n.t("global.months.aug"),
                    i18n.t("global.months.sep"),
                    i18n.t("global.months.oct"),
                    i18n.t("global.months.nov"),
                    i18n.t("global.months.dec"),
                  ],
                },
                yaxis: {
                  lines: {
                    show: false,
                  },
                },
                grid: {
                  yaxis: {
                    lines: {
                      show: false,
                    },
                  },
                },
                tooltip: {
                  y: {
                    formatter: (value) => {
                      return formatCurrency(
                        value,
                        siteSettings.currencySymbolSide,
                        investmentsColumnChartData?.currencyData?.symbol,
                        investmentsColumnChartData?.currencyData?.code,
                        siteSettings.decimalPoints
                      );
                    },
                  },
                },
                plotOptions: {
                  bar: {
                    borderRadius: 10,
                  },
                },
              }}
              series={series}
              type="bar"
              width="100%"
              height={400}
            />
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default PortfolioColumnChart;
