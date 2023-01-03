export function addStartDate(coupon) {
  if (!coupon.dateValid) return coupon;
  const startDate = convertDate(coupon.dateValid);
  coupon.startDate = startDate;
  return coupon;
}
// A function to convert a string date in the format of "Valid MM/DD/YY - MM/DD/YY" to a date object
export function convertDate(dateString) {
  if (!dateString) return alert("no Date string provided");
  const dateArray = dateString.split(" ");
  const month = dateArray[1].split("/")[0];
  const day = dateArray[1].split("/")[1];
  const year = dateArray[1].split("/")[2];
  const date = new Date(`20${year}`, month, day, 5);
  return date;
}

export function sortDateAscending(a, b) {
  if (a.startDate < b.startDate) {
    return -1;
  }
  if (a.startDate > b.startDate) {
    return 1;
  }
  return 0;
}
