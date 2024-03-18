"use client"

import { BASE_URL } from "@/Secrets";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react"


interface pageProps{
    params: {id:string}
  }
  
  
  const page:FC<pageProps> = ({params}) => {
    const [product, setProduct]= useState({})
    const router= useRouter()

    const [selectedOption, setSelectedOption] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedOption(e.target.value);
    };
  
    const handleSubmit = async() => {
      console.log('Selected option:', selectedOption);
      try{
        const res= await fetch(`${BASE_URL}/review/update/${product._id}`,{
          method:"PUT",
          //@ts-ignore
          headers:{
            "Content-Type":"application/json",
            'authorization': localStorage.getItem("token")
          },
          body: JSON.stringify({
            status: selectedOption
          })
        });
        if(!res.ok){
          throw new Error("Network problem")
        }
        const data= await res.json()
        
        if(data){
            //@ts-ignore
      const res= await fetch(`${BASE_URL}/product/update/admin/${product.author._id}`, {
        method:"PUT",
        //@ts-ignore
        headers:{
          "Content-Type": "application/json",
          'authorization': localStorage.getItem('token')
        },
        body:JSON.stringify({
          productName:product.author.productName,productDescription:product.author.productDescription, price:product.author.price, department:product.author.department , image:product.author.image
        })
      })

      if(!res.ok){
        throw new Error('Network problem while creating blog!');
      }
      const data= await res.json()
      console.log(data);
      
        }
        
        
      }catch(err){
        console.log(err);
        
      }
    };

    useEffect(() => {
        const fetchData = async () => {
          try {
            
            const response = await fetch(`${BASE_URL}/review/pending-requests/${params.id[0]}`,{
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
            setProduct(data)
            console.log(data);
            
           setProduct(data)
          } catch (error) {
            console.error('Error fetching products:', error);
          }
        };
    
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
    
        if (token) {
         
          fetchData();
        } else {
          alert("Token not found!");
          router.push('/signin');
        }
      }, []);

    
      

    return(
        <div>
            <Navbar />
            <div className="container mx-auto mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <img src={product?.author?.image} alt={product?.author?.productName} className="w-full h-64 object-cover" />
      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-800">{product?.author?.productName}</h2>
        <p className="text-gray-600 mt-2">${product?.author?.price}</p>
        <p className="text-gray-600 mt-2">{product?.author?.productDescription}</p>
        <p className="text-gray-600 mt-2">Department: {product?.author?.department}</p>
        <div className="mt-4 flex items-center">
          <select value={selectedOption} onChange={handleChange} className="mr-2 p-2 border border-gray-300 rounded">
            <option value="">Select an option</option>
            <option value="approve">Approve</option>
            <option value="reject">Reject</option>
          </select>
          <button onClick={handleSubmit} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300">Submit</button>
        </div>
      </div>
    </div>
            </div>
        </div>
    )
  }

  export default page

