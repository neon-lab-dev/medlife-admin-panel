import axios from "axios";
import { API } from ".";

export const getAllBlog = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(API.allBlogs, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        resolve(res.data?.blogs || []);
      })
      .catch((err) => {
        reject(
          err?.response?.data?.message ||
            "Something went wrong, please try again"
        );
      });
  });
};

export const createCoupon = ({ data }) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        API.newCoupon,data,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        resolve(res.data?.blogs);
      })
      .catch((err) => {
        reject(
          err?.response?.data?.message || "Login failed, please try again"
        );
      });
  });
};

export const deleteCoupon = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${API.Blog}/${id}`, {
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
          err?.response?.data?.message ||
            "Error deleting blog, please try again"
        );
      });
  });
};
