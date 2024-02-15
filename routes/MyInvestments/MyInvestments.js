/* eslint-disable react-hooks/exhaustive-deps */
import i18n from "i18next";
import React, { useContext, useEffect, Suspense } from "react";
import Select from "react-select";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import { isEmpty } from "lodash";
import useSWR from "swr";

import CategoryDonutChart from "../../components/MyInvestments/charts/CategoryDonutChart/CategoryDonutChart";
import DebtEquityDonutChart from "../../components/MyInvestments/charts/DebtEquityDonutChart/DebtEquityDonutChart";
import PortfolioColumnChart from "../../components/MyInvestments/charts/PortfolioColumnChart/PortfolioColumnChart";
import DashboardCardDeck from "../../components/MyInvestments/DashboardCardDeck/DashboardCardDeck";
import InvestmentTransactions from "../../components/MyInvestments/InvestmentTransactions/InvestmentTransactions";
import Loading from "../../components/Loading/Loading";

import {
  MY_INVESTMENTS_GRAPH_API,
  USER_INVESTMENT_UNIQUE_CURRENCIES_API,
} from "../../../../store/actions/apiCollections";
import {
  getInvestmentsChartFetcher,
  getInvestmentUniqueCurrenciesFetcher,
} from "../../../../swrHelpers/swrMyInvestments";
import { eraseCookie } from "../../../../helpers/cookieHelper";

import { setInvestmentSelectedCurrency } from "../../../../store/actions/investments/investmentsActions";
import { AuthContext } from "../AuthContext/Context";
import "./MyInvestments.scss";

function MyInvestments() {
  const auth = useContext(AuthContext);
  const dispatch = useDispatch();
  const { investmentSelectedCurrency } = useSelector(
    (state) => state.myInvestments
  );
  const { siteSettings } = useSelector((state) => state.siteSettings);

  useEffect(() => {
    eraseCookie("investorId");
    eraseCookie("amount");
    eraseCookie("gatewayId");
    eraseCookie("purchasedShares");
    localStorage.removeItem("investorId");
    localStorage.removeItem("sessionId");
  }, []);

  /**
   * @Author Rockers Technology
   * This hook is used to fetch chart data
   * It's related to My Investment module
   * @param $MY_INVESTMENTS_GRAPH_API - Unique api
   * @param $getInvestmentsChartFetcher - swr fetcher helper
   *
   * @return chart data
   */
  const { data: investmentsChartData } = useSWR(
    `${MY_INVESTMENTS_GRAPH_API}${
      investmentSelectedCurrency
        ? "?currencyId=" + investmentSelectedCurrency?.id
        : ""
    }`,
    getInvestmentsChartFetcher,
    {
      keepPreviousData: true,
      dedupingInterval: 2000,
      revalidateOnMount: true,
    }
  );

  /**
   * @Author Rockers Technology
   * This hook is used to fetch list of currency user has invested in
   * It's related to My Investment module
   * @param $USER_INVESTMENT_UNIQUE_CURRENCIES_API - Unique api
   * @param $getInvestmentUniqueCurrenciesFetcher - swr fetcher helper
   *
   * @return array list of currency user has invested in
   */
  const { data: investmentCurrency } = useSWR(
    `${USER_INVESTMENT_UNIQUE_CURRENCIES_API}`,
    getInvestmentUniqueCurrenciesFetcher,
    {
      keepPreviousData: true,
      dedupingInterval: 2000,
      revalidateOnMount: true,
    }
  );

  const userCurrencyList = investmentCurrency?.currunciesData?.map(
    ({ code: label, id: value }) => ({
      label,
      value,
    })
  );

  if (auth === null) {
    return (
      <Redirect
        to={{
          pathname: "/login",
          state: i18n.t("authentication.redirectSignIn"),
        }}
      />
    );
  }

  return (
    <Suspense fallback={<Loading />}>
      <div className="section">
        <Container>
          <Row className="mb-30 currency">
            {investmentCurrency?.len > 1 ? (
              <Col className="d-flex align-items-center justify-content-end mb-4">
                <span className="currency-lable">
                  <strong>{i18n.t("myInvestment.selectCurrency")}</strong>
                </span>
                <Select
                  classNamePrefix="react-select"
                  className={"react-select-container c-selector-w"}
                  options={userCurrencyList}
                  value={
                    investmentSelectedCurrency?.code
                      ? userCurrencyList.filter(
                          (option) =>
                            option.label === investmentSelectedCurrency?.code
                        )
                      : userCurrencyList.filter(
                          (option) =>
                            option.label === siteSettings?.currencyId?.code
                        )
                  }
                  onChange={(option) => {
                    dispatch(
                      setInvestmentSelectedCurrency(
                        investmentCurrency?.currunciesData?.find(
                          (c) => c.code === option.label
                        )
                      )
                    );
                  }}
                />
              </Col>
            ) : null}

            <Col md="12">
              <Row className="investment-chart-section">
                <Col md="12">
                  <PortfolioColumnChart
                    currencyId={investmentSelectedCurrency?.id}
                  />
                </Col>
              </Row>
              {!isEmpty(investmentsChartData?.categoryChartData) ||
              !isEmpty(investmentsChartData?.slugChartData) ? (
                <Row className="investment-chart-section">
                  {!isEmpty(investmentsChartData?.categoryChartData) ? (
                    <Col md={7} className="investment-category-chart">
                      <CategoryDonutChart
                        categoryChartData={
                          investmentsChartData?.categoryChartData
                        }
                      />
                    </Col>
                  ) : null}
                  {!isEmpty(investmentsChartData?.slugChartData) ? (
                    <Col md={5}>
                      <DebtEquityDonutChart
                        slugChartData={investmentsChartData?.slugChartData}
                      />
                    </Col>
                  ) : null}
                </Row>
              ) : null}
              <Row>
                <Col md="12">
                  <DashboardCardDeck
                    currencyId={investmentSelectedCurrency?.id}
                  />
                </Col>
              </Row>

              <InvestmentTransactions
                currencyId={investmentSelectedCurrency?.id}
              />
            </Col>
          </Row>
        </Container>
      </div>
    </Suspense>
  );
}

export default MyInvestments;
