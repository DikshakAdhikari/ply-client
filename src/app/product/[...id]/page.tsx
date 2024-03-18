"use client"
import { ChangeEvent, FC, FormEvent, useEffect, useRef, useState } from "react"
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import gallery from '../../../(assets)/gallery.png'
import Navbar from "@/components/Navbar"
import { BASE_URL } from "@/Secrets"

interface pageProps{
    params: {id:string}
  }
  
  const page:FC<pageProps> = ({params}) => {
    const [getButton, setButton]= useState('')
    const [productName, setProductName]= useState('');
    const [price, setPrice]= useState('')
    const [productDescription, setProductDescription]= useState('')
    const [department, setDepartment]= useState('')
    const [blog, setBlog] = useState()
    const [toggle, setToggle]= useState(false)
    const [image, setImage]= useState('')
    const [error, setError]= useState('')
    const router= useRouter()
    const inputRef= useRef(null)
  const [message, setMessage]= useState('')

  const [disable, setDisable]= useState(false)

  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e:FormEvent)=> {
    e.preventDefault()

    try{
        if(localStorage.getItem('role') === "ADMIN"){
           
      //@ts-ignore
      const res= await fetch(`${BASE_URL}/product/update/${blog._id}`, {
        method:"PUT",
        //@ts-ignore
        headers:{
          "Content-Type": "application/json",
          'authorization': localStorage.getItem('token')
        },
        body:JSON.stringify({
          productName, productDescription, price, department, filename: file?.name, contentType:file?.type
        })
      })

      if(!res.ok){
        throw new Error('Network problem while creating blog!');
      }
      const data= await res.json()
    }  else {
       
        const obj = {
            productName, productDescription, price, department, image:`https://s3.ap-south-1.amazonaws.com/blog.dikshak/uploads/profile-pic/image-${file?.name}` 
        }
        const res= await fetch(`${BASE_URL}/review`, {
            method: "POST",
            //@ts-ignore
            headers:{
                "Content-Type":"application/json",
                'authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({
                obj, status:"pending", productId: params.id[0]
            })
        });

    }
      
    }catch(err){
      console.log(err);
      
    }  
  }

    

    useEffect(()=>{
      const fun =async()=> {
        try{
          const res= await fetch(`${BASE_URL}/product/${params.id}`,{
            //@ts-ignore
            headers:{
              'Content-Type': 'application/json',
              'authorization': localStorage.getItem('token')
            }
          })
          
          if(!res.ok){
            throw new Error('Network Error!')
          }
          const data= await res.json()
        //   console.log(data);
          setProductName(data.productName)
          setProductDescription(data.productDescription)
          setDepartment(data.department)
          setImage(data.image)
          setPrice(data.price)
          setBlog(data)  
          setToggle(false)
          
        }catch(err){
          console.log(err);
        }
      }
      fun()
    },[])

    useEffect(()=> {
        if(localStorage.getItem("role")=== "ADMIN"){
            setButton("Update product as admin");
        }else{
            setButton("Submit Changes for Approval")
        }    
    },[])
    
    const handleImageClick = ()=> {
      //@ts-ignore
      inputRef.current.click()
    }
    
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files !== null && e.target.files.length > 0) {
        const selectedFile = e.target.files[0];
        const allowedExtensions = ["png", "jpeg", "jpg", "svg","webp"];
        const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
      
        if (fileExtension && allowedExtensions.includes(fileExtension)) {
          setFile(selectedFile);
          setError('')
        } else {      
          console.error("Invalid file type. Please select a .png, .jpg, or .svg file.");
          setError("Invalid file type. Please select a .png, .jpg, .svg or webp file.")
          // Optionally, you can reset the file input to clear the selection
          e.target.value = '';
        }
      }
    };
  
 
  
    const sendImage = async ()=> {
      // console.log(file?.name);
      // console.log(file?.type);
      try{
        const res= await fetch(`${BASE_URL}/product/picture`, {
          method:"POST",
          //@ts-ignore
          headers: {
            'Content-Type':"application/json",
            'authorization': localStorage.getItem('token'),
          },
          body: JSON.stringify({
            filename: file?.name,
            contentType:file?.type
          })
        });
        if(!res.ok){
          throw new Error('Network problem!')
        }
        const data= await res.json()
        
        
        if(data){
          const s3PutUrl= data;
  
          const res2= await fetch(s3PutUrl, {
            method:"PUT",
            //@ts-ignore
            headers: {
              "Access-Control-Allow-Headers" : "Content-Type",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "*",
              "Content-Type": file?.type
            },
            body:file
          });
          
          if(!res2.ok){
            throw new Error("Network Problem!");
          }
          
          setDisable(true)
          setImage(`https://s3.ap-south-1.amazonaws.com/blog.dikshak/uploads/profile-pic/image-${file?.name}`)
          setMessage("Blog Picture uploaded successfully!")
          
        }else{
          setMessage("Error while uploading")
        }
        
      }catch(err){
        setDisable(false)
        setMessage("Error while uploading")
        console.log(err);
        
      } 
    }
    
    //console.log(image);
    
    if(!blog){
      return 
    }

    return (
      <div className=" h-[100vh]">
      <Navbar />
      <div className=" flex justify-center px-9  m-5">
      <div className=" w-[100%] flex ">
      <img className=" object-fill rounded-xl w-[40vw] h-[65vh]"
      src={image}
      alt="Picture of the author" 
    />
    </div>
    <form
      onSubmit={handleSubmit}
      className=" max-w-2xl mx-auto mt-8 bg-white p-8 border rounded-lg shadow-lg"
    >
      <div className="mb-4">
        <label htmlFor="file" className="block text-sm font-medium text-gray-700">
          Choose File (PNG, JPEG, SVG, WEBP.)
        </label>
        <div onClick={handleImageClick} className=' flex flex-col gap-5 items-center'>
          {file ? 
          //@ts-ignore
          <Image src={URL.createObjectURL(file)} class="signupImg" height={200} width={200} alt="gf" /> 
          //@ts-ignore
          : <Image src={image} class="signupImg" height={200} width={200} alt="gf" /> 
         }
            
        <input
        
        ref={inputRef}
          type="file"
          id="file"
          accept=".png, .jpg, .jpeg, .svg"
          onChange={handleFileChange}
          className="mt-1 p-3 hidden bg-white border w-full rounded-md "
        />
        
        </div>
      </div>
      <div className="mb-4">
      <div className=' flex justify-center flex-col items-center gap-2 m-3'>
        <button type="button" disabled={disable} onClick={sendImage} className={` ${disable ? ' bg-gray-500' : 'bg-cyan-500'} px-5 py-2 bg-cyan-500  rounded-sm text-white`}>Update</button>
        {error!="" &&  <div className=" text-red-600 font-medium">{error}</div> }
        <div className=' text-green-700 font-medium'>{message}</div>
        </div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Product Name
        </label>
        <input
        required
          type="text"
          id="title"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="mt-1 p-3 border outline-gray-600 rounded-md w-full"
          placeholder="Enter title"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          Product Description
        </label>
        <textarea
        required
          id="content"
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
          className="mt-1 p-3 border outline-gray-600 rounded-md w-full"
          placeholder="Enter blog content"
          cols={70}
          rows={5}
        ></textarea>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Price
        </label>
        <input
        required
          type="text"
          id="title"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="mt-1 p-3 border outline-gray-600 rounded-md w-full"
          placeholder="Enter title"
        />

<label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Department
        </label>
        <input
        required
          type="text"
          id="title"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="mt-1 p-3 border outline-gray-600 rounded-md w-full"
          placeholder="Enter title"
        />
      </div>
      
      <button
        type="submit"
        className="bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
      >
        {getButton}
      </button>
    </form>
    </div>
 
    </div>
     
    )
  }

  export default page