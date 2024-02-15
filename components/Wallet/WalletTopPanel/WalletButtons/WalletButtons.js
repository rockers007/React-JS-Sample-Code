import React from "react";
import i18n from "i18next";
import { Col } from "react-bootstrap";
import { preloadPaymentGatewaySettings } from "../../../../../../helpers/swrPreloadHelper";

const WalletButtons = ({ setShowWithdrawModal, setShowTopUpModal }) => {
	return (
		<Col md={6} xs={12} className="wallet-btn-group">
			<button
				className="btn btn-sm btn-primary"
				id="walletTopupBtn"
				type="button"
				onClick={() => {
					setShowTopUpModal(true);
					preloadPaymentGatewaySettings();
				}}
			>
				{i18n.t("wallet.topUp.title")}
			</button>
			<button
				className="btn btn-sm btn-primary mr-2 ml-2"
				id="walletWithdrawBtn"
				onClick={() => setShowWithdrawModal(true)}
				type="button"
			>
				{i18n.t("wallet.withdraw.title")}
			</button>
		</Col>
	);
};

export default WalletButtons;
