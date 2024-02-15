import axios from "../../config/AxiosConfig";
import useSWR from "swr";

import { GET_WALLET_DETAILS_API } from "../../store/actions/apiCollections";

/**
 * @Author Rockers Technology
 * This function is used to fetch user's wallet Transaction
 * It's related to wallet module
 * @param $url - Unique api
 *
 * @return array of transaction
 */

export const walletTransactionFetcher = (url) =>
  axios.get(url).then((response) => response.data.data.data);

/**
 * @Author Rockers Technology
 * This function is used to fetch user's wallet Details
 * It's related to wallet module
 * @param $url - Unique api
 *
 * @return walletDetails including wallet balance
 */
export const walletDetailsFetcher = (url) =>
  axios.get(url).then((response) => response.data.data.data);

/**
 * @Author Rockers Technology
 * This function is used to withdraw amount from user's wallet
 * It's related to wallet module
 * @param $url - Unique api
 *
 * @return withdraw confirmation
 */
export const withdrawFromWallet = (url, { arg }) =>
  axios.post(url, arg).then((response) => response.data.data.data);

/**
 * @Author Rockers Technology
 * This function is used to  add amount to user's wallet
 * It's related to wallet module
 * @param $url - Unique api
 *
 * @return top up confirmation
 */
export const walletTopup = (url, { arg }) =>
  axios.post(url, arg).then((response) => response.data.data.data);

/**
 * @Author Rockers Technology
 * This custom hook is used to fetch user's wallet Details
 * It's related to wallet module
 * @param $currencyId - Unique currency id
 *
 * @return walletDetails including wallet balance
 */

export const useWalletDetailsFetcher = (currencyId) => {
  const {
    data: walletDetails,
    isValidating,
    mutate,
  } = useSWR(
    currencyId ? `${GET_WALLET_DETAILS_API}?&currencyId=${currencyId}` : "",
    walletDetailsFetcher,
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
    }
  );

  return { walletDetails, isValidating, mutate };
};
