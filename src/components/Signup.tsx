import { BASE_URL } from "@/Secrets";
import Link from "next/link";
import React, { useState } from "react";

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit =  async(e: React.FormEvent) => {
    e.preventDefault();
    try{
      const res= await fetch(`${BASE_URL}/auth/signup`, {
        method:"POST",
        headers:{
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      if(!res.ok){
        throw new Error('Network problem!')
      }
      const data= await res.json();
      
      localStorage.setItem('token', data.token)
      
    }catch(err){
      console.log(err);
      
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl mb-4 font-semibold text-gray-800 text-center">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-700 font-semibold mb-2"
            >
              name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-semibold mb-2"
            >
              Email 
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 font-semibold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 transition duration-300"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
      <div className=" mt-3">Already Registered? <Link  href={'/signin'}>Login of continue</Link></div>
    </div>
  );
};

export default SignupPage;
