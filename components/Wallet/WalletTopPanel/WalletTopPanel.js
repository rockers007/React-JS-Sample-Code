import React, { useEffect, useState } from "react";
import { Row } from "react-bootstrap";
import { useSelector } from "react-redux";

import WalletDetails from "./WalletDetails/WalletDetails";
import WalletButtons from "./WalletButtons/WalletButtons";
import WithdrawModal from "./WalletButtons/WithdrawModal/WithdrawModal";
import TopupModal from "./WalletButtons/TopupModal/TopupModal";

import { useWalletDetailsFetcher } from "../../../../../swrHelpers/swrWallet";

const WalletTopPanel = ({
  walletCurrencyId,
  walletCurrencySymbol,
  walletCurrencyCode,
  history,
}) => {
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const { refreshWalletTransactions } = useSelector((state) => state.wallet);

  const { walletDetails, isValidating, mutate } =
    useWalletDetailsFetcher(walletCurrencyId);

  useEffect(() => {
    if (refreshWalletTransactions) {
      mutate();
    }
  }, [refreshWalletTransactions]);

  return (
    <Row>
      <WalletDetails
        walletDetails={walletDetails}
        isValidating={isValidating}
        walletCurrencySymbol={walletCurrencySymbol}
        walletCurrencyCode={walletCurrencyCode}
      />
      <WalletButtons
        setShowTopUpModal={setShowTopUpModal}
        setShowWithdrawModal={setShowWithdrawModal}
      />
      {showTopUpModal && (
        <TopupModal
          showTopUpModal={showTopUpModal}
          setShowTopUpModal={setShowTopUpModal}
          walletCurrencySymbol={walletCurrencySymbol}
          walletCurrencyId={walletCurrencyId}
          walletCurrencyCode={walletCurrencyCode}
          history={history}
        />
      )}
      {showWithdrawModal && (
        <WithdrawModal
          walletDetails={walletDetails}
          showWithdrawModal={showWithdrawModal}
          setShowWithdrawModal={setShowWithdrawModal}
          walletCurrencySymbol={walletCurrencySymbol}
          walletCurrencyId={walletCurrencyId}
          walletCurrencyCode={walletCurrencyCode}
        />
      )}
    </Row>
  );
};

export default WalletTopPanel;
