import * as actionTypes from "./actionTypes";

/**
 * @Author Rockers Technology
 * This action function is used to dispatch withdraw status on wallet page to reducer
 * It's related to my wallet module
 * @param $withdrawStatus - boolen
 *
 * @return nothing
 */
export const setWalletAmountWithdraw = (withdrawStatus) => {
  return {
    type: actionTypes.SET_WALLET_AMOUNT_WITHDRAW,
    withdrawStatus,
  };
};

/**
 * @Author Rockers Technology
 * This action function is used to dispatch selected currency on wallet page to reducer
 * It's related to my wallet module
 * @param $currency - Unique currency object
 *
 * @return nothing
 */
export const setWalletSelectedCurrency = (currency) => {
  return {
    type: actionTypes.SET_WALLET_SELECTED_CURRENCY,
    currency,
  };
};

/**
 * @Author Rockers Technology
 * This action function is used to dispatch campaignId to return after topup on wallet page to reducer
 * It's related to my wallet module
 * @param $campaignId - unique campaign id
 *
 * @return nothing
 */
export const setSelectedCampaignId = (campaignId) => {
  return {
    type: actionTypes.SET_SELECTED_CAMPAIGN_ID,
    campaignId,
  };
};
