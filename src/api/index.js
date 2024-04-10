const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL + "/api/v1";

export const API = {
  //auth
  login: BACKEND_BASE_URL + "/login", //to login user
  user: BACKEND_BASE_URL + "/me", //to get user details
  logout: BACKEND_BASE_URL + "/logout", //to logout user

  //doctors
  doctorsDetails: BACKEND_BASE_URL + "/doctors", //to get all doctors

  //reviews
  reviewsDetails: BACKEND_BASE_URL + "/reviews", //to get all reviews

  //users
  userDetails: BACKEND_BASE_URL + "/activeleads", //to get all users details
  connectedUserDetails: BACKEND_BASE_URL + "/connectedleads", //to get all connected users details
  userStatus :BACKEND_BASE_URL+ "/lead" // to get a specified user
};
