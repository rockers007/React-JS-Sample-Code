import React from "react";
import i18n from "i18next";
import { Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";

import Spinner from "../../../Spinner/Spinner";

import { formatCurrency } from "../../../../../../helpers/numberFormat";

const WalletDetails = ({
	walletCurrencySymbol,
	walletCurrencyCode,
	walletDetails,
	isValidating
}) => {
	const { siteSettings } = useSelector(state => state.siteSettings);

	return (
		<Col md={6} xs={12}>
			<Row className="wallet-balance">
				<Col sm={5}>{i18n.t("wallet.walletBalance")}:</Col>
				<Col>
					{walletDetails ? (
						<b>
							{formatCurrency(
								walletDetails?.walletAmount ?? 0,
								siteSettings?.currencySymbolSide,
								walletCurrencySymbol,
								walletCurrencyCode,
								siteSettings?.decimalPoints
							)}
						</b>
					) : isValidating && !walletDetails ? (
						<Spinner width={"1rem"} height={"1rem"} opacity={"0.5"} />
					) : null}
				</Col>
			</Row>
			<Row className="wallet-id mt-2">
				<Col sm={5}>{i18n.t("wallet.walletID")}:</Col>
				<Col>
					<b>{walletDetails?.walletId}</b>
				</Col>
			</Row>
		</Col>
	);
};

export default WalletDetails;
