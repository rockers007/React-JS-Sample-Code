import * as actionTypes from "../../actions/investments/actionTypes";
import { updateObject } from "../../utility/utility";

const initialState = {
  investmentSelectedCurrency: null,
};

/**
 * @Author Rockers Technology
 * This reducer function is used to store selected currency on my invesment page to redux store
 * It's related to my investment module
 * @param $state - redux store state
 * @param $action - dispatched action
 *
 * @return nothing
 */
const setInvestmentSelectedCurrency = (state, action) => {
  return updateObject(state, {
    investmentSelectedCurrency: action.currency,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_INVESMENT_SELECTED_CURRENCY:
      return setInvestmentSelectedCurrency(state, action);

    default:
      return state;
  }
};

export default reducer;
