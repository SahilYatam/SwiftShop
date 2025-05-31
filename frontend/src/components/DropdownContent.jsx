import { CgProfile } from "react-icons/cg";
import { FiPackage } from "react-icons/fi";
import { MdOutlineFavoriteBorder } from "react-icons/md";
import { FaShop } from "react-icons/fa6";
import { IoIosLogOut, IoMdSettings } from "react-icons/io";

const content = [
  { name: "My Profile", tag: <CgProfile size={20} /> },
  { name: "Orders", tag: <FiPackage size={20} /> },
  { name: "Whishlist", tag: <MdOutlineFavoriteBorder size={20} /> },
  { name: "Start Selling", tag: <FaShop size={20} /> },
  { name: "Settings", tag: <IoMdSettings size={20} /> },
  { name: "Logout", tag: <IoIosLogOut size={20} /> },
];

const DropdownContent = ({ dropdownRef }) => {
  return (
    <div
      ref={dropdownRef}
      onClick={(e) => e.stopPropagation()}
      className="absolute -right-18 top-8 -z-40 w-48 max-h-96 bg-white text-black border border-gray-200 rounded-lg shadow-lg"
    >
      <div className="flex flex-col justify-center gap-4 py-5 px-5">
        {content.map((spanContent) => (
          <div
            key={spanContent.name}
            className={`flex pl-3 h-7 w-full rounded-md items-center gap-5 ${
              spanContent.name === "Logout" ? "text-red-500" : ""
            }`}
          >
            <span className="text-lg">{spanContent.tag}</span>
            <p>{spanContent.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DropdownContent;
