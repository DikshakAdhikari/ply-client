"use client"
import { BASE_URL } from '@/Secrets';
import Navbar from '@/components/Navbar'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const page = () => {
    const [role, setRole] = useState<string | null>("");
    const router=  useRouter();
    const [products, setProducts] = useState<any[]>([]);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(`${BASE_URL}/review/pending-requests`,{
            //@ts-ignore
            headers:{
                "Content-Type":"application/json",
                "authorization": localStorage.getItem("token")
            }
          });
          if (!response.ok) {
            throw new Error('Failed to fetch products');
          }
          const data = await response.json();
          console.log(data);
          
          setProducts(data);
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      };
  
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
  
      if (token) {
        setRole(role);
        fetchData();
      } else {
        alert("Token not found!");
        router.push('/signin');
      }
    }, []);
 
  return (
    <div>
      <Navbar />
      <div>
        <div className=' text-[2rem] font-medium'>Pending Requests</div>
        <div className="container mx-auto mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products?.map(product => (
            <div key={product.productId._id} onClick={()=> router.push(`/pending-requests/${product._id}`)} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src={product.productId.image} alt={product.productId.image} className="w-full h-64 object-cover" />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">{product.productId.productName}</h2>
                <p className="text-gray-600 mt-2">${product.productId.price}</p>
                <p className="text-gray-600 mt-2">{product.productId.productDescription}</p>
                <p className="text-gray-600 mt-2">Department: {product.productId.department}</p>
              </div>
              <div className=' my-3 flex justify-center '>
              <button className=' cursor-default rounded-lg bg-red-500 text-white py-2 px-4'>Pending</button>

              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  )
}

export default page
