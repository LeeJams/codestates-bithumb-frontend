export interface CoinTickerData {
  content: CoinContent;
  type: string;
}
export interface CoinContent {
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
