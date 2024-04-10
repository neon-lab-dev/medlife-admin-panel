import { useNavigate, useParams } from "react-router-dom";
import backIcon from "../../assets/icons/back.svg";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useEffect, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDoctorDetail, updateDoctorDetail } from "../../api/product";

const UpdateDoctor = () => {
  const [selectedImages, setSelectedImages] = useState(null);

  const { doctorId } = useParams();
  const queryClient = useQueryClient();

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm();
  const {
    specialization1,
    doctorName,
    education,
    experience,
    location,
    specialization3,
    diseaseHandle,
    specialization2,
  } = watch();

  // api calls
  const { data, isLoading, isSuccess } = useQuery({
    queryFn: () => getDoctorDetail(doctorId),
    queryKey: ["getDoctorDetail", doctorId],
  });

  const { mutate, isPending } = useMutation({
    mutationFn: updateDoctorDetail,
    onSuccess: () => {
      Swal.fire({
        title: "Product Update Success",
        text: `${watch.name} Update Successfully `,
        icon: "success",
      });
      queryClient.invalidateQueries({
        queryKey: ["doctors", doctorId],
      });
      reset();
      setSelectedImages(null);
      navigate("/doctor");
    },
    onError: (err) => {
      console.log(err);
      Swal.fire({
        title: "Error",
        text: err,
        icon: "error",
      });
      reset();
    },
  });

  const navigate = useNavigate();
  const handleBackNavigate = () => {
    navigate("/doctor");
  };

  const handleFormSubmit = (data) => {
    if (!selectedImages) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please select Doctor image!",
      });
      return null;
    } else {
      const fd = new FormData();
      if (!selectedImages.url) {
        fd.append("file", selectedImages);
      }
      for (const item of Object.keys(data)) {
        fd.append(item, data[item]);
      }
      mutate({ doctorId, fd });
    }
  };

  const inputRef = useRef();

  const handleImageChange = (event) => {
    const { files } = event.target;
    if (files[0]) {
      setSelectedImages(files[0]);
    }
  };
  const handleChooseImage = () => {
    inputRef.current.click();
  };

  useEffect(() => {
    if (isSuccess) {
      for (const item of Object.keys(data?.doctor)) {
        setValue(item, data?.doctor[item]);
      }
      setSelectedImages(data?.doctor?.avatar);
    }
  }, [isSuccess]);

  const diseaseHandleOptions = [
    "Proctology",
    "Laparoscopy",
    "Gynaecology",
    "ENT",
    "Urology",
    "Vascular",
    "Aesthetics",
    "Orthopedics",
    "Ophthalmology",
    "Fertility",
    "Dermatology",
  ];

  if (isLoading)
    return (
      <div className="flex justify-center h-screen items-center">
        <span className="loading loading-spinner loading-md"></span>
      </div>
    );
  return (
    <div>
      <div className="bg-lightgray h-full w-full p-6 py-8">
        <div className="bg-white overflow-x-auto rounded-[16px] p-4  ps-10 ">
          <div className="flex items-center  justify-between">
            <button onClick={handleBackNavigate} className="">
              <img src={backIcon} alt="" />
            </button>
            <h1 className="text-[32px] text-black font-bold flex-1 me-6 text-center">
              Update Doctor
            </h1>
          </div>

          {/* form and side image */}

          <div className="flex  gap-3 my-5 mt-10 flex-wrap md:flex-nowrap  w-full">
            <div className="w-full">
              {/* form */}
              <form
                onSubmit={handleSubmit(handleFormSubmit)}
                className="max-w-[513px] md:min-w-[460px] min-w-[300px]"
              >
                {/* doctorName  */}
                <div className="">
                  <input
                    {...register("doctorName", {
                      required: {
                        value: true,
                        message: "This field is required",
                      },
                      minLength: {
                        value: 3,
                        message: "Minimum length is 3 character ",
                      },
                      maxLength: {
                        value: 15,
                        message: "Minimum length is 15 character",
                      },
                    })}
                    className={` h-[45px] w-full rounded-xl border-darkstone outline-none border ps-3 text-[16px] text-gray2 ${
                      errors.doctorName && "border-red"
                    }`}
                    type="text"
                    placeholder="Enter Doctor Name"
                  />

                  {errors.doctorName && (
                    <span className="text-red ms-2">
                      {errors.doctorName.message}
                    </span>
                  )}
                </div>

                {/* experience */}
                <div className="my-5">
                  <input
                    {...register("experience", {
                      required: {
                        value: true,
                        message: "This field is required",
                      },
                      min: {
                        value: 0,
                        message: "Minimum 0 year Experience is required",
                      },
                    })}
                    className={`w-full h-[45px] rounded-xl border-darkstone outline-none border ps-3 text-[16px] text-gray2 ${
                      errors.experience && "border-red"
                    }`}
                    type="number"
                    placeholder="Enter Doctor Experience"
                  />
                  {errors.experience && (
                    <span className="text-red ms-2">
                      {errors.experience.message}
                    </span>
                  )}
                </div>

                {/* desc */}
                <div className="my-5">
                  <textarea
                    {...register("education", {
                      required: {
                        value: true,
                        message: "This field is required",
                      },
                      minLength: {
                        value: 2,
                        message: "Minimum length is 2 character ",
                      },
                    })}
                    className={`w-full resize-none pt-3 h-[112px] rounded-xl border-darkstone outline-none border ${
                      errors.education && "border-red"
                    } ps-3 text-[16px] text-gray2 `}
                    type="text"
                    placeholder="Enter Doctor Education"
                  />
                  {errors.education && (
                    <span className="text-red ms-2">
                      {errors.education.message}
                    </span>
                  )}
                </div>

                {/* featiures */}

                <div className="my-5">
                  <textarea
                    {...register("location", {
                      required: {
                        value: true,
                        message: "This field is required",
                      },
                      minLength: {
                        value: 3,
                        message: "Minimun length is 8 character ",
                      },
                    })}
                    className={`w-full resize-none pt-3 h-[112px] rounded-xl border-darkstone outline-none border ${
                      errors.location && "border-red"
                    } ps-3 text-[16px] text-gray2 `}
                    type="text"
                    placeholder="Enter Doctor Location"
                  />
                  {errors.location && (
                    <span className="text-red ms-2">
                      {errors.location.message}
                    </span>
                  )}
                </div>

                {/* diseaseHandle */}
                <div className="my-5 w-full ">
                  <div
                    className={`w-full  px-3 rounded-xl border-darkstone  border ${
                      errors.sub_category && " border-red"
                    }`}
                  >
                    <select
                      {...register("diseaseHandle", {
                        required: {
                          value: true,
                          message: "This field is required",
                        },
                      })}
                      className={` text-[16px] outline-none text-gray2 h-[45px] w-full`}
                    >
                      <option value="" selected disabled>
                        DiseaseHandle
                      </option>
                      {diseaseHandleOptions.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.sub_category && (
                    <AppFormErrorLine message={errors.sub_category.message} />
                  )}
                </div>

                {/* specialization1 */}
                <div className="my-5">
                  <input
                    {...register("specialization1", {
                      required: {
                        value: true,
                        message: "This field is required",
                      },
                    })}
                    className={`w-full h-[45px] rounded-xl border-darkstone outline-none border ps-3 text-[16px] text-gray2 ${
                      errors.specialization1 && "border-red"
                    }`}
                    type="text"
                    placeholder="Enter Doctor Specification 1"
                  />
                  {errors.specialization1 && (
                    <span className="text-red ms-2">
                      {errors.specialization1.message}
                    </span>
                  )}
                </div>
                <div className="my-5">
                  <input
                    {...register("specialization2", {
                      required: {
                        value: true,
                        message: "This field is required",
                      },
                    })}
                    className={`w-full h-[45px] rounded-xl border-darkstone outline-none border ps-3 text-[16px] text-gray2 ${
                      errors.specialization2 && "border-red"
                    }`}
                    type="text"
                    placeholder="Enter Doctor Specification 2"
                  />
                  {errors.specialization2 && (
                    <span className="text-red ms-2">
                      {errors.specialization2.message}
                    </span>
                  )}
                </div>
                <div className="my-5">
                  <input
                    {...register("specialization3", {
                      required: {
                        value: true,
                        message: "This field is required",
                      },
                    })}
                    className={`w-full h-[45px] rounded-xl border-darkstone outline-none border ps-3 text-[16px] text-gray2 ${
                      errors.specialization3 && "border-red"
                    }`}
                    type="text"
                    placeholder="Enter Doctor Specification 3"
                  />
                  {errors.specialization3 && (
                    <span className="text-red ms-2">
                      {errors.specialization3.message}
                    </span>
                  )}
                </div>

                {/* buttons */}
                <div className="my-5">
                  <button
                    type="submit"
                    className="h-[54px] rounded-xl text-white bg-darkgreen w-full"
                  >
                    {isPending ? (
                      <>
                        <div className="loading loading-spinner loading-md"></div>
                      </>
                    ) : (
                      "Update"
                    )}
                  </button>
                </div>
                <div className="my-5">
                  <button
                    type="button"
                    onClick={(e) => window.verificationModal.showModal()}
                    className="h-[54px] rounded-xl btn btn-neutral btn-outline w-full"
                  >
                    Verify
                  </button>
                </div>
              </form>
            </div>

            {/* choose image */}
            <div className="border-dashed border-l-2  ps-5 pe-3 flex flex-col  items-center  border-l-stone1">
              {/* product image */}
              <div className="h-[420px] md:min-w-[400px] min-w-[300px] rounded-xl mt-7 p-4  text-center flex flex-col justify-center items-center max-w-[453px] border border-stone2">
                {selectedImages ? (
                  <img
                    src={
                      selectedImages.url || URL.createObjectURL(selectedImages)
                    }
                    className="h-full w-full object-contain object-center "
                    alt=""
                  />
                ) : (
                  <>
                    <input
                      type="file"
                      onChange={handleImageChange}
                      ref={inputRef}
                      className="hidden"
                      doctorName=""
                      id=""
                    />
                    <button
                      onClick={handleChooseImage}
                      type="button"
                      className=" bg-gradient-to-t from-blackwhite text-white h-[55px] rounded-xl w-[253px] to-whiteblack"
                    >
                      Choose image
                    </button>
                  </>
                )}
              </div>
              {selectedImages && (
                <div className="text-center mt">
                  <button
                    onClick={(e) => setSelectedImages(null)}
                    type="button"
                    className="mt-2 text-md text-red"
                  >
                    Remove Image
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* verification modal */}

      <dialog id="verificationModal" className="modal ">
        <form method="dialog" className="modal-box  max-h-[777px] w-[656px]">
          <h3 className="font-bold text-lg text-[24px] text-center pb-4 border-b gap-16 border-dashed border-b-black  ">
            Verification Details
          </h3>
          <div className="mt-5 font-semibold px-2">
            <div className="my-[15px] flex items-center gap-2 flex-wrap lg:text-[16px] max-xl:text-[18px]">
              Doctor Name:
              {doctorName ? (
                <span className="text-base font-semibold">{doctorName}</span>
              ) : (
                <span className="text-red text-base">
                  Please enter Doctor Name!
                </span>
              )}
            </div>

            <div className="my-[15px] flex items-center gap-2 flex-wrap lg:text-[16px] max-xl:text-[18px]">
              Education:
              {education ? (
                <span className="text-base font-semibold">{education}</span>
              ) : (
                <span className="text-red text-base">
                  Please enter Education!
                </span>
              )}
            </div>

            <div className="my-[15px] flex items-center gap-2 flex-wrap lg:text-[16px] max-xl:text-[18px]">
              Experience:
              {experience ? (
                <span className="text-base font-semibold">{experience}</span>
              ) : (
                <span className="text-red text-base">
                  Please enter experience!
                </span>
              )}
            </div>

            <div className="my-[15px] flex items-center gap-2 flex-wrap lg:text-[16px] max-xl:text-[18px]">
              Location:
              {location ? (
                <span className="text-base font-semibold">{location}</span>
              ) : (
                <span className="text-red text-base">
                  Please enter Location!
                </span>
              )}
            </div>

            <div className="my-[15px] flex items-center gap-2 flex-wrap lg:text-[16px] max-xl:text-[18px]">
              DiseaseHandle:
              {diseaseHandle ? (
                <span className="text-base font-semibold">{diseaseHandle}</span>
              ) : (
                <span className="text-red text-base">
                  Please enter DiseaseHandle!
                </span>
              )}
            </div>

            <div className="my-[15px] flex items-center gap-2 flex-wrap lg:text-[16px] max-xl:text-[18px]">
              Specialization1:
              {specialization1 ? (
                <span className="text-base font-semibold">
                  {specialization1}
                </span>
              ) : (
                <span className="text-red text-base">
                  Please enter Specialization1!
                </span>
              )}
            </div>

            <div className="my-[15px] flex items-center gap-2 flex-wrap lg:text-[16px] max-xl:text-[18px]">
              Specialization2:
              {specialization2 ? (
                <span className="text-base font-semibold">
                  {specialization2}
                </span>
              ) : (
                <span className="text-red text-base">
                  Please enter Specialization2!
                </span>
              )}
            </div>
            <div className="my-[15px] flex items-center gap-2 flex-wrap lg:text-[16px] max-xl:text-[18px]">
              Specialization3:
              {specialization3 ? (
                <span className="text-base font-semibold">
                  {specialization3}
                </span>
              ) : (
                <span className="text-red text-base">
                  Please enter Specialization3!
                </span>
              )}
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="mt-3 bg-gray3 w-[285px] h-[54px] rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </form>
      </dialog>
    </div>
  );
};

export default UpdateDoctor;
