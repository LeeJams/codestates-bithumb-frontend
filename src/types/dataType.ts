export interface CoinTickerData {
  content: TickerContent;
  type: string;
}
export interface CoinTableRowItems {
  name: string;
  engName: string;
  openPrice: string;
  chgRate: string;
  chgPrice: string;
  volume: string;
  up: number;
  activeStatus: string;
}

export interface TickerContent {
  buyVolume: string; // 매수누적거래량
  chgAmt: string; // 변동금액
  chgRate: string; // 변동률
  closePrice: string; // 종가
  date: string; // 일자
  highPrice: string; // 고가
  lowPrice: string; // 저가
  openPrice: string; // 시가
  prevClosePrice: string; // 전일종가
  sellVolume: string; // 매도누적거래량
  symbol: string; // 통화코드
  tickType: string; // 변동 기준시간- 30M, 1H, 12H, 24H, MID
  time: string; // 시간
  value: string; // 누적거래금액
  volume: string; // 누적거래량
  volumePower: string; // 체결강도
}

export interface ConvertedTickerData {
  lowPrice: string; // 저가
  openPrice: string; // 시가
  highPrice: string; // 고가
  closePrice: string; // 종가
  chgRate: string; // 변동률
  chgAmt: string; // 변동금액
}

export interface ChartData {
  x: number;
  o: string;
  h: string;
  l: string;
  c: string;
}
export interface Transaction {
  content: {
    list: TransactionContents[];
  };
  type: "transaction";
}
export interface TransactionContents {
  buySellGb: string; // 체결종류(1:매도체결, 2:매수체결)
  contAmt: string; // 체결금액
  contDtm: string; // 체결시각
  contPrice: string; // 체결가격
  contQty: string; // 체결수량
  symbol: string; // 통화코드
  updn: string; // 직전 시세와 비교 : up-상승, dn-하락
}
export interface Orderbook {
  content: {
    datetime: string;
    list: OrderbookContents[];
  };
  type: "orderbookdepth";
}
export interface OrderbookContents {
  orderType: string; // 주문타입 – bid / ask
  price: string; // 호가
  quantity: string; // 잔량
  symbol: string; // 체결가격
  total: string; // 건수
}
export interface CandleStickChartData {
  data: [number, string, string, string, string, string][];
  status: string;
}

export interface RestTransactionData {
  data: {
    price: string;
    total: string;
    transaction_date: string;
    type: string;
    units_traded: string;
  }[];
  status: string;
}
export interface RestTickerData {
  data: {
    opening_price: string;
    closing_price: string;
    min_price: string;
    max_price: string;
    units_traded: string;
    acc_trade_value: string;
    prev_closing_price: string;
    units_traded_24H: string;
    acc_trade_value_24H: string;
    fluctate_24H: string;
    fluctate_rate_24H: string;
    date: string;
  };
  status: string;
}
export interface RestOrderbookData {
  data: {
    timestamp: string;
    order_currency: string;
    payment_currency: string;
    bids: { quantity: string; price: string }[];
    asks: { quantity: string; price: string }[];
  }[];
  status: string;
}
