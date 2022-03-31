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
