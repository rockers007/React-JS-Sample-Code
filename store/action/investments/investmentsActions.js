import * as actionTypes from "./actionTypes";

/**
 * @Author Rockers Technology
 * This action function is used to dispatch selected currency on my invesment page to reducer
 * It's related to my investment module
 * @param $url - Unique currency object
 *
 * @return nothing
 */
export const setInvestmentSelectedCurrency = (currency) => {
  return {
    type: actionTypes.SET_INVESMENT_SELECTED_CURRENCY,
    currency,
  };
};
