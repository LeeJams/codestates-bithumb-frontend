export const numberFormat = (number: string) => {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(Number(number));
};

export default {
  numberFormat,
};
