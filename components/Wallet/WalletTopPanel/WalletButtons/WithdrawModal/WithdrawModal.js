import React, { useEffect } from "react";
import i18n from "i18next";
import {
  Col,
  Form,
  FormGroup,
  FormLabel,
  Modal,
  ModalFooter,
  Row,
} from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import useSWRMutation from "swr/mutation";

import Spinner from "../../../../Spinner/Spinner";

import { formatCurrency } from "../../../../../../../helpers/numberFormat";
import { WITHDRAW_FROM_WALLET_API } from "../../../../../../../store/actions/apiCollections";
import { withdrawFromWallet } from "../../../../../../../swrHelpers/swrWallet";
import { setWalletAmountWithdraw } from "../../../../../../../store/actions/wallet/walletActions";

const WithdrawModal = ({
  setShowWithdrawModal,
  showWithdrawModal,
  walletDetails,
  walletCurrencyId,
  walletCurrencySymbol,
  walletCurrencyCode,
}) => {
  const dispatch = useDispatch();
  /**
   * @Author Rockers Technology
   * This hook is used to withdraw amount from user's wallet
   * It's related to wallet module
   * @param $WITHDRAW_FROM_WALLET_API - Unique api
   * @param $withdrawFromWallet - swr fetcher helper
   *
   * @return withdraw confirmation
   */
  const { data, trigger, isMutating } = useSWRMutation(
    WITHDRAW_FROM_WALLET_API,
    withdrawFromWallet
  );

  const accountTypeOptions = [
    { value: "Current Account", label: i18n.t("funding.currentAccount") },
    { value: "Saving Account", label: i18n.t("funding.savingAccount") },
  ];

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ mode: "onChange" });

  const { siteSettings } = useSelector((state) => state.siteSettings);
  const { investors } = useSelector((state) => state.investorProfile);
  const { refreshWalletTransactions } = useSelector((state) => state.wallet);

  useEffect(() => {
    if (showWithdrawModal) {
      reset({
        accountType:
          investors !== null
            ? investors?.accountType === "CHECKING"
              ? "Current Account"
              : "Saving Account"
            : "",
        bankName: investors !== null ? investors?.bankName : "",
        accountNumber: investors !== null ? investors?.accountNumber : "",
        routingNumber: investors !== null ? investors?.routingNumber : "",
      });
    }
  }, [showWithdrawModal]);

  useEffect(() => {
    if (data && !isMutating) {
      dispatch(setWalletAmountWithdraw(true));
      handleWithdrawClose();
    }
  }, [data, isMutating]);

  const handleWithdrawClose = () => {
    setShowWithdrawModal(false);
    reset();
  };

  const onSubmitWithdraw = (data) => {
    data.currencyId = walletCurrencyId;
    data.createdAt = Date.now();
    trigger(data);
  };

  return (
    <Modal
      show={showWithdrawModal}
      onHide={handleWithdrawClose}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header className="p-3">
        <Modal.Title as="h3">
          {i18n.t("wallet.withdraw.modalTitle")}
          <span className="withdraw-balance">
            {i18n.t("wallet.walletBalance")}:{" "}
            <b>
              {formatCurrency(
                walletDetails?.walletAmount ?? 0,
                siteSettings?.currencySymbolSide,
                walletCurrencySymbol,
                walletCurrencyCode,
                siteSettings?.decimalPoints
              )}
            </b>
          </span>
        </Modal.Title>
      </Modal.Header>
      <Form name="withdrawForm" onSubmit={handleSubmit(onSubmitWithdraw)}>
        <Modal.Body className="p-4">
          <FormGroup>
            <FormLabel>
              {i18n.t("wallet.withdraw.amount")}{" "}
              <span className="text-important">*</span>
            </FormLabel>
            <input
              id="withdrawAmount"
              name="amount"
              className={classNames("form-control", {
                "is-invalid": errors.amount,
              })}
              {...register("amount", {
                required: i18n.t("errors.required"),
                pattern: {
                  value: /^[0-9]*$/,
                  message: i18n.t("yup.validNumber"),
                },
                min: {
                  value: 1,
                  message: i18n.t("wallet.withdraw.minAmount"),
                },
                max: {
                  value: walletDetails?.walletAmount,
                  message: `${i18n.t(
                    "wallet.withdraw.maxAmount"
                  )} ${formatCurrency(
                    walletDetails?.walletAmount ?? 0,
                    siteSettings?.currencySymbolSide,
                    walletCurrencySymbol,
                    walletCurrencyCode,
                    siteSettings?.decimalPoints
                  )}`,
                },
                validate: (value) =>
                  value < 999999 ||
                  `${i18n.t("wallet.withdraw.maxLimit")} ${formatCurrency(
                    1000000,
                    siteSettings?.currencySymbolSide,
                    walletCurrencySymbol,
                    walletCurrencyCode,
                    siteSettings?.decimalPoints
                  )}`,
              })}
            />
            <ErrorMessage
              errors={errors}
              name="amount"
              render={({ message }) => (
                <div
                  className="invalid-feedback d-block"
                  id="withdrawAmountErr"
                >
                  {message}
                </div>
              )}
            />
          </FormGroup>
          <Row>
            <Col md={6}>
              <FormGroup>
                <FormLabel>
                  {i18n.t("wallet.withdraw.bankName")}{" "}
                  <span className="text-important">*</span>
                </FormLabel>
                <input
                  id="withdrawBankName"
                  name="bankName"
                  className={classNames("form-control", {
                    "is-invalid": errors.bankName,
                  })}
                  {...register("bankName", {
                    required: i18n.t("errors.required"),
                  })}
                />
                <ErrorMessage
                  errors={errors}
                  name="bankName"
                  render={({ message }) => (
                    <div
                      className="invalid-feedback d-block"
                      id="withdrawBankNameErr"
                    >
                      {message}
                    </div>
                  )}
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <FormLabel>
                  {i18n.t("wallet.withdraw.accountType")}{" "}
                  <span className="text-important">*</span>
                </FormLabel>
                <Controller
                  name={"accountType"}
                  control={control}
                  rules={{ required: i18n.t("errors.required") }}
                  render={({ field: { value, onChange } }) => {
                    return (
                      <Select
                        classNamePrefix="react-select"
                        inputId="withdrawAccountType"
                        className={classNames("react-select-container", {
                          "is-invalid": errors.accountType,
                        })}
                        placeholder={i18n.t("funding.selectAccountType")}
                        options={accountTypeOptions}
                        value={accountTypeOptions.find(
                          (c) => c.value === value
                        )}
                        onChange={(val) => onChange(val.value)}
                      />
                    );
                  }}
                />
                <ErrorMessage
                  errors={errors}
                  name="accountType"
                  render={({ message }) => (
                    <div
                      className="invalid-feedback d-block"
                      id="withdrawAccountTypeErr"
                    >
                      {message}
                    </div>
                  )}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <FormLabel>
                  {i18n.t("wallet.withdraw.accountNumber")}{" "}
                  <span className="text-important">*</span>
                </FormLabel>
                <input
                  id="withdrawAccountNumber"
                  name="accountNumber"
                  className={classNames("form-control", {
                    "is-invalid": errors.accountNumber,
                  })}
                  {...register("accountNumber", {
                    required: i18n.t("errors.required"),
                    pattern: {
                      value: /^[0-9]*$/,
                      message: i18n.t("yup.validNumber"),
                    },
                  })}
                />
                <ErrorMessage
                  errors={errors}
                  name="accountNumber"
                  render={({ message }) => (
                    <div
                      className="invalid-feedback d-block"
                      id="withdrawAccountNumberErr"
                    >
                      {message}
                    </div>
                  )}
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <FormLabel>
                  {i18n.t("wallet.withdraw.routingNumber")}{" "}
                  <span className="text-important">*</span>
                </FormLabel>
                <input
                  id="withdrawRoutingNumberNumber"
                  name="routingNumber"
                  className={classNames("form-control", {
                    "is-invalid": errors.routingNumber,
                  })}
                  {...register("routingNumber", {
                    required: i18n.t("errors.required"),
                    pattern: {
                      value: /^[0-9]*$/,
                      message: i18n.t("yup.validNumber"),
                    },
                  })}
                />
                <ErrorMessage
                  errors={errors}
                  name="routingNumber"
                  render={({ message }) => (
                    <div
                      className="invalid-feedback d-block"
                      id="withdrawRoutingNumberErr"
                    >
                      {message}
                    </div>
                  )}
                />
              </FormGroup>
            </Col>
          </Row>
        </Modal.Body>
        <ModalFooter>
          <button
            className="btn btn-primary btn-sm"
            id="walletWithdrawSubmit"
            type="submit"
            disabled={isMutating || refreshWalletTransactions}
          >
            {isMutating || refreshWalletTransactions ? (
              <Spinner
                position={"center"}
                width={"0.75rem"}
                height={"0.75rem"}
                color="#fff"
              />
            ) : (
              i18n.t("global.submit")
            )}
          </button>
          <button
            className="btn btn-secondary btn-sm"
            id="walletWithdrawCloseBtn"
            type="button"
            disabled={isMutating}
            onClick={handleWithdrawClose}
          >
            {i18n.t("global.cancel")}
          </button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default WithdrawModal;
