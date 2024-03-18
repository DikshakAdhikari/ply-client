import { BASE_URL } from "@/Secrets";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface FormData {
  title: string;
  description: string;
}

interface Note {
  _id: string;
  title: string;
  description: string;
}

const MyNotes: React.FC<{ toggle: boolean }> = ({ toggle }) => {
  const router = useRouter();
  const [ifDelete, setIfDelete] = useState<boolean>(false);
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const fun = async () => {
      const res = await fetch(`${BASE_URL}/notes/${localStorage.getItem('userId')}`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!res.ok) {
        throw new Error("Network problem!")
      }
      const data: Note[] = await res.json();
      console.log(data);

      setNotes(data);
    }
    if (localStorage.getItem('token')) {
      fun()
    } else {
      alert('No/Expired token, Login again!')
      router.push('/signin')
    }

  }, [toggle || ifDelete]);

  const handleUpdate = (noteId: string) => {
    localStorage.setItem('noteId', noteId);
    router.push('/edit-notes')
  }

  const handleDelete = async (noteId: string) => {
    try {
      const res = await fetch(`${BASE_URL}/notes/${noteId}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!res.ok) {
        throw new Error("Network problem!")
      }
      setIfDelete(!ifDelete);
    } catch (err) {
      console.log(err);

    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="text-2xl font-medium my-10">My Notes</div>
      <div className="flex flex-wrap justify-center">
        {notes?.map((note, index) => (
          <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 flex flex-col gap-5 p-3" key={index}>
            <div className="border-2 bg-yellow-100 border-gray-500 rounded-md flex flex-col justify-between">
              <div className="p-5">
                <div className="font-semibold mb-3 text-xl">{note.title}</div>
                <div>{note.description}</div>
              </div>
              <div className="m-3 flex justify-between">
                <button onClick={() => handleUpdate(note._id)} className="bg-green-600 p-2 px-5 rounded-md text-white">Edit</button>
                <button onClick={() => handleDelete(note._id)} className="bg-red-600 p-2 rounded-md text-white">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyNotes;
