import * as actionTypes from "../../actions/wallet/actionTypes";
import { updateObject } from "../../utility/utility";

const initialState = {
  refreshWalletTransactions: false,
  topupSelectedCampaignId: null,
  walletSelectedCurrency: null,
};

/**
 * @Author Rockers Technology
 * This reducer function is used to store withdraw status on wallet page to redux store
 * It's related to wallet module module
 * @param $state - redux store state
 * @param $action - dispatched action
 *
 * @return nothing
 */
const setWalletAmountWithdraw = (state, action) => {
  return updateObject(state, {
    refreshWalletTransactions: action.withdrawStatus,
  });
};
/**
 * @Author Rockers Technology
 * This reducer function is used to store selected campaignId on wallet page to redux store
 * It's related to wallet module module
 * @param $state - redux store state
 * @param $action - dispatched action
 *
 * @return nothing
 */
const setSelectedCampaignId = (state, action) => {
  return updateObject(state, {
    topupSelectedCampaignId: action.campaignId,
  });
};
/**
 * @Author Rockers Technology
 * This reducer function is used to store selected currency on wallet page to redux store
 * It's related to wallet module module
 * @param $state - redux store state
 * @param $action - dispatched action
 *
 * @return nothing
 */
const setWalletSelectedCurrency = (state, action) => {
  return updateObject(state, {
    walletSelectedCurrency: action.currency,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_WALLET_SELECTED_CURRENCY:
      return setWalletSelectedCurrency(state, action);
    case actionTypes.SET_WALLET_AMOUNT_WITHDRAW:
      return setWalletAmountWithdraw(state, action);
    case actionTypes.SET_SELECTED_CAMPAIGN_ID:
      return setSelectedCampaignId(state, action);

    default:
      return state;
  }
};
export default reducer;
