import { useEffect, useState } from "react";
import axios from "axios";
import  BookCard  from "./BookCard";

function Favourite() {
  const [fav, setFav] = useState([]);
  
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get(`https://kitaabrohan.onrender.com/api/v1/getFavouriteBooks`, { headers });
        setFav(response.data.data);
      } catch (error) {
        console.error("Failed to fetch favourite books:", error);
      }
    };

    fetch();
  }, [fav]);

  return (
    <>
    {fav && fav.length===0 &&(
      <div className="text-5xl font-semibold h-[100%] text-zinc-500 flex items-center justify-center w-full">No Favourite book added..</div>
    )}
      <div className=" lg:grid grid-cols-3 gap-4 md:grid grid-cols-1 gap-4">
      {fav && fav.map((item, i) => (
        <div key={i}>
          <BookCard  data={item} fav={true} />
        </div>
      ))}
    </div>
    </>
  
  );
}

export default Favourite;
