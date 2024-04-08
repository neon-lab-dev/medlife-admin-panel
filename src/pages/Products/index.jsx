import React, { useEffect, useState } from 'react'
import Searchbar from '../../components/Searchbar'
import downloadIcon from "../../assets/icons/download.svg"
import createProductIcon from "../../assets/icons/createProduct.svg"
import filterIcon from "../../assets/icons/filter.svg"
import leftCaret from "../../assets/icons/leftCaret.svg"
import rightCaret from "../../assets/icons/rightCaret.svg"
import deleteIcon from "../../assets/icons/delete.svg"
// import { ALLPRODUCTS } from '../../assets/mock-data'
import useFilter from '../../assets/customhooks/useFilter'
import UpdateProduct from './UpdateProduct'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteProduct, getAllProducts } from '../../api/product'
import Swal from 'sweetalert2'


const Products = () => {


  // query for fetching all products from backend

  const queryClient = useQueryClient();

  const { data, isSuccess, isLoading } = useQuery({
    queryFn: getAllProducts,
    queryKey: ["products"]
  })

  // mutation for delete product
  const { isSuccess: deleteProductSuccess, mutate, isPending } = useMutation({
    mutationFn: deleteProduct,
    onSuccess: queryClient.invalidateQueries({ queryKey: ["products"] })
  })



  const [allProducts, setallProducts] = useState(data?.products)
  // 👇 for printing a data by filter or pagination 
  const [products, setProducts] = useState([])
  const [page, setPage] = useState(0)
  const [limit, setlimit] = useState(9)
  const [searchFilter, setSearchFilter] = useState()


  const deleteProductModal = (productId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        mutate(productId)
      }
    })
  }


  // pagination pre and next functions
  const handleNext = () => {
    setPage(page + 1)
  }

  const handlePre = () => {
    setPage(page - 1)
  }

  // navigate to add product
  const navigate = useNavigate()
  const handleAddProductNavigate = () => {
    navigate("/add-product")
  }
  const handleUpdateProductNavigate = (productId) => {
    navigate(`/update-product/${productId}`)
  }

  // 👇 filter data hook call 
  const filteredProductData = useFilter({ AllData: data?.products, filterFrom: ["_id", "name", "category", "discountedprice", "stock"], inpValue: searchFilter })

  useEffect(() => {
    if (searchFilter) {
      setallProducts(filteredProductData)
    } else {
      setallProducts(data?.products)
    }
    setPage(0)
  }, [searchFilter])

  // 👇 for pagination 
  useEffect(() => {
    const temp = [];
    for (let i = page * limit; i < page * 9 + limit; i++) {
      if (allProducts && allProducts[i]) {
        temp.push(allProducts[i]);
      }
    }
    setProducts(pre => temp);
  }, [page, allProducts, data]);

  useEffect(() => {
    if (isSuccess || deleteProductSuccess) {
      setallProducts(pre => data.products)
    }
  }, [isSuccess, deleteProductSuccess])

  useEffect(() => {
    if (deleteProductSuccess) {
      Swal.fire({
        title: "Deleted!",
        text: "Your product has been deleted.",
        icon: "success"
      });
      setallProducts(pre => data.products)
    }
  }, [deleteProductSuccess])


  // return <UpdateProduct />
  return (
    (isLoading || isPending || deleteProductSuccess || !allProducts) ? <div className="flex justify-center items-center h-[calc(100vh-70px)]">
      <span className="loading loading-spinner loading-md text-red"></span>
    </div>
      : <div className='bg-lightgray h-full w-full p-6 pb-11'>
        <div className="flex justify-between">
          <h1 className=' text-[32px] font-bold   text-black leading-[38.4px] '>All Products({data?.productsCount})</h1>
          <button onClick={handleAddProductNavigate} type="button" className='bg-skyblue text-[14px] rounded-md text-white w-[192px] h-[50px] flex justify-center items-center gap-3' ><img src={createProductIcon} alt="" />Create Product</button>
        </div>

        <div className="bg-white overflow-x-auto mt-3 rounded-[16px] p-4 px-5">
          {/* searchbar and download btn */}
          <div className=" justify-between flex items-center ">
            {/* Searchbar */}
            <Searchbar setSerchFilter={setSearchFilter} placeholder={"Search products"} />

            <div className="flex items-center gap-3">

              {/* downloadIcon */}
              <button className=" bg-lightgray  rounded-[6px]">
                <img src={downloadIcon} alt="" />
              </button>

            </div>
          </div>


          <div className="overflow-x-auto">
            {
              allProducts?.length > 0 ?

                <table className="table">
                  {/* head */}
                  <thead>
                    <tr>
                      <th className='text-[14px] font-bold text-black'>ID</th>
                      <th className='text-[14px] font-bold text-black'>Name</th>
                      <th className='text-[14px] font-bold text-black text-center'>Image</th>
                      <th className='text-[14px] font-bold text-black '>Category</th>
                      <th className='text-[14px] font-bold text-black'>Discount price</th>
                      <th className='text-[14px] font-bold text-black'>Stock</th>
                      <th className='text-[14px] font-bold text-black text-center'>Action</th>
                    </tr>
                  </thead>
                  <tbody>

                    {
                      products.map(item => <tr>
                        <td className='text-[14px] font-semibold text-black'>{item._id}</td>
                        <td className='text-[14px] font-semibold text-black'>{item.name}</td>
                        <td className='text-[14px] font-semibold text-black text-center'>
                          <div className="flex justify-center items-center">
                            <img className='object-contain object-center h-[93px] rounded-lg min-w-[78px] w-[78px]' src={item?.images[0]?.url} alt="" />
                          </div>
                        </td>
                        <td className='text-[14px] font-semibold text-black'>{item.category}</td>
                        <td className='text-[14px] font-semibold text-black'>₹{item.discountedprice}</td>
                        <td className='text-[14px] font-semibold text-black'>{item.stock}</td>
                        <td className='text-[14px] text-center font-semibold text-black'>
                          <div className="flex items-center justify-center gap-3">
                            <button onClick={e => handleUpdateProductNavigate(item._id)} type="button" class="btn  h-[38px] min-h-[38px] max-h-[38px]  btn-primary btn-outline">View</button>
                            <button onClick={e => {
                              deleteProductModal(item._id)
                              // mutate(item._id)
                            }} ><img src={deleteIcon} alt="" /></button>
                          </div>
                        </td>
                      </tr>)
                    }

                  </tbody>

                </table>
                : <>
                  <div className="p-8">
                    <h1 className="text-lg font-lato font-semibold">No records found</h1>
                  </div>
                </>
            }
          </div>
          <hr />
          <div className="flex items-center justify-end   gap-3 mt-3">
            <p className="font-lato font-semibold text-grey  text-[14px]">Showing {products && ((allProducts?.length === 0) ? 0 : (page === 0) ? 1 : page * limit)} - {products && (page * limit + products.length)} of {allProducts?.length}</p>
            <div className=" border-borderColor  join ">
              <button
                disabled={page === 0}
                onClick={handlePre}
                className={`border-[0.6px] rounded-l-lg  p-2  px-3  bg-smoke ${page === 0 && "opacity-55"
                  }`}
              >
                <img src={leftCaret} />
              </button>

              <button
                disabled={page === Math.ceil(allProducts?.length / limit) - 1}
                onClick={handleNext}
                className={`border-[0.6px] rounded-r-lg p-2  px-3 bg-smoke ${page === Math.ceil(allProducts?.length / limit) - 1 && "opacity-55"
                  } `}
              >
                <img src={rightCaret} alt="" />
              </button>
            </div>
          </div>

        </div>



      </div>
  )
}

export default Products
