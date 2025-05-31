import Input from "./Input.jsx";
import Button from "./Button.jsx";
import { Link } from "react-router-dom";
import { FaSearch, FaUserCircle } from "react-icons/fa";
import { ShoppingCart } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { IoLogIn } from "react-icons/io5";
import DropdownContent from "./DropdownContent.jsx";

const Navbar = () => {
  const [isUser, setIsUser] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const aTag = [
    { id: 1, tagName: "Home" },
    { id: 2, tagName: "Deals" },
    { id: 3, tagName: "What's New" },
  ];

  return (
    <div className="relative top-0  left-0 w-full h-16 bg-transparent border-b border-white/50 ">
      <header className="mt-3 ">
        <nav className="flex justify-evenly item-center py-3 ">
          <div>
            <span className="text-3xl font-robert-medium font-bold max-sm:text-[20px] text-center">
              Swift-Shop
            </span>
          </div>

          <div className="flex gap-5 max-sm:hidden text-center">
            {aTag.map((tag) => (
              <a
                key={tag.id}
                href={tag.tagName}
                className="text-[1rem] text-center py-1 font-robert-medium gap-5 hover:underline"
              >
                {tag.tagName}
              </a>
            ))}

            <div className="flex items-center bg-gray-100 rounded-full px-4 py-1 shadow-md">
              <Input
                type="text"
                placeholder={"Search product"}
                className={
                  "bg-transparent flex-1 outline-none text-sm text-gray-700 placeholder:text-gray-500 w-[300px] mb-1"
                }
              />
              {/* Search Icon */}
              <button className=" text-black p-2  rounded-full transition cursor-pointer">
                <FaSearch className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            {isUser ? (
              <div className="flex gap-10">
                <Button
                  type={"button"}
                  onClick={() => setIsOpen(!isOpen)}
                  className="relative bg-transparent border-none p-0 pb-1 pr2 z-50"
                >
                  <FaUserCircle size={25} />
                  {isOpen && <DropdownContent dropdownRef={dropdownRef} />}
                </Button>

                <Button
                  type={"button"}
                  className="bg-transparent border-none p-0 pb-1 pr2"
                >
                  <ShoppingCart
                    className="inline-block mr-2 group-hover:text-emerald-400"
                    size={20}
                  />
                </Button>
              </div>
            ) : (
              <Link to={"/login"}>
                <Button
                  type={"button"}
                  className={
                    "text-white w-27 h-9 rounded-full bg-transparent border border-transparet hover:border-white text-[1em]"
                  }
                >
                  <IoLogIn size={20} className="mr-1" />
                  Loing
                </Button>
              </Link>
            )}
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Navbar;
