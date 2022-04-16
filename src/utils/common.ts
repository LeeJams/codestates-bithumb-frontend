export const numberFormat = (number: string) => {
  return new Intl.NumberFormat("ko-KR", {}).format(Number(number));
};

export default {
  numberFormat,
};
