import React, { useEffect, useState } from "react";
import iconDelete from "../../assets/icon/delete.svg";
import Searchbar from "../../components/Searchbar";
import downloadIcon from "../../assets/icon/download.svg";
import { getAllBlog, deleteBlog } from "../../api/blog.js";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import AppLoading from "../../components/loaders/AppLoading.jsx";
import SomeErrorOccurred from "../Error/SomeErrorOccurred.jsx";
import Deleting from "../../components/loaders/Deleting.jsx";
import TableEntriesPrevNextButtons from "../../components/TableEntriesPrevNextButtons.jsx";
import { MAX_ROWS_PER_PAGE } from "../../assets/data/constants.js";
import { searchObjects } from "../../utils/search.js";
import { reversed } from "../../utils/reversed.js";
import NoDataFound from "../../components/NoDataFound.jsx";
import jsonToXlsx from "../../utils/jsonAsXlsx.js";
import BlogButton from "../../assets/images/blogbutton.png";
import CreateBlogModal from "./CreateBlog.jsx";
import UpdateBlogModal from "./UpdateBlog.jsx";

const Coupons = () => {
  const [startingIndex, setStartingIndex] = useState(0);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [idToDelete, setIdToDelete] = useState("");
  const [activeBlogToUpdate, setActiveBlogToUpdate] = useState({});

  const queryClient = useQueryClient();
  // API fetching
  const {
    data: allCouponsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["blogs"],
    queryFn: () => getAllBlog(),
  });

  // to delete the Blog
  const { mutate, isPending } = useMutation({
    mutationKey: ["deleteBlogs"],
    mutationFn: (id) => deleteBlog(id),
    gcTime: Infinity,
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error,
      });
    },
    onSuccess: () => {
      setIdToDelete("");
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      Swal.fire({
        title: "Deleted!",
        text: `Blog has been deleted.`,
        icon: "success",
      });
    },
  });

  // for deleting coupon
  const handleClick = (data) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setIdToDelete(data._id);
        mutate(data._id);
      }
    });
  };

  useEffect(() => {
    if (allCouponsData) {
      const data = searchObjects(allCouponsData, searchQuery, ["_id", "title"]);
      setFilteredData(reversed(data));
    }
  }, [allCouponsData, searchQuery]);

  return (
    <>
      <div className="bg-[#F5F6FA] min-h-svh w-full p-6 pb-11">
        <div className="flex justify-between">
          <h1 className="font-lato text-[32px] font-bold text-black leading-[38.4px] ">
            Blogs
          </h1>
          <button
            className="w-48 h-[50px] text-white bg-[#60AFBD] rounded-[6px]"
            onClick={() =>
              document.getElementById("create_new_blog").showModal()
            }
          >
            <div className="flex items-center justify-center">
              <img src={BlogButton} className="w-[30px]" />
              <p className="text-white text-sm font-semibold font-lato tracking-tight ml-[10px]">
                Create Blog
              </p>
            </div>
          </button>
          {/* couponModal */}
          <CreateBlogModal />
          <UpdateBlogModal data={activeBlogToUpdate} />
        </div>
        <div className="bg-white overflow-x-auto mt-3 rounded-[16px] p-4 px-5">
          <div className=" justify-between flex items-center ">
            {/* Searchbar */}
            <Searchbar
              placeholder="Search by Blog name or ID"
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setStartingIndex(0);
              }}
            />
            <div className="flex items-center gap-3">
              {/* downloadIcon */}
              <button
                disabled={isLoading || isError}
                onClick={() => jsonToXlsx(allCouponsData, "Blog")}
                className=" bg-lightgray  rounded-[6px] disabled:opacity-50"
              >
                <img src={downloadIcon} alt="" />
              </button>
            </div>
          </div>
          {/* User table */}
          <div className="mt-4">
            <div className="overflow-x-auto">
              {isLoading ? (
                <AppLoading />
              ) : !isError && allCouponsData ? (
                <table className="table rounded-2xl  w-full">
                  {/* head */}

                  <thead className="grid-col-5">
                    <tr className="h-[48px] bg-slate-100 rounded-xl w-full items-center">
                      <th className=" text-neutral-800 text-sm font-bold font-lato text-start px-3 ">
                        ID
                      </th>
                      <th className=" text-neutral-800 text-sm font-bold font-lato text-center px-3 ">
                        Title
                      </th>
                      <th className=" text-neutral-800 text-sm font-bold font-lato text-center px-3">
                        Images
                      </th>
                      <th className=" text-neutral-800 text-sm font-bold font-lato text-center px-3">
                        Action
                      </th>
                    </tr>
                  </thead>
                  {filteredData?.length > 0 ? (
                    <tbody className="grid-col-5">
                      {filteredData
                        ?.slice(
                          startingIndex,
                          startingIndex + MAX_ROWS_PER_PAGE
                        )
                        ?.map((item) => {
                          return (
                            <>
                              <tr
                                className="h-[48px] w-full items-center"
                                key={item._id}
                              >
                                <td className="opacity-80 font-lato font-semibold text-[14px] w-1/5 min-w-[150px] text-black  text-start px-3">
                                  #{item._id}
                                </td>
                                <td className="opacity-80 font-lato font-semibold text-[14px] text-center w-1/5 min-w-[150px] text-black     px-3">
                                  {item.title}
                                </td>
                                <td className="opacity-80  font-lato  font-semibold w-1/5 min-w-[150px] text-center text-[14px] px-3">
                                  <img
                                    className="object-contain object-center h-[93px] rounded-lg min-w-[78px] w-[78px] ml-[100px]"
                                    src={item.avatar.url}
                                    alt="blog_image"
                                  />
                                </td>
                                <td className="opacity-80 w-1/5 min-w-[100px]">
                                  <div className="flex gap-4 place-content-center">
                                    <button
                                      onClick={() => {
                                        setActiveBlogToUpdate(item);
                                        document
                                          .getElementById("update_blog")
                                          ?.showModal();
                                      }}
                                      className=" font-semibold p-2 rounded-lg border-violet-900 text-[#7131ae] border"
                                    >
                                      Update
                                    </button>
                                    <button onClick={() => handleClick(item)}>
                                      {isPending && item._id == idToDelete ? (
                                        <Deleting />
                                      ) : (
                                        <img src={iconDelete} />
                                      )}
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            </>
                          );
                        })}
                    </tbody>
                  ) : (
                    <NoDataFound />
                  )}
                </table>
              ) : (
                <SomeErrorOccurred />
              )}
            </div>
            <hr />
            {filteredData.length > 0 && (
              <TableEntriesPrevNextButtons
                displayDataLength={
                  filteredData?.slice(
                    startingIndex,
                    startingIndex + MAX_ROWS_PER_PAGE
                  ).length
                }
                startingIndex={startingIndex}
                setStartingIndex={setStartingIndex}
                filteredDataLength={filteredData.length}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Coupons;
