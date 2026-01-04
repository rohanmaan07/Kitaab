import { useSelector } from "react-redux";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";

function Layout({ children }) {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  return (
    <div className="min-h-screen bg-[#0F1419]">
      {/* Main Container */}
      <div className="max-w-[1280px] mx-auto flex relative">
        {/* Left Sidebar - Desktop Only */}
        {isLoggedIn && (
          <aside className="hidden lg:block w-[250px] fixed h-screen left-0 top-16 border-r border-zinc-800 overflow-y-auto custom-scrollbar">
            <LeftSidebar />
          </aside>
        )}

        {/* Center Content Area */}
        <main
          className={`flex-1 min-h-screen border-x border-zinc-800 ${isLoggedIn ? "lg:ml-[250px] lg:mr-[350px]" : "mx-auto max-w-[600px]"
            }`}
        >
          <div className="max-w-[600px] mx-auto">{children}</div>
        </main>

        {/* Right Sidebar - Desktop Only */}
        {isLoggedIn && (
          <aside className="hidden xl:block w-[350px] fixed h-screen right-0 top-16 overflow-y-auto custom-scrollbar">
            <RightSidebar />
          </aside>
        )}
      </div>


    </div>
  );
}

export default Layout;
