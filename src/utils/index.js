import moment from "moment";
export const timeStampToDateTime = (timestamp) => {
  return {
    format: (value) => {
      return moment(new Date(timestamp * 1000)).format(value);
    }
  };
};
