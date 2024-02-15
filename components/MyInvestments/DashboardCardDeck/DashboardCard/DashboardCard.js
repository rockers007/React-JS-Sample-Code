import React from "react";
import i18n from "i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card } from "react-bootstrap";
import { useSelector } from "react-redux";

import { formatCurrency } from "../../../../../../helpers/numberFormat";

const DashboardCard = ({ data, icon, label, currencySymbol, currencyCode }) => {
	const { siteSettings } = useSelector(state => state.siteSettings);
	return (
		<Card className="text-center my-investment-shadow my-investment-hover">
			<Card.Body className="myinvestment-card-body">
				<FontAwesomeIcon
					className="myinvestment-card-icon"
					icon={["fas", icon]}
					size="4x"
				/>
				<Card.Title>
					{formatCurrency(
						data ?? 0,
						siteSettings.currencySymbolSide,
						currencySymbol,
						currencyCode,
						siteSettings.decimalPoints
					)}
				</Card.Title>
				<Card.Text>{i18n.t(label)}</Card.Text>
			</Card.Body>
		</Card>
	);
};

export default DashboardCard;
