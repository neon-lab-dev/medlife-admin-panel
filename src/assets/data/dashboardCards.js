import icon1 from "../../assets/icon/Icon1.svg";
import icon3 from "../../assets/icon/Icon3.svg";
import icon9 from "../../assets/icon/Icon9.svg";

const DASHBOARD_CARDS = [
  {
    image: icon1,
    title: "Active User",
    queryKey: "userCount",
  },
  {
    image: icon9,
    title: "Doctors",
    queryKey: "productsCount",
  },
  {
    image: icon3,
    title: "Reviews",
    queryKey: "totalOrdersAmount",
  },
  {
    image:  icon1,
    title: "Connected User",
    queryKey: "totalOrdersAmountCancelled",
  },
];

export default DASHBOARD_CARDS;
