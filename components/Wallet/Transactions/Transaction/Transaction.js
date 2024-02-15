import React from "react";
import i18n from "i18next";
import { Badge, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { isRTL } from "../../../../../../constants";
import { getWalletStatusCodes } from "../../../../../../helpers/helpers";
import { formatCurrency } from "../../../../../../helpers/numberFormat";

const Transaction = ({ transaction }) => {
	const { siteSettings } = useSelector(state => state.siteSettings);

	return (
		<tr>
			<td>{moment(transaction?.createdAt).format(siteSettings.dateFormat)}</td>
			<td>
				{transaction?.gatewayId?.title === "Offline"
					? transaction?.description ?? i18n.t("wallet.topUp.transactionDesc")
					: transaction?.description
					? i18n.t(`wallet.${transaction?.description}`)
					: i18n.t("wallet.topUp.transactionDesc")}
			</td>
			<td>{transaction?.transactionNumber}</td>
			<td>
				{transaction?.campaignId?.companyId
					? i18n.t("wallet.title")
					: transaction?.gatewayId?.title ?? "-"}
			</td>
			<td>
				{transaction?.campaignId?.companyId?.companyName ? (
					<Link
						to={`/campaign-detail-page/${transaction?.campaignId?.companyId?.companySlug}`}
						target="_blank"
					>
						{transaction?.campaignId?.companyId?.companyName}
					</Link>
				) : (
					"-"
				)}
			</td>
			<td>{i18n.t(`wallet.entryType.${transaction?.walletType}`)}</td>
			<td className="wallet-data-amount">
				{formatCurrency(
					transaction?.amount ?? "0",
					siteSettings.currencySymbolSide,
					transaction?.currencyId?.symbol,
					transaction?.currencyId?.code,
					siteSettings?.decimalPoints
				)}{" "}
				<OverlayTrigger
					placement={isRTL ? "right" : "left"}
					overlay={
						transaction?.feesDetails ? (
							<Tooltip className="wallet-data-popover">
								<Row className="d-flex">
									{i18n.t("wallet.receipt.feesPercentage")}:
									<span className={isRTL ? "mr-auto" : "ml-auto"}>
										{transaction?.feesDetails?.feesPercentage ?? 0} %
									</span>
								</Row>
								<Row className="d-flex">
									{i18n.t("wallet.receipt.flatFees")}:
									<span className={isRTL ? "mr-auto" : "ml-auto"}>
										{formatCurrency(
											transaction?.feesDetails?.flatFees ?? 0,
											siteSettings.currencySymbolSide,
											transaction?.currencyId?.symbol,
											transaction?.currencyId?.code,
											siteSettings?.decimalPoints
										)}
									</span>
								</Row>
								<Row className="d-flex">
									{i18n.t("wallet.receipt.transactionFees")}:
									<span className={isRTL ? "mr-auto" : "ml-auto"}>
										{formatCurrency(
											transaction?.feesDetails?.transactionFees ?? "0",
											siteSettings.currencySymbolSide,
											transaction?.currencyId?.symbol,
											transaction?.currencyId?.code,
											siteSettings?.decimalPoints
										)}
									</span>
								</Row>
							</Tooltip>
						) : null
					}
				>
					<FontAwesomeIcon icon={["fas", "info-circle"]} />
				</OverlayTrigger>
			</td>
			<td>
				<Badge
					variant={
						transaction?.status === 0
							? `secondary`
							: transaction?.status === 1
							? `warning`
							: transaction?.status === 2
							? `success`
							: `danger`
					}
					className="p-1"
				>
					{getWalletStatusCodes(transaction?.status)}
				</Badge>
			</td>
		</tr>
	);
};

export default Transaction;
