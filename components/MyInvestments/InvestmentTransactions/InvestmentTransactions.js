/* eslint-disable react-hooks/exhaustive-deps */
import i18n from "i18next";
import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { preload } from "swr";
import useSWRInfinite from "swr/infinite";

import { MY_INVESTMENTS_API } from "../../../../../store/actions/apiCollections";
import {
  getCardDetailFetcher,
  getDocumentDetailFetcher,
  myInvestmentFetcher,
} from "../../../../../swrHelpers/swrMyInvestments";

import Heading from "../../Heading/Heading";
import TransactionCard from "./TransactionCard/TransactionCard";

function InvestmentTransactions({ currencyId }) {
  const [showInfo, setShowInfo] = useState([]);

  /**
   * @Author Rockers Technology
   * This hook is used to fetch transactions
   * It's related to My Investment module
   * @param $MY_INVESTMENTS_API - Unique api
   * @param $myInvestmentFetcher - swr fetcher helper
   *
   * @return array of investment transaction
   */
  const { data, size, setSize, isValidating } = useSWRInfinite(
    (index) =>
      `${MY_INVESTMENTS_API}?limit=${(index + 1) * 10}${
        currencyId ? "&currencyId=" + currencyId : ""
      }`,
    myInvestmentFetcher,
    {
      initialSize: 1,
      keepPreviousData: true,
      revalidateFirstPage: true,
      revalidateOnMount: true,
    }
  );

  useEffect(() => {
    setShowInfo([]);
  }, [data]);

  const investmentsData =
    data?.length > 0 ? data?.map((d) => d?.docs).slice(-1)[0] : [];
  const displayLoadMore = data?.slice(-1)[0]?.displayLoadMore;

  useEffect(() => {
    if (investmentsData?.length > 0) {
      investmentsData?.map((item) => {
        preload(
          `${MY_INVESTMENTS_API}${item.id}/get-document-detail`,
          getDocumentDetailFetcher
        );
        preload(
          `${MY_INVESTMENTS_API}${item.id}/get-investment-card-detail`,
          getCardDetailFetcher
        );
      });
    }
  }, [investmentsData?.length]);

  const handleShowInfo = (id) => {
    if (!showInfo.includes(id)) {
      setShowInfo((oldArray) => [...oldArray, id]);
    } else {
      setShowInfo(showInfo.filter((i) => i !== id));
    }
  };

  const myInvestmentsList =
    investmentsData?.length > 0 &&
    investmentsData?.map((investment, key) => (
      <TransactionCard
        investment={investment}
        key={key}
        keyIndex={key}
        handleShowInfo={handleShowInfo}
        showInfo={showInfo}
      />
    ));

  return (
    <>
      <Heading
        className="mb-3"
        alignCenter={false}
        title={i18n.t("myInvestment.title")}
      />
      {!isValidating && investmentsData?.length < 1 ? (
        <div className="in-dashboard-content">
          <div className="no-data no-data-img-equity">
            <p>{i18n.t("profile.noInvestment")}</p>
          </div>
        </div>
      ) : (
        myInvestmentsList
      )}
      {displayLoadMore ? (
        <div className="mt-5 text-center">
          <Button
            type="button"
            variant="primary"
            onClick={() => {
              setSize(size + 1);
            }}
            disabled={isValidating}
          >
            {isValidating ? (
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="sr-only">{i18n.t("common.loading")}</span>
              </div>
            ) : (
              i18n.t("global.loadMore")
            )}
          </Button>
        </div>
      ) : null}
    </>
  );
}

export default InvestmentTransactions;
