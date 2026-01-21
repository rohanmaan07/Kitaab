import RecentlyAdd from "./RecentlyAdd";
import PopularShayars from "../Components/PopularShayars";
import BookCategories from "../Components/BookCategories";

function Home() {
    return (
      <>
        <div className="bg-black text-white flex flex-col md:flex-row items-center justify-center">
          <div className="flex flex-col justify-center items-start text-left p-7 md:w-1/2">
            <h1 className=" lg:text-4xl font-bold mb-6 md:text-2xl mx-auto font-bold mb-6 ">
              Welcome to Kitaab..
            </h1>
            <p className=" lg:text-lg text-gray-300 mx-auto mb-1 ">
            Kisi ki yaad ne humko yun bhega diya, <br></br>
            Jaise kisi ne paani mein rang milaa diya
            </p>
            <p className="text-sm text-gray-400  ml-[10rem] mb-5">~ Ahmad Faraz</p>
            <a
              href="/all-books"
              className="block mx-auto bg-[#E50914] px-6 py-3 rounded text-white hover:bg-opacity-90 transition"
            >
              Browse Books
            </a>
          </div>
  
          <div className="h-[621px] mt-20 w-full md:w-screen bg-cover" style={{ backgroundImage: "url('/kitab.png')" }}></div>
        </div>
        
        <PopularShayars />
        <RecentlyAdd/>
        <BookCategories />
      </>
    );
  }
  
  export default Home;
  
4