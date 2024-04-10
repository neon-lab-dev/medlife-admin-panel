const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL + "/api/v1";

export const API = {
  //auth
  login: BACKEND_BASE_URL + "/login", //to login user
  user: BACKEND_BASE_URL + "/me", //to get user details
  logout: BACKEND_BASE_URL + "/logout", //to logout user

  // product
  getAllDoctors: BACKEND_BASE_URL + "/doctors", //to get All doctors
  createDoctor: BACKEND_BASE_URL + "/createdoctor", //to create doctor
  deleteDoctor: BACKEND_BASE_URL + "/doctor", //to delete Product
  getDoctorDetail: BACKEND_BASE_URL + "/doctor", //to get details of  Product
  updateDoctorDetail: BACKEND_BASE_URL + "/doctor", //to get details of  Product

  //dashboard
  dashboard: BACKEND_BASE_URL + "/admin/dashboard", //to get dashboard details

  //users
  userDetails: BACKEND_BASE_URL + "/activeleads", //to get all users details
  connectedUserDetails: BACKEND_BASE_URL + "/connectedleads", //to get all connected users details
  userStatus: BACKEND_BASE_URL + "/lead", // to get a specified user

  //reviews
  reviewsDetails: BACKEND_BASE_URL + "/reviews", //to get all reviews details

  //Blogs
  allBlogs: BACKEND_BASE_URL + "/blogs", //to get all blog details
  Blog: BACKEND_BASE_URL + "/blog", // to delete the blog
  createBlog: BACKEND_BASE_URL + "/createblog",

  getAdminReviews: BACKEND_BASE_URL + "/areviews", //to get admin all reviews details
  updateReviewStatus: BACKEND_BASE_URL + "/reviewstatus", // /:id
};
