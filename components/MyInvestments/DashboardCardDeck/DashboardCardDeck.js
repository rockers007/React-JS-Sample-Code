import React, { useEffect } from "react";
import useSWR from "swr";
import { CardDeck } from "react-bootstrap";
import { useSelector } from "react-redux";

import DashboardCard from "./DashboardCard/DashboardCard";

import { MY_INVESTMENTS_DASHBOARD_API } from "../../../../../store/actions/apiCollections";
import { getMyInvestmentsGraphFetcher } from "../../../../../swrHelpers/swrMyInvestments";

const DashboardCardDeck = ({ currencyId }) => {
  /**
   * @Author Rockers Technology
   * This hook is used to fetch invesment dashboard card details
   * It's related to My Investment module
   * @param $MY_INVESTMENTS_DASHBOARD_API - Unique api
   * @param $getMyInvestmentsGraphFetcher - swr fetcher helper
   *
   * @return object invesment dashboard card details
   */
  const { data: graphData } = useSWR(
    `${MY_INVESTMENTS_DASHBOARD_API}${
      currencyId ? "?currencyId=" + currencyId : ""
    }`,
    getMyInvestmentsGraphFetcher,
    {
      keepPreviousData: true,
      revalidateOnMount: true,
    }
  );

  return (
    <CardDeck className="mb-30">
      <DashboardCard
        icon={"money-bill"}
        data={graphData?.totalInvestmentCount}
        label="myInvestment.numberOfInvestment"
      />
      <DashboardCard
        currencySymbol={graphData?.currencyData?.symbol}
        currencyCode={graphData?.currencyData?.code}
        icon={"suitcase"}
        data={
          isNaN(graphData?.averageInvestment)
            ? 0
            : Number(graphData?.averageInvestment ?? 0)
        }
        label="myInvestment.averageInvestment"
      />
      <DashboardCard
        currencySymbol={graphData?.currencyData?.symbol}
        currencyCode={graphData?.currencyData?.code}
        icon={"chart-bar"}
        data={graphData?.totalCurrentDistribution}
        label="myInvestment.currentDistributions"
      />
      <DashboardCard
        currencySymbol={graphData?.currencyData?.symbol}
        currencyCode={graphData?.currencyData?.code}
        icon={"coins"}
        data={graphData?.totalPreviousDistribution}
        label="myInvestment.previousDistribution"
      />
    </CardDeck>
  );
};

export default DashboardCardDeck;
