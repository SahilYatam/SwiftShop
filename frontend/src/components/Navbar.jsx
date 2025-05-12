import Input from "./Input.jsx";
import Button from "./Button.jsx";
// import {Link} from "react-router-dom"
import { FaSearch } from "react-icons/fa";
import { ShoppingCart } from "lucide-react";

const Navbar = () => {
  const aTag = [
    { id: 1, tagName: "Home" },
    { id: 2, tagName: "Deals" },
    { id: 3, tagName: "What's New" },
  ];

  const user = true;

  return (
    <header className="fixed top-0 left-0 w-full bg-transparent bg-opacity-80 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-emerald-800">
      <div className="container mx-auto px-4 py-3 relative">
        <div className="flex items-center gap-10 justify-between">
          <a href="#" className="flex left-0 items-center space-x-5">
            <span className="text-2xl font-bold text-emerald-500">
              Swift-Shop
            </span>
          </a>

          <div className="flex flex-row space-x-5 gap-5 items-center justify-center">
            <nav className="flex gap-5 items-center">
              {aTag.map((tag) => (
                <a
                  href="#"
                  className="text-white text-md hover:underline font-light"
                  key={tag.id}
                >
                  {tag.tagName}
                </a>
              ))}
            </nav>

            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 shadow-md ">
              <Input
                type="text"
                placeholder={"Search product"}
                className={
                  "bg-transparent flex-1 outline-none text-sm text-gray-700 placeholder:text-gray-500 w-[300px]"
                }
              />
              {/* Search Icon */}
              <button className=" text-black p-2  rounded-full transition cursor-pointer">
                <FaSearch className="w-4 h-4" />
              </button>
            </div>
          </div>

          {user ? (
            <div className="flex gap-5">
              <Button
                type={"button"}
                className={
                  "text-white w-27 h-9 rounded-2xl bg-transparent border border-transparet hover:border-white text-[1em]"
                }
              >
                Account
              </Button>

              <Button
                type={"button"}
                className={
                  "text-white w-27 h-9 rounded-2xl bg-transparent border border-transparet hover:border-white text-[1em]"
                }
              >
                <span className="absolute right-25 translate-x-1/2 -translate-y-1/1 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow-md">
                  0
                </span>
                <ShoppingCart
                  className="inline-block mr-1 group-hover:text-emerald-400"
                  size={20}
                />
                Cart
              </Button>
            </div>
          ) : (
            <Button
              type={"button"}
              className={
                "text-white w-27 h-9 rounded-2xl bg-transparent border border-transparet hover:border-white text-[1em]"
              }
            >
              Loing
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
