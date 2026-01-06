import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";
import AllBooks from "./Pages/AllBooks";
import Home from "./Pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./Pages/SignUp";
import Login from "./Pages/Login";
import Cart from "./Pages/Cart";
import Profile from "./Pages/Profile";
import ViewBooks from "./Pages/ViewBooks";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "./Store/auth";
import { useEffect } from "react";
import Favourite from "./Components/Favourite";
import History from "./Components/History";
import AllOrders from "./Components/AllOrders";
import AddBooks from "./Components/AddBooks";
import UpdateBook from "./Components/UpdateBook";
import Shayar from "./Pages/Shayar";
import FullShayari from "./Pages/FullShayari";
import Upcoming from "./Components/Upcoming";
import AssistantBot from "./Components/AssistantBot";
import ShayariTimeline from "./Pages/ShayariTimeline";
import UserProfile from "./Pages/UserProfile";
import FollowersPage from "./Pages/FollowersPage";
import Explore from "./Pages/Explore";
import Notifications from "./Pages/Notifications";
import Bookmarks from "./Pages/Bookmarks";
import Messages from "./Pages/Messages";
import { SocketProvider } from "./Context/SocketContext";
import CategoryPage from "./Pages/CategoryPage";

function App() {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.role);

  useEffect(() => {
    if (
      localStorage.getItem("id") &&
      localStorage.getItem("token") &&
      localStorage.getItem("role")
    ) {
      dispatch(authActions.login());
      dispatch(authActions.changeRole(localStorage.getItem("role")));
    }
  }, []);

  return (
    <SocketProvider>
      <div className="bg-black">
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/viewDetails/:id" element={<ViewBooks />} />
          <Route path="/all-books" element={<AllBooks />} />
          <Route path="/category/:category" element={<CategoryPage />} />

          <Route path="/shayar" element={<Shayar />} />
          <Route path="/shayar/:id" element={<FullShayari />} />

          {/* Twitter Clone Routes - Only these use special layout */}
          <Route path="/timeline" element={<ShayariTimeline />} />
          <Route path="/user/:id" element={<UserProfile />} />
          <Route path="/social/:type" element={<FollowersPage />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/bookmarks" element={<Bookmarks />} />

          {/* Messages Route */}
          <Route path="/messages" element={<Messages />} />

          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/updateBook/:id" element={<UpdateBook />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/upcoming" element={<Upcoming />} />
          <Route path="/profile" element={<Profile />}>
            <Route index element={role === "user" ? <Favourite /> : <AllOrders />} />
            {role === "admin" && <Route path="addBook" element={<AddBooks />} />}
            <Route path="orderhistory" element={<History />} />
          </Route>

        </Routes>
        <AssistantBot />
        <Footer />
      </div>
    </SocketProvider>
  );
}

export default App;
