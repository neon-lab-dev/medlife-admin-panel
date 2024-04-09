import axios from "axios";
import { API } from ".";

export const getAllUserCount = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(API.userDetails, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        resolve(res?.data?.counts)
      })
      .catch((err) => {
        reject(
          err?.response?.data?.message ||
            "Something went wrong, please try again"
        );
      });
  });
};
export const getConnectedUserCount = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(API.connectedUserDetails, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        resolve(res?.data?.counts)
      })
      .catch((err) => {
        reject(
          err?.response?.data?.message ||
            "Something went wrong, please try again"
        );
      });
  });
};

export const getDoctorsCount = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(API.doctorsDetails, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        resolve(res?.data?.counts)
      })
      .catch((err) => {
        reject(
          err?.response?.data?.message ||
            "Something went wrong, please try again"
        );
      });
  });
};
export const getReviewsCount = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(API.reviewsDetails, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        resolve(res?.data?.counts)
      })
      .catch((err) => {
        reject(
          err?.response?.data?.message ||
            "Something went wrong, please try again"
        );
      });
  });
};

