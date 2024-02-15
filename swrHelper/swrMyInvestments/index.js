import axios from "../../config/AxiosConfig";

/**
 * @Author Rockers Technology
 * This function is used to fetch transactions
 * It's related to My Investment module
 * @param $url - Unique api
 *
 * @return array of investment transaction
 */
export const myInvestmentFetcher = (url) =>
  axios.get(url).then((response) => response.data.data.data);

/**
 * @Author Rockers Technology
 * This function is used to fetch individual transaction card details
 * It's related to My Investment module
 * @param $url - Unique api
 *
 * @return individual transaction card details
 */
export const getCardDetailFetcher = (url) =>
  axios.get(url).then((response) => response.data.data.data);

/**
 * @Author Rockers Technology
 * This function is used to fetch list of documents
 * It's related to My Investment module
 * @param $url - Unique api
 *
 * @return list of documents
 */
export const getDocumentDetailFetcher = (url) =>
  axios.get(url).then((response) => response.data.data.data);

/**
 * @Author Rockers Technology
 * This function is used to fetch invesment dashboard card  data
 * It's related to My Investment module
 * @param $url - Unique api
 *
 * @return invesment dashboard card  data
 */
export const getMyInvestmentsGraphFetcher = (url) =>
  axios.get(url).then((response) => response.data.data.data);

/**
 * @Author Rockers Technology
 * This function is used to fetch chart data
 * It's related to My Investment module
 * @param $url - Unique api
 *
 * @return chart data
 */
export const getInvestmentsChartFetcher = (url) =>
  axios.get(url).then((response) => response.data.data.data);

/**
 * @Author Rockers Technology
 * This function is used to fetch list of currency user has invested in
 * It's related to My Investment module
 * @param $url - Unique api
 *
 * @return array list of currency user has invested in
 */
export const getInvestmentUniqueCurrenciesFetcher = (url) =>
  axios.get(url).then((response) => response.data.data.data);

/**
 * @Author Rockers Technology
 * This function is used to fetch column chart data
 * It's related to My Investment module
 * @param $url - Unique api
 *
 * @return column chart data
 */
export const getInvestmentsColumnChartFetcher = (url) =>
  axios.get(url).then((response) => response.data.data.data);
