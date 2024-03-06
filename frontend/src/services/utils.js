import Cookies from "js-cookie";

export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const avatar = (str) => {
  return str.charAt(0).toUpperCase();
};

export const truncateString = (str, limit) => {
  if (!str) {
    return ""; // Handle the case where str is undefined or null
  }

  if (str.length <= limit) {
    return str; // Return the original string if it's already within the limit
  } else {
    return str.slice(0, limit) + "..."; // Truncate the string and add ellipsis
  }
};

export const getUserFromCookies = () => {
  return JSON.parse(Cookies.get("user"))?.data;
};
