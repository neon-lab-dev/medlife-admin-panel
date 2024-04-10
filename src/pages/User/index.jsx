import React, { useEffect, useState } from "react";
import Searchbar from "../../components/Searchbar";
import downloadIcon from "../../assets/icon/download.svg";
import AppLoading from "../../components/loaders/AppLoading.jsx";
import SomeErrorOccurred from "../Error/SomeErrorOccurred.jsx";
import jsonToXlsx from "../../utils/jsonAsXlsx.js";
import TableEntriesPrevNextButtons from "../../components/TableEntriesPrevNextButtons.jsx";
import { searchObjects } from "../../utils/search.js";
import { MAX_ROWS_PER_PAGE } from "../../assets/data/constants.js";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserDetails } from "../../api/user.js";
import NoDataFound from "../../components/NoDataFound.jsx";
import { updateStatus } from "../../api/user.js";
import Swal from "sweetalert2";

const User = () => {
  const queryClient = useQueryClient();
  const [startingIndex, setStartingIndex] = useState(0);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [idToChange, setIdToChange] = useState("");

  const {
    data: userData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUserDetails(),
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["updateStatus"],
    mutationFn: (_id) => updateStatus(_id),
    gcTime: Infinity,
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      Swal.fire({
        title: "Changed",
        text: `Status is changed`,
        icon: "success",
      });
    },
  });

  useEffect(() => {
    if (userData) {
      const filteredData = searchObjects(userData, searchQuery, [
        "_id",
        "name",
        "mobileNumber",
        "city",
        "disease",
      ]);
      setFilteredData(filteredData);
    }
  }, [userData, searchQuery]);

  return (
    <div className="bg-[#F5F6FA] min-h-full w-full p-6 pb-11">
      <h1 className="font-lato text-[32px] font-bold text-black leading-[38.4px] ">
        All Users
      </h1>

      <div className="bg-white overflow-x-auto mt-3 rounded-[16px] p-4 px-5">
        <div className=" justify-between flex items-center ">
          {/* Searchbar */}
          <Searchbar
            placeholder="Search by ID, Name, City, Mobile No, Disease"
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setStartingIndex(0);
            }}
          />
          <div className="flex items-center gap-6">
            {/* downloadIcon */}
            <button
              disabled={isLoading || isError}
              onClick={() => jsonToXlsx(userData, "users")}
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
            ) : !isError && userData ? (
              <table className="table rounded-2xl w-full">
                {/* head */}
                <thead className="grid-col-6 ">
                  <tr className="h-[48px] bg-slate-100 w-full items-center">
                    <th className="w-1/6 font-bold font-lato text-black text-[14px] text-start px-3 ">
                      ID
                    </th>
                    <th className="w-1/6 font-bold font-lato text-black text-[14px] text-center px-3 ">
                      Name
                    </th>
                    <th className="w-1/6 font-bold font-lato text-black text-[14px]  text-center px-3">
                      Mobile No
                    </th>
                    <th className="w-1/6 font-bold font-lato text-black text-[14px]  text-center px-3">
                      City
                    </th>
                    <th className="w-1/6 font-bold font-lato text-black text-[14px]  text-center px-3">
                      Disease
                    </th>
                    <th className="w-1/6 font-bold font-lato text-black text-[14px]  text-center px-3">
                      Action
                    </th>
                  </tr>
                </thead>

                {filteredData.length > 0 ? (
                  <tbody className="grid-col-6 ">
                    {filteredData
                      ?.slice(startingIndex, startingIndex + MAX_ROWS_PER_PAGE)
                      .map((user) => {
                        return (
                          <tr
                            className="  h-[48px]  w-full items-center"
                            key={user._id}
                          >
                            <td className="opacity-80 font-lato font-semibold text-[14px] w-1/6 min-w-[150px] text-black  text-start px-3">
                              #{user._id}
                            </td>
                            <td className="opacity-80 font-lato font-semibold text-[14px] text-center w-1/6 min-w-[150px] text-black     px-3">
                              {user.name}
                            </td>
                            <td className="opacity-80  font-lato font-semibold w-1/6 min-w-[150px] text-center text-[14px] px-3">
                              {user.mobileNumber}
                            </td>
                            <td className="opacity-80 font-lato font-semibold w-1/6 min-w-[100px] text-center text-[14px] px-3">
                              {user.city}
                            </td>
                            <td className="opacity-80 font-lato font-semibold w-1/6 min-w-[100px] text-center text-[14px] px-3">
                              {user.disease}
                            </td>
                            <td className="opacity-80 font-lato font-semibold w-1/6 min-w-[100px] text-center text-[14px] px-3">
                              <button
                                className="btn btn-outline btn-info"
                                onClick={() => {
                                  mutate(user._id);
                                  setIdToChange(user._id);
                                }}
                              >
                                {isPending && idToChange == user._id
                                  ? "Changing...."
                                  : "Change Status"}
                              </button>
                            </td>
                          </tr>
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
          {filteredData?.length > 0 && (
            <TableEntriesPrevNextButtons
              filteredDataLength={filteredData?.length}
              displayDataLength={
                filteredData?.slice(
                  startingIndex,
                  startingIndex + MAX_ROWS_PER_PAGE
                ).length
              }
              setStartingIndex={setStartingIndex}
              startingIndex={startingIndex}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default User;
