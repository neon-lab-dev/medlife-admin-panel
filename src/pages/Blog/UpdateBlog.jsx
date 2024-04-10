import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import AppFormErrorLine from "../../components/AppFromErrorLine";
import { useEffect, useRef, useState } from "react";
import { createBlog, updateBlog } from "../../api/blog";

const UpdateBlogModal = ({ data }) => {
  const queryClient = useQueryClient();
  const inputRef = useRef();

  const [selectedImage, setSelectedImage] = useState(data?.avatar?.url);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue,
  } = useForm();

  watch();

  const { mutate, isPending } = useMutation({
    mutationFn: ({ id, data }) => updateBlog({ id, data }),
    onError: (error) => {
      document.getElementById("update_blog").close();
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error,
      });
      reset();
    },
    onSuccess: (data) => {
      document.getElementById("update_blog").close();
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      Swal.fire({
        icon: "success",
        title: "Blog updated",
        text: data,
      });
      reset();
    },
  });

  const onSubmit = async (fData) => {
    const formData = new FormData();
    formData.append("title", fData.title);
    formData.append("about", fData.desc);

    if (selectedImage) {
      const blob = await fetch(selectedImage).then((r) => r.blob());
      formData.append("file", blob);
    }

    mutate({ id: data?._id, data: formData });
  };

  useEffect(() => {
    if (data) {
      setSelectedImage(data?.avatar?.url);
      setValue("title", data?.title);
      setValue("desc", data?.about);
    }
  }, [data]);

  return (
    <>
      {/*Blog Modal Start */}
      <dialog id="update_blog" className="modal">
        <div className="modal-box lg:w-[863px] lg:h-[810px] sm:h-[1/6] w-5/6 max-w-5xl h-1/2 max-h-5xl">
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => reset()}
            >
              ✕
            </button>
          </form>
          <div className="flex h-full w-full">
            <div className="w-2/5 flex justify-center items-center place-content-center">
              {selectedImage && (
                <img
                  src={selectedImage}
                  alt="Chosen"
                  className="mt-2 h-[200px] "
                />
              )}
            </div>
            <div className="border-l-2 border-dashed" />
            <div className="w-3/5">
              <div className=" flex flex-col place-content-center place-items-center">
                <form
                  className=" flex flex-col place-content-center place-items-center"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <p className="w-[324px] text-start text-black text-2xl font-semibold font-lato tracking-tight">
                    Update Blog
                  </p>
                  <input
                    ref={inputRef}
                    className="relative hidden mt-[32px] w-full h-[40px] bg-white rounded-xl border border-zinc-300 justify-start items-center opacity-40 text-sm font-light font-lato leading-[16.80px]"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setSelectedImage(reader.result);
                      };
                      if (file) {
                        // Validate file type
                        if (!["image/jpeg", "image/png"].includes(file.type)) {
                          alert("Unsupported file format (JPEG/PNG only)");
                          return;
                        }
                        // Validate file size (1MB)
                        if (file.size > 1048576) {
                          alert("File size should be less than 1MB");
                          return;
                        }
                        reader.readAsDataURL(file);
                      }
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => inputRef.current.click()}
                    className="w-full bg-slate-300 rounded-lg flex items-center justify-center p-1 mt-4 text-white"
                  >
                    Upload Image
                  </button>
                  {!selectedImage && (
                    <AppFormErrorLine
                      message="Please select an image"
                      className="self-start"
                    />
                  )}

                  <input
                    className="mt-[10px] w-[324px] h-11 pl-3 bg-white rounded-xl border border-zinc-300 justify-start items-center inline-flex placeholder:text-black opacity-40 text-sm font-light font-lato leading-[16.80px]"
                    type="text"
                    placeholder="Enter Blog Title"
                    {...register("title", {
                      required: {
                        value: true,
                        message: "Please enter code name",
                      },
                      maxLength: {
                        value: 100,
                        message: "Maximum length should be 100 characters",
                      },
                      minLength: {
                        value: 4,
                        message: "Minimum length should be 4 characters",
                      },
                    })}
                  />
                  {errors.title && (
                    <AppFormErrorLine
                      message={errors.title?.message}
                      className="self-start"
                    />
                  )}
                  <textarea
                    className="mt-[10px] w-[324px] h-[340px] pl-3 p-4 bg-white rounded-xl border border-zinc-300 placeholder:text-black opacity-40 text-sm font-light font-lato leading-[16.80px]"
                    placeholder="Enter Blog Description"
                    {...register("desc", {
                      required: {
                        value: true,
                        message: "Please enter Blog Description",
                      },
                      maxLength: {
                        value: 5000,
                        message: "Maximum length should be 1500 characters",
                      },
                      minLength: {
                        value: 500,
                        message: "Minimum length should be 500 characters",
                      },
                    })}
                  ></textarea>

                  {errors.desc && (
                    <AppFormErrorLine
                      message={errors.desc?.message}
                      className="self-start"
                    />
                  )}
                  <button className="mt-[24px] w-[324px] h-11 pl-[111px] pr-[112.44px] py-2.5 bg-slate-400 rounded-xl justify-center items-center inline-flex">
                    {isPending ? (
                      <span className="loading loading-spinner loading-md text-white"></span>
                    ) : (
                      <p className="w-[100.56px] h-6 text-center text-white text-lg font-bold font-lato leading-snug">
                        Create
                      </p>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </dialog>
      {/*create coupon Modal End */}
    </>
  );
};

export default UpdateBlogModal;
