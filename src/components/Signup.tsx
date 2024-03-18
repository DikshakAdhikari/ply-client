import { BASE_URL } from "@/Secrets";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Navbar from "./Navbar";

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [role, setRole] = useState("");
  const router= useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRole(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const res = await fetch(`${BASE_URL}/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, role:role }), 
      });
      if (!res.ok) {
        throw new Error("Network problem!");
      }
      const data = await res.json();
      localStorage.setItem("token", data.token);
      router.push('/signin')
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl mb-4 font-semibold text-gray-800 text-center">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit}>
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
    
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Role
            </label>
            <div>
              <label className="inline-flex items-center mr-4">
                <input
                  type="radio"
                  name="role"
                  value="ADMIN"
                  checked={role === "ADMIN"}
                  onChange={handleRoleChange}
                  className="form-radio text-indigo-600 h-5 w-5"
                />
                <span className="ml-2">Admin</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="NORMAL"
                  checked={role === "NORMAL"}
                  onChange={handleRoleChange}
                  className="form-radio text-indigo-600 h-5 w-5"
                />
                <span className="ml-2">Normal</span>
              </label>
            </div>
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
      <div className=" mt-3">
        Already Registered? <Link href={"/signin"}>Login of continue</Link>
      </div>
    </div>
    </>
  );
};

export default SignupPage;
