import React, { useEffect, useState } from "react";
import iconDelete from "../../assets/icon/delete.svg";
import Searchbar from "../../components/Searchbar/index.jsx";
import downloadIcon from "../../assets/icon/download.svg";
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
import {
  approveReview,
  deleteReview,
  getAllReviews,
} from "../../api/reviews.js";

const Reviews = () => {
  const [startingIndex, setStartingIndex] = useState(0);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [idToUpdate, setIdToUpdate] = useState("");

  const queryClient = useQueryClient();
  // API fetching
  const { data, isLoading, isError } = useQuery({
    queryKey: ["reviews"],
    queryFn: () => getAllReviews(),
  });

  // to delete the coupon
  const { mutate, isPending } = useMutation({
    mutationKey: ["deleteReview", idToUpdate],
    mutationFn: (id) => deleteReview(id),
    gcTime: Infinity,
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error,
      });
    },
    onSuccess: () => {
      setIdToUpdate("");
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      Swal.fire({
        title: "Deleted!",
        text: `Coupon has been deleted.`,
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
        setIdToUpdate(data._id);
        mutate(data._id);
      }
    });
  };

  useEffect(() => {
    if (data) {
      const filteredData = searchObjects(data, searchQuery, [
        "_id",
        "name",
        "mobileNumber",
        "review",
      ]);
      setFilteredData(reversed(filteredData));
    }
  }, [data, searchQuery]);

  const { isPending: isPendingApprove, mutate: approveReviewMutate } =
    useMutation({
      mutationKey: ["approveReview", idToUpdate],
      mutationFn: (id) => approveReview(id),
      gcTime: Infinity,
      onError: (error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error,
        });
      },
      onSuccess: () => {
        setIdToUpdate("");
        queryClient.invalidateQueries({ queryKey: ["reviews"] });
        Swal.fire({
          title: "Approved!",
          text: `Review has been approved.`,
          icon: "success",
        });
      },
    });

  return (
    <>
      <div className="bg-[#F5F6FA] min-h-svh w-full p-6 pb-11">
        <div className="flex justify-between">
          <h1 className="font-lato text-[32px] font-bold text-black leading-[38.4px] ">
            Total Reviews
          </h1>
        </div>
        <div className="bg-white overflow-x-auto mt-3 rounded-[16px] p-4 px-5">
          <div className=" justify-between flex items-center ">
            {/* Searchbar */}
            <Searchbar
              placeholder="Search by ID, Name, Mobile Number, Review"
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setStartingIndex(0);
              }}
            />
            <div className="flex items-center gap-3">
              {/* downloadIcon */}
              <button
                disabled={isLoading || isError}
                onClick={() => jsonToXlsx(data, "Reviews")}
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
              ) : !isError && data ? (
                <table className="table rounded-2xl  w-full">
                  {/* head */}

                  <thead className="grid-col-5">
                    <tr className="h-[48px] bg-slate-100 rounded-xl w-full items-center">
                      <th className=" text-neutral-800 text-sm font-bold font-lato text-start px-3 ">
                        ID
                      </th>
                      <th className=" text-neutral-800 text-sm font-bold font-lato text-center px-3 ">
                        Name
                      </th>
                      <th className=" text-neutral-800 text-sm font-bold font-lato text-center px-3">
                        Mobile Number
                      </th>
                      <th className=" text-neutral-800 text-sm font-bold font-lato text-center px-3">
                        Review
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
                                  {item.name}
                                </td>
                                <td className="opacity-80  font-lato font-semibold w-1/5 min-w-[150px] text-center text-[14px] px-3">
                                  {item.mobileNumber}
                                </td>
                                <td className="opacity-80  font-lato font-semibold w-1/5 min-w-[150px] text-center text-[14px] px-3">
                                  {item.review}
                                </td>
                                <td className="opacity-80 w-1/5 min-w-[100px]">
                                  <div className="flex gap-3 items-center place-content-center">
                                    <button
                                      onClick={() => {
                                        setIdToUpdate(item._id);
                                        isPendingApprove
                                          ? null
                                          : approveReviewMutate(item._id);
                                      }}
                                      className="btn btn-accent btn-sm text-white font-light"
                                    >
                                      {isPendingApprove &&
                                      item._id == idToUpdate
                                        ? "Approving..."
                                        : "Approve"}
                                    </button>
                                    <button onClick={() => handleClick(item)}>
                                      {isPending && item._id == idToUpdate ? (
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

export default Reviews;
