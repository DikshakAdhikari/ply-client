"use client"
import { BASE_URL } from '@/Secrets';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface FormData {
  title: string;
  description: string;
}

const EditNotes: React.FC<{ initialData: FormData; onSubmit: (data: FormData) => void }> = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState<FormData>(initialData);
  const router= useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try{
      const res= await fetch(`${BASE_URL}/notes/${localStorage.getItem('noteId')}`,{
        method:"PUT",
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify(formData)
      });
      if(!res.ok){
        throw new Error('Network problem!')
      }
      const data= await res.json()
      router.push('/my-notes')
      
    }catch(err){
      console.log(err);
      
    }
  };

  useEffect(()=> {
    const fun = async()=>{
      try{
        const res= await fetch(`${BASE_URL}/notes/particular/${localStorage.getItem('noteId')}`, {
          method:"GET",
          headers:{
            'Content-Type':'application/json'
          }
        });
        if(!res.ok){
          throw new Error("Network problem!");
        }
        const data= await res.json()
        setFormData({
          title:data.title,
          description:data.description
        })
      }catch(err){
        console.log(err);
        
      }
    }
    if(localStorage.getItem('token')){
      fun()
    }else{
      alert('Expired token, Login again!')
    }
  },[]);
 
  

  return (
    <div className=' mt-[10rem] '>
    <form className="max-w-md mx-auto mt-8" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title" className="block mb-2 font-semibold text-gray-600">
          Title:
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData?.title}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          placeholder="Enter title"
          required
        />
      </div>
      <div className="mt-4">
        <label htmlFor="description" className="block mb-2 font-semibold text-gray-600">
          Description:
        </label>
        <textarea
          id="description"
          name="description"
          value={formData?.description}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          placeholder="Enter description"
          rows={4}
          required
        />
      </div>
      <div className="mt-6">
        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
        >
          Submit
        </button>
      </div>
    </form>
    </div>
  );
};

export default EditNotes;
