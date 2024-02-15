/* eslint-disable react-hooks/exhaustive-deps */
import i18n from "i18next";
import React, { useContext, useLayoutEffect, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import Select from "react-select";

import { AuthContext } from "../AuthContext/Context";
import Heading from "../../components/Heading/Heading";
import Transactions from "../../components/Wallet/Transactions/Transactions";
import WalletTopPanel from "../../components/Wallet/WalletTopPanel/WalletTopPanel";

import { setWalletSelectedCurrency } from "../../../../store/actions/wallet/walletActions";
import { setSelectedCampaignId } from "../../../../store/actions";
import { getCurrency } from "../../../../store/actions/siteSettings";
import { resetPaymentData } from "../../../../store/actions/payment/paymentActions";

import "./Wallet.scss";

function Wallet({ history }) {
	const auth = useContext(AuthContext);
	const dispatch = useDispatch();

	const [currency, setCurrency] = useState([]);
	const [walletCurrencyId, setWalletCurrencyId] = useState();
	const [walletCurrencyCode, setWalletCurrencyCode] = useState();
	const [walletCurrencySymbol, setWalletCurrencySymbol] = useState();

	const { siteSettings, currencies } = useSelector(state => state.siteSettings);

	const { topupSelectedCampaignId, walletSelectedCurrency } = useSelector(
		state => state.wallet
	);

	useEffect(() => {
		dispatch(resetPaymentData("preapprovalDetails", null));
		dispatch(getCurrency());
		setWalletCurrencyCode(siteSettings?.currencyId?.code);
		setWalletCurrencySymbol(siteSettings?.currencyId?.symbol);
		setWalletCurrencyId(siteSettings?.currencyId?.id);
	}, [dispatch]);

	useEffect(() => {
		const currencyList = currencies?.map(({ code: label, code: value }) => ({
			label,
			value
		}));
		setCurrency(currencyList);
	}, [currencies]);

	useEffect(() => {
		if (walletSelectedCurrency) {
			setWalletCurrencyCode(walletSelectedCurrency?.code);
			setWalletCurrencySymbol(walletSelectedCurrency?.symbol);
			setWalletCurrencyId(walletSelectedCurrency?.id);
		}
	}, [walletSelectedCurrency]);

	useEffect(() => {
		return () => {
			if (topupSelectedCampaignId) {
				dispatch(setSelectedCampaignId(null));
			}
		};
	}, []);

	useLayoutEffect(() => {
		if (siteSettings?.walletModule === "no") {
			history.push(`/`);
		}
	}, [siteSettings?.walletModule]);

	if (auth === null) {
		return (
			<Redirect
				to={{
					pathname: "/login",
					state: i18n.t("authentication.redirectSignIn")
				}}
			/>
		);
	}

	return (
		<div className="section">
			<Container>
				<Row>
					{topupSelectedCampaignId ? (
						<Link
							id="walletInvestmentLink"
							className="btn btn-outline-primary btn-sm mb-5"
							to={`/invest/${topupSelectedCampaignId}`}
						>
							{i18n.t("wallet.receipt.invest")}
						</Link>
					) : null}
				</Row>
				<Row>
					<Col md={10} xs={8}>
						<Heading alignCenter={false} title={i18n.t("wallet.header")} />
					</Col>
					<Col md={2} xs={4}>
						<Select
							inputId="walletCurrency"
							classNamePrefix="react-select"
							className="react-select-container curreny-select"
							options={currency}
							value={
								currency.find(c => c.label === walletCurrencyCode) ||
								currency[0]
							}
							onChange={val => {
								dispatch(
									setWalletSelectedCurrency(
										currencies?.find(c => c.code === val.value)
									)
								);
							}}
						/>
					</Col>
				</Row>

				<WalletTopPanel
					walletCurrencyId={walletCurrencyId}
					walletCurrencySymbol={walletCurrencySymbol}
					walletCurrencyCode={walletCurrencyCode}
					history={history}
				/>
				<Transactions walletCurrencyId={walletCurrencyId} />
			</Container>
		</div>
	);
}

export default Wallet;
