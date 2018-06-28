var Tickers = require("./tickers.js");

setInterval(marketsDirector, 30000);

function marketsDirector() {
  return Promise.resolve().then(() => {
    const btc_e = new marketBtcE();
    btc_e.builderTickers();

    const poloniex = new marketPolonex();
    poloniex.builderTickers();

    const exmo = new marketExmo();
    exmo.builderTickers();
  });
}
class marketExmo extends Tickers {
  constructor() {
    const apiTicker = "https://api.exmo.com/v1/ticker/";
    const tickerBuy = "buy_price";
    const tickerSell = "sell_price";
    const marketName = "exmo";

    super(apiTicker, tickerBuy, tickerSell, marketName);
  }

  builderTickers() {
    this.getDataFromApi(this.apiTicker).then(data => {
      const tickers = this.getTickersValue(data);
      this.writeToDatabase(tickers);
    });
  }
}

class marketPolonex extends Tickers {
  constructor() {
    const apiTicker = "https://poloniex.com/public?command=returnTicker";
    const tickerBuy = "lowestAsk";
    const tickerSell = "highestBid";
    const marketName = "poloniex";

    super(apiTicker, tickerBuy, tickerSell, marketName);
  }

  builderTickers() {
    this.getDataFromApi(this.apiTicker).then(data => {
      const tickers = this.getTickersValue(data);
      this.writeToDatabase(tickers);
    });
  }
}

class marketBtcE extends Tickers {
  constructor() {
    const apiTicker = "https://btc-e.nz/api/3/ticker/";
    const tickerBuy = "buy";
    const tickerSell = "sell";
    const marketName = "btc-e";

    super(apiTicker, tickerBuy, tickerSell, marketName);

    this.urlInfo = "https://btc-e.nz/api/3/info";
  }

  builderTickers() {
    this.getDataFromApi(this.urlInfo)
    .then(data => {
      this.formUrlApiTicker(data);
      this.getDataFromApi(this.apiTicker)
      .then(data => {
        const tickers = this.getTickersValue(data);
        this.writeToDatabase(tickers);
      });
    });
  }

  formUrlApiTicker(data) {
    const joinedTickers = this.joinGetTickers(this.getListKeyApiInfo(data));
    this.apiTicker = this.addTickersTailToUrl(this.apiTicker, joinedTickers);
  }

  getListKeyApiInfo(data) {
    return Object.keys(data.pairs);
  }

  joinGetTickers(keys) {
    return keys.join("-");
  }

  addTickersTailToUrl(urlApi, tail) {
    return (urlApi = urlApi + tail + "?ignore_invalid=1");
  }
}
