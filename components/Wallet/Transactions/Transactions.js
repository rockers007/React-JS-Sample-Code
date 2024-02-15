import React, { useEffect } from "react";
import i18n from "i18next";
import useSWRInfinite from "swr/infinite";
import { Button, Row, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import Transaction from "./Transaction/Transaction";
import Spinner from "../../Spinner/Spinner";

import { walletTransactionFetcher } from "../../../../../swrHelpers/swrWallet";
import { GET_WALLET_TRANSACTIONS_LIST_API } from "../../../../../store/actions/apiCollections";
import { setWalletAmountWithdraw } from "../../../../../store/actions/wallet/walletActions";

const Transactions = ({ walletCurrencyId }) => {
  const dispatch = useDispatch();
  const { refreshWalletTransactions } = useSelector((state) => state.wallet);
  /**
   * @Author Rockers Technology
   * This hook is used to fetch user's wallet Transaction
   * It's related to wallet module
   * @param $GET_WALLET_TRANSACTIONS_LIST_API - Unique api
   * @param $walletTransactionFetcher - swr fetcher helper
   *
   * @return array of transaction
   */
  const { data, size, setSize, isValidating, mutate } = useSWRInfinite(
    (index) =>
      walletCurrencyId
        ? `${GET_WALLET_TRANSACTIONS_LIST_API}?limit=${
            (index + 1) * 10
          }&currencyId=${walletCurrencyId}`
        : "",
    walletTransactionFetcher,
    {
      initialSize: 1,
      revalidateFirstPage: true,
      revalidateOnFocus: false,
    }
  );

  useEffect(() => {
    if (refreshWalletTransactions) {
      mutate();
      dispatch(setWalletAmountWithdraw(false));
    }
  }, [refreshWalletTransactions]);

  const walletTransactions =
    data?.length > 0 ? data?.map((d) => d?.docs).slice(-1)[0] : [];
  const displayLoadMore = data?.slice(-1)[0]?.displayLoadMore;

  const walletTransactionList =
    walletTransactions?.length > 0 ? (
      walletTransactions?.map((transaction, key) => (
        <Transaction key={key} transaction={transaction} />
      ))
    ) : isValidating && size === 1 && !data ? (
      <tr>
        <td colSpan="7">
          <Spinner
            position={"center"}
            width={"2rem"}
            height={"2rem"}
            opacity={"0.5"}
          />
        </td>
      </tr>
    ) : (
      <tr className="in-dashboard-content">
        <td colSpan="7">
          <div className="no-data no-data-img-equity">
            <p>{i18n.t("wallet.noTransaction")}</p>
          </div>
        </td>
      </tr>
    );
  const loadMore = () => {
    setSize(size + 1);
  };

  return (
    <Row>
      <Table responsive className="text-center">
        <thead>
          <tr>
            <th>{i18n.t("wallet.tableHeader.date")}</th>
            <th>{i18n.t("wallet.tableHeader.details")}</th>
            <th>{i18n.t("wallet.tableHeader.transactionId")}</th>
            <th>{i18n.t("wallet.tableHeader.paymentGateway")}</th>
            <th>{i18n.t("wallet.tableHeader.campaign")}</th>
            <th>{i18n.t("wallet.tableHeader.type")}</th>
            <th>{i18n.t("wallet.tableHeader.amount")}</th>
            <th>{i18n.t("wallet.tableHeader.status")}</th>
          </tr>
        </thead>
        <tbody>{walletTransactionList}</tbody>
      </Table>
      {displayLoadMore ? (
        <div className="mt-5 load-more-btn">
          <Button type="button" variant="primary" onClick={() => loadMore()}>
            {isValidating && size !== 1 ? (
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="sr-only">{i18n.t("common.loading")}</span>
              </div>
            ) : (
              i18n.t("global.loadMore")
            )}
          </Button>
        </div>
      ) : null}
    </Row>
  );
};

export default Transactions;
