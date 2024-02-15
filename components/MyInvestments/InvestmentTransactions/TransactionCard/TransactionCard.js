import React, { useState } from "react";
import i18n from "i18next";
import { Badge, Card, Col, Collapse, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import moment from "moment";
import useSWR from "swr";

import DocumentsModal from "../DocumentsModal/DocumentsModal";
import Spinner from "../../../../components/Spinner/Spinner";

import { MY_INVESTMENTS_API } from "../../../../../../store/actions/apiCollections";
import { formatCurrency } from "../../../../../../helpers/numberFormat";
import { getCardDetailFetcher } from "../../../../../../swrHelpers/swrMyInvestments";

const TransactionCard = ({
  investment,
  keyIndex,
  handleShowInfo,
  showInfo,
}) => {
  const [show, setShow] = useState(false);
  const [id, setId] = useState(false);
  const { siteSettings } = useSelector((state) => state.siteSettings);

  /**
   * @Author Rockers Technology
   * This hook is used to fetch individual transaction card details
   * It's related to My Investment module
   * @param $MY_INVESTMENTS_API - Unique api
   * @param $getCardDetailFetcher - swr fetcher helper
   *
   * @return individual transaction card details
   */
  const { data: investmentDetail } = useSWR(
    id ? `${MY_INVESTMENTS_API}${id}/get-investment-card-detail` : "",
    getCardDetailFetcher,
    {
      keepPreviousData: true,
      dedupingInterval: 120000,
    }
  );

  const handleClose = () => {
    setShow(false);
  };

  const handleShow = (id) => {
    setShow(true);
  };

  return (
    <Card className="investment-list-item">
      <div className="investment-list-item-content">
        <Row className="align-items-center">
          <Col md={8} xs={8}>
            <span className="investment-list-item-header">
              {investment?.companyName}
            </span>
            <Badge
              variant={
                investment?.preapprovalStatus === "SUCCESS"
                  ? `success`
                  : investment?.preapprovalStatus === "FAIL"
                  ? `danger`
                  : `warning`
              }
            >
              {i18n
                .t(`global.${investment?.preapprovalStatus?.toLowerCase()}`)
                .toUpperCase()}
            </Badge>
            <span className="investment-list-item-type">
              {investment?.termsSlug === "debt"
                ? i18n.t("global.debt")
                : i18n.t("global.equity")}
            </span>
          </Col>
          <Col md={4} xs={4} className="mt-1 investment-list-item-icon-wraper">
            <button
              className="investment-list-item-icon"
              onClick={() => {
                handleShowInfo(keyIndex);
                setId(investment?.id);
              }}
            >
              <FontAwesomeIcon icon={["fas", "info"]} className="fa-fw" />
            </button>
            <Link
              to={`/payment-receipt/${investment?.id}`}
              target="_blank"
              className="investment-list-item-icon"
            >
              <FontAwesomeIcon icon={["fas", "eye"]} className="fa-fw" />
            </Link>
            <Link
              className="investment-list-item-icon"
              to={"#"}
              onClick={() => handleShow(investment?.id)}
            >
              <FontAwesomeIcon icon={["fas", "file"]} className="fa-fw" />
            </Link>
          </Col>
        </Row>
        <Collapse in={showInfo.includes(keyIndex)}>
          {investmentDetail ? (
            <div className="investment-list-item-body">
              <Row>
                <Col className="mt-md-5 mt-3" md={3} sm={6}>
                  <p>{i18n.t("myInvestment.investedAmount")}</p>
                  <strong>
                    {formatCurrency(
                      investmentDetail?.amount ?? "0",
                      siteSettings.currencySymbolSide,
                      investmentDetail?.campaignId?.equityCurrencySymbol,
                      investmentDetail?.campaignId?.equityCurrencyCode,
                      siteSettings.decimalPoints
                    )}
                  </strong>
                </Col>
                <Col className="mt-md-5 mt-3" md={3} sm={6}>
                  <p>{i18n.t("myInvestment.investedDate")}</p>
                  <strong>
                    {investmentDetail?.createdAt
                      ? moment(investmentDetail.createdAt).format(
                          siteSettings.dateFormat
                        )
                      : "-"}
                  </strong>
                </Col>
                {investmentDetail?.campaignId?.termsSlug === "equity" ? (
                  <Col className="mt-md-5 mt-3" md={3} sm={6}>
                    <p>{i18n.t("myInvestment.purchasedShares")}</p>
                    <strong>
                      {investmentDetail?.purchasedShares ?? "-"}
                      {investmentDetail?.campaignId?.pricePerShare
                        ? " ( 1 = " +
                          formatCurrency(
                            investmentDetail?.campaignId?.pricePerShare ?? "0",
                            siteSettings.currencySymbolSide,
                            investmentDetail?.campaignId?.equityCurrencySymbol,
                            investmentDetail?.campaignId?.equityCurrencyCode,
                            siteSettings.decimalPoints
                          ) +
                          " )"
                        : "-"}
                    </strong>
                  </Col>
                ) : (
                  <Col className="mt-md-5 mt-3" md={3} sm={6}>
                    <p>{i18n.t("myInvestment.preferredReturn")}</p>
                    <strong>
                      {investmentDetail?.campaignId?.interestRate
                        ? investmentDetail.campaignId?.interestRate + "%"
                        : "-"}
                    </strong>
                  </Col>
                )}
                <Col className="mt-md-5 mt-3" md={3} sm={6}>
                  <p>{i18n.t("myInvestment.ownership")}</p>
                  <strong>
                    {investmentDetail?.tempOwnership
                      ? investmentDetail.tempOwnership + " %"
                      : "-"}
                  </strong>
                </Col>
              </Row>
              {investmentDetail?.campaignId?.termsSlug === "debt" && (
                <Row>
                  <Col className="mt-md-5 mt-3" md={3} sm={6}>
                    <p>{i18n.t("myInvestment.remainingInvestmentTerm")}</p>
                    <strong>{investmentDetail?.remainingTerm ?? "-"}</strong>
                  </Col>
                  <Col className="mt-md-5 mt-3" md={3} sm={6}>
                    <p>{i18n.t("myInvestment.nextRepayment")}</p>
                    <strong>
                      {formatCurrency(
                        investmentDetail?.nextRepaymentAmount ?? "0",
                        siteSettings.currencySymbolSide,
                        investmentDetail?.campaignId?.equityCurrencySymbol,
                        investmentDetail?.campaignId?.equityCurrencyCode,
                        siteSettings.decimalPoints
                      )}
                    </strong>
                  </Col>
                  <Col className="mt-md-5 mt-3" md={3} sm={6}>
                    <p>{i18n.t("myInvestment.nextDistributionDate")}</p>
                    <strong>
                      {investmentDetail?.nextDistributionDate
                        ? investmentDetail?.nextDistributionDate.includes(
                            "T"
                          ) &&
                          investmentDetail?.nextDistributionDate.includes("Z")
                          ? moment(
                              investmentDetail.nextDistributionDate
                            ).format(siteSettings.dateFormat)
                          : investmentDetail?.nextDistributionDate
                        : "-"}
                    </strong>
                  </Col>
                  <Col className="mt-md-5 mt-3" md={3} sm={6}>
                    <p>{i18n.t("myInvestment.distributionAmount")}</p>
                    <strong>
                      {formatCurrency(
                        investmentDetail?.totalDistribution ?? "0",
                        siteSettings.currencySymbolSide,
                        investmentDetail?.campaignId?.equityCurrencySymbol,
                        investmentDetail?.campaignId?.equityCurrencyCode,
                        siteSettings.decimalPoints
                      )}
                    </strong>
                  </Col>
                </Row>
              )}
              <Row>
                <Col className="mt-md-5 mt-3" md={3} sm={6}>
                  <p>{i18n.t("myInvestment.paymentMethod")}</p>
                  <strong>
                    {investmentDetail?.transactionId?.doneFromWallet ===
                    "partial"
                      ? `${i18n.t("wallet.title")} + ${i18n.t(
                          `payment.${investmentDetail?.gatewayId?.paymentType}.title`
                        )}`
                      : investmentDetail?.transactionId?.doneFromWallet ===
                        "full"
                      ? i18n.t("wallet.title")
                      : i18n.t(
                          `payment.${investmentDetail?.gatewayId?.paymentType}.title`
                        ) ?? "-"}
                  </strong>
                </Col>
                {investmentDetail?.campaignId?.termsSlug === "debt" && (
                  <Col className="mt-md-5 mt-3" md={3} sm={6}>
                    <p>{i18n.t("myInvestment.investFrequency")}</p>
                    <strong>
                      {investmentDetail?.campaignId?.investFrequency ?? "-"}
                    </strong>
                  </Col>
                )}
                <Col className="mt-md-5 mt-3" md={3} sm={6}>
                  <p>{i18n.t("myInvestment.transactionId")}</p>
                  <strong>
                    {investmentDetail?.transactionId?.transactionKey ?? "-"}
                  </strong>
                </Col>
              </Row>
            </div>
          ) : (
            <div className="mb-5 mt-5">
              <Spinner
                position={"center"}
                width={"4rem"}
                height={"4rem"}
                opacity={"0.5"}
              />
            </div>
          )}
        </Collapse>
      </div>
      {show && (
        <DocumentsModal
          show={show}
          handleClose={handleClose}
          transactionId={investment?.id}
        />
      )}
    </Card>
  );
};

export default TransactionCard;
