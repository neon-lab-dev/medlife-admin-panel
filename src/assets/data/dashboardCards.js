import icon1 from "../../assets/icon/Icon1.svg";
import icon2 from "../../assets/icon/Icon2.svg";
import icon3 from "../../assets/icon/Icon3.svg";
import icon4 from "../../assets/icon/Icon4.svg";
import icon5 from "../../assets/icon/Icon5.svg";
import icon6 from "../../assets/icon/Icon6.svg";
import icon7 from "../../assets/icon/Icon7.svg";
import icon8 from "../../assets/icon/Icon8.svg";
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
    title: "Conneted User",
    queryKey: "totalOrdersAmountCancelled",
  },
];

export default DASHBOARD_CARDS;
