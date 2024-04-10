import axios from "axios";
import { API } from ".";

export const getAllReviews = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(API.getAdminReviews, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        resolve(res.data?.review || []);
      })
      .catch((err) => {
        reject(
          err?.response?.data?.message ||
            "Something went wrong, please try again"
        );
      });
  });
};

export const deleteReview = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${API.updateReviewStatus}/${id}`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(
          err?.response?.data?.message || "Delete failed, please try again"
        );
      });
  });
};

export const approveReview = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .put(
        `${API.updateReviewStatus}/${id}`,
        {},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(
          err?.response?.data?.message || "Approve failed, please try again"
        );
      });
  });
};
