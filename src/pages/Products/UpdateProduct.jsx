import { useNavigate, useParams } from "react-router-dom"
import backIcon from "../../assets/icons/back.svg"
import { useForm } from "react-hook-form"
import { useEffect, useRef, useState } from "react"
import { subSubcategoriesMap, subcategoriesMap, filterOptions } from "./data"
import { useQuery } from "@tanstack/react-query"
import { getProductDetail } from "../../api/product"

const UpdateProduct = () => {

    const { productId } = useParams()
    const { data, isLoading, isSuccess } = useQuery({ queryFn: () => getProductDetail(productId), })


    const { register, watch, handleSubmit, formState: { errors }, getValues, setValue, setError, clearErrors } = useForm()
    const { baseprice, discountedprice, category, name, description, features, stock, Availablecolor, specification, sub_category, size, color } = watch()
    const [categories] = useState(['Gear', 'Shoes', 'Helmets']);
    const [subcategories, setSubcategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubcategory, setSelectedSubcategory] = useState('');
    const [subSubcategories, setSubSubcategories] = useState([]);
    const [selectedSubSubcategory, setSelectedSubSubcategory] = useState('');
    const [selectedColor, setSelectedColor] = useState("")
    const [selectedAvailableColor, setSelectedAvailableColor] = useState([])
    const [selectedImages, setSelectedImages] = useState([])



    const navigate = useNavigate()
    const handleBackNagigate = () => {
        navigate("/products")
    }

    const handleFormSubmit = (data) => {
        console.log(data);
    }

    const inputRef = useRef()

    const handleImageChange = (event) => {
        const { name, files } = event.target
        if (files[0]) {
            setSelectedImages([...selectedImages, files[0]])
        }
    }
    const handleRemoveImage = (index) => {
        setSelectedImages(selectedImages.filter((item, i) => i !== index))
    }
    const handleChooseImage = () => {
        inputRef.current.click()
    }


    const handleCategoryChange = category => {
        clearErrors("category")
        if (!category) {
            setError("category", { message: "Choose a valid category" })
        }
        setValue("category", category)
        setSelectedCategory(category);
        setSubcategories(subcategoriesMap[category] || []);
        setSelectedSubcategory(''); // Reset selected subcategory when the category changes
        setSubSubcategories([]); // Reset subsubcategories when the category changes
        setSelectedSubSubcategory(''); // Reset selected subsubcategory when the category changes
    };


    const handleSubcategoryChange = subcategory => {
        clearErrors("subcategory")
        if (!subcategory) {
            setError("subcategory", { message: "Choose a valid subcategory" })
        }
        setSelectedSubcategory(subcategory);
        if (selectedCategory === 'Gear') {
            setSubSubcategories(subSubcategoriesMap[subcategory] || []);
        } else {
            setSubSubcategories([]); // Reset subsubcategories if the category is not 'Gear'
        }
        setSelectedSubSubcategory(''); // Reset selected subsubcategory when the subcategory changes
    };


    useEffect(() => {
        if (isSuccess) {
            for (const item of Object.keys(data?.product)) {
                setValue(item, data?.product[item])
            }
            setSelectedCategory(data?.product?.category)
            setSelectedSubcategory(data?.product?.sub_category)
            setSelectedSubSubcategory(data?.product?.sub_category2)
            setSelectedColor(data?.product?.color)
            setSelectedAvailableColor(data?.product?.Availablecolor.split())
        }
    }, [isSuccess])




    return (

        isLoading ? <div className="flex justify-center items-center h-[calc(100vh-70px)]">
            <span className="loading loading-spinner loading-md text-red"></span>
        </div>

            : <div>


                <div className='bg-lightgray h-full w-full p-6 py-8'>

                    <div className="bg-white overflow-x-auto rounded-[16px] p-4  ps-10 ">

                        <div className="flex items-center  justify-between">
                            <button onClick={handleBackNagigate} className=""><img src={backIcon} alt="" /></button>
                            <h1 className="text-[32px] text-black font-bold flex-1 me-6 text-center">Update Product</h1>
                        </div>

                        {/* form and side image */}

                        <div className="flex  gap-3 my-7 mt-6 flex-wrap md:flex-nowrap  w-full">
                            <div className="w-full">
                                <div className="flex  gap-3 my-5 mt-10 flex-wrap md:flex-nowrap  w-full">
                                    <div className="w-full">
                                        {/* form */}
                                        <form onSubmit={handleSubmit(handleFormSubmit)} className='max-w-[513px] md:min-w-[460px] min-w-[300px]'>

                                            {/* name  */}
                                            <div className="">
                                                <input {...register("name",
                                                    {

                                                        required: { value: true, message: "This field is required" },
                                                        minLength: { value: 3, message: "Minimum length is 3 character " },
                                                        maxLength: { value: 15, message: "Minimum length is 15 character" }
                                                    })}

                                                    className={` h-[45px] w-full rounded-xl border-darkstone outline-none border ps-3 text-[16px] text-gray2 ${errors.name && "border-red"}`} type="text" placeholder="Product Name" />

                                                {errors.name && <span className='text-red ms-2'>{errors.name.message}</span>}
                                            </div>

                                            {/* desc */}
                                            <div className="my-5">
                                                <textarea
                                                    {...register("description", {
                                                        required: { value: true, message: "This field is required" },
                                                        minLength: { value: 8, message: "Minimum length is 8 character " },
                                                    })}
                                                    className={`w-full resize-none pt-3 h-[112px] rounded-xl border-darkstone outline-none border ${errors.description && "border-red"} ps-3 text-[16px] text-gray2 `} type="text" placeholder="Product Description" />
                                                {errors.description && <span className='text-red ms-2'>{errors.description.message}</span>}
                                            </div>

                                            {/* featiures */}
                                            <div className="my-5">
                                                <textarea
                                                    {...register("keyFeatures", {
                                                        required: { value: true, message: "This field is required" },
                                                        minLength: { value: 8, message: "Minimun length is 8 character " },
                                                    })}
                                                    className={`w-full resize-none pt-3 h-[112px] rounded-xl border-darkstone outline-none ${errors.keyFeatures && "border-red"} border ps-3 text-[16px] text-gray2 `} type="text" placeholder="Product key featured" />
                                                {errors.keyFeatures && <span className='text-red ms-2'>{errors.keyFeatures.message}</span>}
                                            </div>

                                            {/* specification */}
                                            <div className="my-5">
                                                <textarea
                                                    {...register("specification", {
                                                        required: { value: true, message: "This field is required" },
                                                        minLength: { value: 8, message: "Minimun length is 8 character " },
                                                    })}
                                                    className={`w-full resize-none pt-3 h-[112px] rounded-xl border-darkstone outline-none border ${errors.specification && "border-red"} ps-3 text-[16px] text-gray2 `} type="text" placeholder="Product Specification" />
                                                {errors.specification && <span className='text-red ms-2'>{errors.specification.message}</span>}
                                            </div>

                                            {/* baseprice */}
                                            <div className="my-5">
                                                <input
                                                    {...register("baseprice", {
                                                        required: { value: true, message: "This field is required" },
                                                    })}
                                                    className={`w-full h-[45px] rounded-xl border-darkstone outline-none border ps-3 text-[16px] text-gray2 ${errors.baseprice && "border-red"}`} type="number" placeholder="Base Price" />
                                                {errors.baseprice && <span className='text-red ms-2'>{errors.baseprice.message}</span>}
                                            </div>

                                            {/* discountprice */}
                                            <div className="my-5">
                                                <input
                                                    {...register("discountedprice", {
                                                        required: { value: true, message: "This field is required", },
                                                    })}
                                                    onChange={e => {
                                                        clearErrors("discountedprice")
                                                        if (baseprice < +e.target.value) {
                                                            setError("discountedprice", { message: "Discount price should be less than the base price" })
                                                        }
                                                    }}
                                                    className={`w-full h-[45px] rounded-xl border-darkstone outline-none border ps-3 text-[16px] text-gray2 ${errors.discountedprice && "border-red"}`} type="number" placeholder="Discounted Price" />
                                                {errors.discountedprice && <span className='text-red ms-2'>{errors.discountedprice.message}</span>}
                                            </div>

                                            {/* stock */}
                                            <div className="my-5">
                                                <input
                                                    {...register("stock", {
                                                        required: { value: true, message: "This field is required" },
                                                    })}
                                                    className={`w-full h-[45px] rounded-xl border-darkstone outline-none border ps-3 text-[16px] text-gray2 ${errors.stock && "border-red"}`} type="number" placeholder="Stock" />
                                                {errors.stock && <span className='text-red ms-2'>{errors.stock.message}</span>}
                                            </div>

                                            {/* category */}
                                            <div className="my-5 w-full ">
                                                <div className={`${errors.category && "border-red"} w-full  px-3 rounded-xl border-darkstone   border`}>
                                                    <select
                                                        {...register("category", { required: { value: true, message: "This field is required" } })}
                                                        value={selectedCategory}
                                                        onChange={e => handleCategoryChange(e.target.value)}
                                                        className={` text-[16px] outline-none text-gray2 h-[45px] w-full ${errors.category && " border-red"}`}
                                                    >
                                                        <option value="">Category</option>
                                                        {categories.map(item => (
                                                            <option key={item} value={item}>
                                                                {item}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                {errors.category && <span className='text-red ms-2'>{errors.category.message}</span>}
                                            </div>


                                            <div className="my-5 w-full ">
                                                <div className={`w-full  px-3 rounded-xl border-darkstone  border ${errors.sub_category && " border-red"}`}>
                                                    <select
                                                        {...register("sub_category", { required: { value: true, message: "This field is required" } })}
                                                        value={selectedSubcategory}
                                                        disabled={!category}
                                                        onChange={e => handleSubcategoryChange(e.target.value)}
                                                        className={` text-[16px] outline-none text-gray2 h-[45px] w-full`}
                                                    >
                                                        <option value="">Subcategory</option>
                                                        {subcategories.map(item => (
                                                            <option key={item} value={item}>
                                                                {item}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                {errors.sub_category && <span className='text-red ms-2'>{errors.sub_category.message}</span>}
                                            </div>



                                            {
                                                selectedCategory === "Gear" && (
                                                    <div className="my-5 ">

                                                        <div className={`w-full  px-3 rounded-xl border-darkstone  border ${errors.sub_category && " border-red"}`}>
                                                            <select
                                                                {...register("sub_category2", { required: { value: selectedCategory === "Gear", message: "This field is required" } })}

                                                                focusBorderColor="purple.500"
                                                                value={selectedSubSubcategory}
                                                                onChange={e => {
                                                                    clearErrors("sub_category2")
                                                                    if (!e.target.value) {
                                                                        setError("sub_category2", { message: "Choose valid Subsubcategory" })
                                                                    }
                                                                    setSelectedSubSubcategory(e.target.value)
                                                                }}
                                                                className={` text-[16px] outline-none text-gray2 h-[45px] w-full ${errors.sub_category2 && " border-red"}`}
                                                                disabled={!selectedSubcategory} // Disable the subsubcategory select until a subcategory is selected
                                                            >
                                                                <option value="">SubSubcategory</option>
                                                                {subSubcategories.map(item => (
                                                                    <option key={item} value={item}>
                                                                        {item}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        {errors.sub_category2 && <span className='text-red ms-2'>{errors.sub_category2.message}</span>}
                                                    </div>
                                                )
                                            }
                                            {/* size */}
                                            {/* <div className="my-5">
                                <input
                                    {...register("size", {
                                        required: { value: true, message: "This field is required" },
                                    })}
                                    className={`w-full h-[45px] rounded-xl border-darkstone outline-none border ps-3 text-[16px] text-gray2 ${errors.size && "border-red"}`}
                                    type="text" placeholder="Size/Type" />
                                {errors.size && <span className='text-red ms-2'>{errors.size.message}</span>}
                            </div> */}

                                            <div className="my-5 ">

                                                <div className={`w-full  px-3 rounded-xl border-darkstone  border ${errors.sub_category && " border-red"}`}>

                                                    <select
                                                        // disabled={!sub_category}
                                                        {...register("size", { value: true })}
                                                        onChange={e => {
                                                            clearErrors("size")
                                                            if (!e.target.value) {
                                                                setError("size", { message: "Please Choose valid size" })
                                                            }
                                                            setValue("size", e.target.value)
                                                        }}
                                                        className={` text-[16px] outline-none text-gray2 h-[45px] w-full ${errors.size && " border-red"}`} name="" id="">

                                                        <option selected value={""} >Choose Size</option>
                                                        {/* category filter */}

                                                        {
                                                            category && filterOptions(selectedCategory, selectedSubcategory, selectedSubSubcategory).map((item, i) => <option key={i} value={item}>{item}</option>)
                                                        }
                                                    </select>
                                                </div>
                                            </div>

                                            {/* choose color */}
                                            <div className="my-5 px-3">
                                                <div className="">
                                                    <div className='flex justify-between'>
                                                        <div className='flex items-center gap-2'>Choose color: <div style={{ backgroundColor: selectedColor }} className='h-6 w-6 rounded-full'></div> </div>
                                                        <label className={`bg-gray-50  border cursor-pointer border-borderColor flex  rounded-full justify-center items-center h-6 w-6`} type='button' htmlFor="colorInput">
                                                            +
                                                            <input onChange={e => setSelectedColor(e.target.value)} className=' opacity-0 w-0 h-0' type="color" name="" id="colorInput" />
                                                        </label>
                                                    </div>
                                                    {
                                                        size && !selectedColor && <span className='text-red'>Please select color</span>
                                                    }

                                                </div>
                                            </div>




                                            {/* Available color */}
                                            <div className="px-3">
                                                <div className='flex justify-between'>
                                                    Available color:
                                                    <div className="ps-4 flex-1 flex items-center gap-5 flex-wrap">
                                                        {
                                                            selectedAvailableColor.map((item, i) => <>

                                                                <div style={{ backgroundColor: item }} className="relative h-6 w-6 border-borderColor rounded-full border">
                                                                    <button onClick={e => setSelectedAvailableColor(selectedAvailableColor.filter((col, ind) => ind !== i))} type='button' className='-top-3 text-red -right-2 absolute'>x</button>
                                                                </div>
                                                            </>)
                                                        }
                                                    </div>

                                                    <label style={{ backgroundColor: selectedColor }} className={`bg-gray-50  border ${selectedColor ? "cursor-pointer" : ""}  border-borderColor flex  rounded-full justify-center items-center h-6 w-6`} type='button' htmlFor="availableColorInput">
                                                        +
                                                        <input
                                                            disabled={!selectedColor}
                                                            color={selectedColor}
                                                            value={selectedColor}
                                                            onChange={e => setSelectedAvailableColor([...selectedAvailableColor, e.target.value])}
                                                            className=' opacity-0 w-0 h-0' type="color" id="availableColorInput" />
                                                    </label>
                                                </div>
                                            </div>
                                            {selectedColor && selectedAvailableColor && selectedAvailableColor.length === 0 && <span className='text-red ms-2'>Please select color</span>}
                                            {/* <input type="text" placeholder="" /> */}




                                            {/* buttons */}
                                            <div className="my-5">
                                                <button type="submit" className="h-[54px] rounded-xl text-white bg-darkgreen w-full">
                                                    {
                                                        false ? <>
                                                            <div className="loading loading-spinner loading-md"></div>
                                                        </>
                                                            : "Create"
                                                    }
                                                </button>
                                            </div>
                                            <div className="my-5">
                                                <button
                                                    type='button'
                                                    onClick={e => window.verificationModal.showModal()}
                                                    className="h-[54px] rounded-xl btn btn-neutral btn-outline w-full">Verify</button>
                                            </div>
                                        </form>
                                    </div>

                                    {/* choose image */}
                                    <div className="border-dashed border-l-2  ps-5 pe-3 flex flex-col  items-center  border-l-stone1">
                                        {/* product image */}
                                        <div className="h-[420px] md:min-w-[400px] min-w-[300px] rounded-xl mt-7  text-center flex flex-col justify-center items-center max-w-[453px] border border-stone2">
                                            <input
                                                type="file"
                                                // {...register("url", { required: true })}
                                                onChange={handleImageChange}
                                                ref={inputRef}
                                                className='hidden' name="" id="" />
                                            <button disabled={selectedImages.length >= 4} onClick={handleChooseImage} type="button" className=" bg-gradient-to-t from-blackwhite text-white h-[55px] rounded-xl w-[253px] to-whiteblack">
                                                Choose image</button>

                                            {selectedImages.length === 4 && <span className='text-red font-medium '>You can select only 4 image</span>}

                                        </div>
                                        {/* selected image */}
                                        <div className="flex flex-wrap mt-10 gap-6">
                                            {
                                                selectedImages && selectedImages.map((item, index) => <div className='relative'>
                                                    <button onClick={() => { handleRemoveImage(index) }} className='absolute -right-4 text-xl rounded-full   text-red top-0'>x</button>
                                                    <img className='min-h-52 max-h-52 max-w-44 min-w-44 object-contain object-center rounded-lg' src={URL.createObjectURL(item)} alt="" />
                                                </div>)
                                            }
                                        </div>

                                    </div>


                                </div>
                            </div>
                            {/* 
                   
 */}

                        </div>

                    </div>

                    {/* verification modal */}



                    <dialog dialog id="verificationModal" className="modal " >
                        <form method="dialog" className="modal-box  max-h-[777px] w-[656px]">
                            <h3 className="font-bold text-lg text-[24px] text-center pb-4 border-b gap-16 border-dashed border-b-black  ">Verification Details</h3>
                            <div className="mt-5 font-semibold px-2">

                                <div className='my-[15px] flex items-center gap-2 flex-wrap lg:text-[16px] max-xl:text-[18px]'>Product Name:
                                    {name ? <span className='text-base font-semibold'>{name}</span> : <span className='text-red text-base'>Please enter Name!</span>}
                                </div>

                                <div className='my-[15px] flex items-center gap-2 flex-wrap lg:text-[16px] max-xl:text-[18px]'>Desciption:
                                    {description ? <span className='text-base font-semibold'>{description}</span> : <span className='text-red text-base'>Please enter Description!</span>}
                                </div>

                                <div className='my-[15px] flex items-center gap-2 flex-wrap lg:text-[16px] max-xl:text-[18px]'>Base Price:
                                    {baseprice ? <span className='text-base font-semibold'>{baseprice}</span> : <span className='text-red text-base'>Please enter Baseprice!</span>}
                                </div>

                                <div className='my-[15px] flex items-center gap-2 flex-wrap lg:text-[16px] max-xl:text-[18px]'>Discount Price:
                                    {discountedprice ? <span className='text-base font-semibold'>{discountedprice}</span> : <span className='text-red text-base'>Please enter Discountprice!</span>}
                                </div>

                                <div className='my-[15px] flex items-center gap-2 flex-wrap lg:text-[16px] max-xl:text-[18px]'>Stock:
                                    {stock ? <span className='text-base font-semibold'>{stock}</span> : <span className='text-red text-base'>Please enter Stock!</span>}
                                </div>

                                <div className='my-[15px] flex items-center gap-2 flex-wrap lg:text-[16px] max-xl:text-[18px]'>Category:
                                    {category ? <span className='text-base font-semibold'>{category}</span> : <span className='text-red text-base'>Please enter Category!</span>}
                                </div>

                                <div className='my-[15px] flex items-center gap-2 flex-wrap lg:text-[16px] max-xl:text-[18px]'>Sub Category:
                                    {sub_category ? <span className='text-base font-semibold'>{sub_category}</span> : <span className='text-red text-base'>Please enter Subcategory!</span>}
                                </div>

                                <div className='my-[15px] flex items-center gap-2 flex-wrap lg:text-[16px] max-xl:text-[18px]'>Size/Type:
                                    {size ? <span className='text-base font-semibold'>{size}</span> : <span className='text-red text-base'>Please enter size!</span>}
                                </div>

                                <div className='my-[15px] flex items-center gap-2 flex-wrap lg:text-[16px] max-xl:text-[18px]'>Color:
                                    {color ? <span className='text-base font-semibold'>{color}</span> : <span className='text-red text-base'>Please enter color!</span>}
                                </div>

                                {/* <div className='my-[15px] flex items-center gap-2 flex-wrap lg:text-[16px] max-xl:text-[18px]'>Available Color: {Availablecolor ? <span className='text-base font-semibold'>{Availablecolor.joint()}</span> : <span className='text-red text-base'>Please enter Availabecolor!</span>} */}
                                {/* </div> */}

                                <div className="text-center">
                                    <button type="submit" className="mt-3 bg-gray3 w-[285px] h-[54px] rounded-xl" >Close</button>
                                </div>
                            </div>

                        </form>
                    </dialog>





                </div>
            </div>



    )
}

export default UpdateProduct