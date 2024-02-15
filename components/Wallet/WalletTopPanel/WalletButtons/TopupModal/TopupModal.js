import React, { useEffect } from "react";
import i18n from "i18next";
import {
  Form,
  FormGroup,
  FormLabel,
  Modal,
  ModalFooter,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import useSWRMutation from "swr/mutation";

import Spinner from "../../../../Spinner/Spinner";
import { ADD_WALLET_TOP_UP_API } from "../../../../../../../store/actions/apiCollections";
import { walletTopup } from "../../../../../../../swrHelpers/swrWallet";
import { formatCurrency } from "../../../../../../../helpers/numberFormat";
import { setPreapprovalDetails } from "../../../../../../../store/actions/payment/paymentActions";
import { setCookie } from "../../../../../../../helpers/cookieHelper";

const TopupModal = ({
  showTopUpModal,
  setShowTopUpModal,
  walletCurrencyId,
  walletCurrencyCode,
  walletCurrencySymbol,
  history,
}) => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ mode: "onChange" });

  const { siteSettings } = useSelector((state) => state.siteSettings);
  /**
   * @Author Rockers Technology
   * This hook is used to  add amount to user's wallet
   * It's related to wallet module
   * @param $ADD_WALLET_TOP_UP_API - Unique api
   * @param $walletTopup - swr fetcher helper
   *
   * @return top up confirmation
   */
  const { data, trigger, isMutating } = useSWRMutation(
    ADD_WALLET_TOP_UP_API,
    walletTopup
  );

  useEffect(() => {
    if (data?._id && !isMutating) {
      handleTopUpClose();
      dispatch(setPreapprovalDetails(data));
      setCookie("transactionSessionTime", Date.now(), 0.0069);
      history.push(`/topup-payment/${data?._id}`);
    }
  }, [data, isMutating]);

  const handleTopUpClose = () => {
    setShowTopUpModal(false);
    reset();
  };

  const onSubmitTopUp = (data) => {
    data.currencyId = walletCurrencyId;
    data.createdAt = Date.now();
    trigger(data);
  };

  return (
    <Modal
      show={showTopUpModal}
      onHide={handleTopUpClose}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title as="h5">{i18n.t("wallet.topUp.modalTitle")}</Modal.Title>
      </Modal.Header>
      <Form name="topUpForm" onSubmit={handleSubmit(onSubmitTopUp)}>
        <Modal.Body>
          <FormGroup className="mb-0 wallet-currency-symbol">
            <FormLabel>
              {i18n.t("wallet.topUp.amount")}{" "}
              <span className="text-important">*</span>
            </FormLabel>
            <span className="custom-input-group-text">
              {walletCurrencySymbol}
            </span>
            <input
              id="topUpAmount"
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
                  message: i18n.t("wallet.topUp.minAmount"),
                },
                max: {
                  value: 999999,
                  message: `${i18n.t(
                    "wallet.topUp.maxAmount"
                  )} ${formatCurrency(
                    1000000,
                    siteSettings?.currencySymbolSide,
                    walletCurrencySymbol,
                    walletCurrencyCode,
                    siteSettings?.decimalPoints
                  )}`,
                },
              })}
            />
            <span
              className={classNames("custom-input-group-text currency-code", {
                "currency-code-error": errors.amount,
              })}
            >
              {walletCurrencyCode}
            </span>
            <ErrorMessage
              errors={errors}
              name="amount"
              render={({ message }) => (
                <div className="invalid-feedback d-block" id="topUpAmountErr">
                  {message}
                </div>
              )}
            />
          </FormGroup>
        </Modal.Body>
        <ModalFooter>
          <button
            className="btn btn-sm btn-primary m-1"
            style={{ width: isMutating ? "30%" : "" }}
            id="walletTopupSubmit"
            type="submit"
            disabled={isMutating}
          >
            {isMutating ? (
              <Spinner
                position={"center"}
                width={"0.75rem"}
                height={"0.75rem"}
                color="#fff"
              />
            ) : (
              i18n.t("wallet.topUp.proceed")
            )}
          </button>
          <button
            className="btn btn-sm btn-secondary m-1"
            id="walletTopupSubmit"
            type="button"
            disabled={isMutating}
            onClick={handleTopUpClose}
          >
            {i18n.t("global.cancel")}
          </button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default TopupModal;
