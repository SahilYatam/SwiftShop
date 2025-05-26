import { CgProfile } from "react-icons/cg";
import { FiPackage } from "react-icons/fi";
import { CiGift } from "react-icons/ci";
import { MdOutlineFavoriteBorder } from "react-icons/md";
import { FaShop } from "react-icons/fa6";

const content = [
  { name: "My Profile", tag: <CgProfile size={20} /> },
  { name: "Orders", tag: <FiPackage size={20} /> },
  { name: "Whishlist", tag: <MdOutlineFavoriteBorder size={20} /> },
  { name: "Rewards", tag: <CiGift size={20} /> },
  { name: "Start Selling", tag: <FaShop size={20} /> },
];

const DropdownContent = () => {
  return (
    <div className="absolute right-1 top-3  w-48 max-h-96 bg-white text-black border border-gray-200 rounded-lg shadow-lg z-50">
      <div className="flex flex-col justify-center gap-9 py-5 px-5">
        {content.map((spanContent) => (
          <div key={spanContent.name} className="flex items-center gap-5">
            <span className="text-lg">{spanContent.tag}</span>
            <p >{spanContent.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DropdownContent;
