/**
 * Requests price data from named API for multiple assets.
 * Creates a table of the results. 
 * Throws an ApiError if the requied API key is missing.
 * Throw an ApiError if the API request failed.
 * Throws an ApiError if the call to the API returns an error response.
 * @param {string} apiName - The name of the API to query.
 * @param {string} apiKey - The API key.
 * @param {Array<string>|string} assets - Comma-separated list of asset tickers.
 * @param {Asset|string} baseCurrency - The base currency.
 * @return {Array<Array<string, number, date>>} The table containing the price data for the assets.
 */
AssetTracker.prototype.getAssetPriceData = function (apiName, apiKey, assets, baseCurrency) {

  let table = [];
  let date = new Date();

  if (apiName === 'CryptoCompare') {

    if (!apiKey) {

      let errorMessage = `${apiName} API key missing\n\nTo get an API key, go to https://min-api.cryptocompare.com register, create a key, and save it in settings.`;

      throw new ApiError(errorMessage);

    }

    const url = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${assets}&tsyms=${baseCurrency}&api_key=${apiKey}`;

    let response;
    try {
      response = UrlFetchApp.fetch(url);
    }
    catch (error) {

      const message = `Failed to update crypto prices from ${apiName}.`;
      throw new ApiError(message);

    }

    const txt = response.getContentText();
    const data = JSON.parse(txt);

    if (data.Response === "Error") {

      throw new ApiError(data.Message);

    }

    for (let coin in data) {

      let currentPrice = data[coin][baseCurrency];

      table.push([coin, currentPrice, date.toISOString()]);

    }
  }
  else if (apiName === 'CoinMarketCap') {

    if (!apiKey) {

      let errorMessage = `${apiName} API key missing\n\nTo get an API key, go to https://coinmarketcap.com/api/ register, create a key, and save it in settings.`;

      throw new ApiError(errorMessage);

    }

    const requestOptions = {
      method: 'GET',
      uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
      qs: {
        'start': '1',
        'limit': '5000',
        'convert': baseCurrency
      },
      headers: {
        'X-CMC_PRO_API_KEY': apiKey
      },
      json: true,
      gzip: true
    };

    const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${assets}`;

    let response;
    try {
      response = UrlFetchApp.fetch(url, requestOptions);
    }
    catch (error) {

      const message = `Failed to update crypto prices from ${apiName}.`;
      throw new ApiError(message);

    }

    const txt = response.getContentText();
    const data = JSON.parse(txt);

    for (let coin in data.data) {

      let currentPrice = data.data[coin].quote[baseCurrency].price;

      table.push([coin, currentPrice, date.toISOString()]);

    }
  }

  return table;
};

/**
 * Tests the validaty of an API by attempting a simple request and checking for the error response.
 * @param {string} apiName - The name of the API to query.
 * @param {string} apiKey - The API key.
 * @return {boolean} Whether the test request was successful.
 */
AssetTracker.prototype.validateApiKey = function (apiName, apiKey) {

  try {
    this.getAssetPriceData(apiName, apiKey, 'BTC', 'USD');
  }
  catch (error) {
    if (error instanceof ApiError) {
      return false;
    }
    else {
      throw error;
    }
  }
  return true;
};