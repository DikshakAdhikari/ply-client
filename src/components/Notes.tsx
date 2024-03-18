import React, { useEffect, useState } from 'react';
import { BASE_URL } from "@/Secrets";
import { useRouter } from "next/navigation";
import MyNotes from './MyNotes';

interface Note {
  _id: string;
  title: string;
  description: string;
}

interface FormData {
  title: string;
  description: string;
}

const Notes: React.FC = () => {
  const [toggle, setToggle]= useState<boolean>(false);
  const [ifDelete, setIfDelete]= useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
  });
  const [notes, setNotes]= useState<Note[]>([]);

  const router= useRouter();

  useEffect(()=> {
    const fun = async()=> {
      const res= await fetch(`${BASE_URL}/notes/${localStorage.getItem('userId')}`,{
        method:"GET",
        headers:{
          'Content-Type': 'application/json'
        }
      });
      if(!res.ok){
        throw new Error("Network problem!")
      }
      const data= await res.json();
      setToggle(false);
      setNotes(data);
    }
    if(localStorage.getItem('token')){
      fun();
    } else {
      alert('No/Expired token, Login again!');
      router.push('/signin');
    }   
  }, [toggle]);

  const handleUpdate= (noteId: string) => {     
    localStorage.setItem('noteId', noteId);
    router.push('/edit-notes');
  }

  const handleDelete= async(noteId: string) => {
    try{
      const res= await fetch(`${BASE_URL}/notes/${noteId}`,{
        method:"DELETE",
        headers:{
          'Content-Type': 'application/json'
        }
      });
      if(!res.ok){
        throw new Error("Network problem!");
      }
      setIfDelete(!ifDelete);
      setToggle(true);
    } catch(err) {
      console.log(err); 
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fun = async()=> {
      const res= await fetch(`${BASE_URL}/notes`,{
        method:"POST",
        headers:{
          'Content-Type': 'application/json',
          'authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      if(!res.ok){
        throw new Error("Network Problem!");
      }
      const data= await res.json();

      setToggle(!toggle);
      setFormData({
        title:'',
        description:''
      });
    }
    if(localStorage.getItem('token')){
      fun();
    } else {
      router.push('/signin');
    }
  };

  const handleLogout= ()=> {
    localStorage.clear();
    alert('Logged out successfully!')
    router.push('/')
  }

  return (
    <div className='flex flex-col gap-5'>
      <div className=' flex justify-between w-[100vw] p-5 px-28'>
        <div className=' text-2xl font-semibold text-red-600 '>Note Tracker</div>
        <button onClick={handleLogout} className=' px-8 py-3 bg-cyan-500 rounded-md font-semibold text-white'>Logout</button>
      </div>
      <form className="max-w-md mx-auto mt-8" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title" className="block mb-2 font-semibold text-gray-600">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Enter title"
            required
          />
        </div>
        <div className="mt-4">
          <label htmlFor="description" className="block mb-2 font-semibold text-gray-600">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Enter description"
            rows={4}
            required
          />
        </div>
        <div className="mt-6">
          <button type="submit" className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
            Submit
          </button>
        </div>
      </form>
      <div className="flex flex-col items-center">
        <div className="text-2xl font-medium my-10">My Notes</div>
        {notes.length === 0 && <div>No notes available! Create now to see</div>}
        <div className="flex flex-wrap justify-center">
  {notes?.map((note, index) => (
    
      <div key={note._id} className="border-2 m-3 bg-yellow-100 border-gray-500 rounded-md flex flex-col justify-between h-full">
        <div className="p-5 flex-grow"> 
          <div className="font-semibold mb-3 text-xl">{note.title}</div>
          <div>{note.description}</div>
        </div>
        <div className="m-3 flex gap-3 justify-between">
          <button onClick={() => handleUpdate(note._id)} className="bg-green-600 p-2 px-5 rounded-md text-white">Edit</button>
          <button onClick={() => handleDelete(note._id)} className="bg-red-600 p-2 rounded-md text-white">Delete</button>
        </div>
      </div>

  ))}
</div>

      </div>
    </div>
  );
};

export default Notes;
