import CategoryItems from "../components/CategoryItems.jsx";
import { categories, explore } from "../data/homePage.js";

const ExploreCategory = ({ src, title, description, price }) => {
  return (
    <div className="card bg-transparent text-black border border-black w-[250px] h-[320px] shadow-sm ">
      <figure className="px-10 pt-15 flex justify-center items-center">
        <img
          src={src}
          alt={`${title} Image`}
          className="rounded-xl w-50 h-45 object-fill"
        />
      </figure>
      <div className="card-body items-center text-center">
        <h2 className="card-title">{title}</h2>
        <p> {description} </p>
        <p>{price}</p>
        <div className="card-actions">
          <button className="btn rounded-full bg-blue-500 outline-none border-none hover:bg-blue-600">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

const HomePage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden text-white mt-0">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h3 className="text-center text-5xl sm:text-6xl font-bold text-white mb-5">
          Explore Our Categories
        </h3>

        <p className="text-center text-xl text-gray-200 mb-12">
          Discover the latest trends in eco-friendly fashion
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((category) => (
            <CategoryItems category={category} key={category.name} />
          ))}
        </div>

        <div className="mt-10 bg-white rounded-full w-64 max-w-md  py-2 px-6 flex justify-center items-center">
          <span className="text-sm md:text-base text-black font-robert-medium text-center whitespace-nowrap">
            Additional items to explore
          </span>
        </div>

        <div className="w-full h-90 bg-white mx-auto pl-5 pr-5 mt-5 rounded-2xl flex flex-nowrap justify-evenly items-center gap-5 overflow-x-scroll ">
          {explore.map((expCate, index) => (
            <div key={index}>
              <ExploreCategory
                src={expCate.src}
                title={expCate.title}
                description={expCate.description}
                price={expCate.price}
              />
            </div>
          ))}
        </div>

        <div className="mt-10 bg-white rounded-full w-64 max-w-md  py-2 px-6 flex justify-center items-center">
          <span className="text-sm md:text-base text-black font-robert-medium text-center whitespace-nowrap">
            Related to items you've viewed
          </span>
        </div>

        <div className="w-full h-90 bg-white mx-auto pl-5 pr-5 mt-5 rounded-2xl flex flex-nowrap justify-evenly items-center gap-5 overflow-x-scroll">
          {explore.map((expCate, index) => (
            <div key={index}>
              <ExploreCategory
                src={expCate.src}
                title={expCate.title}
                description={expCate.description}
                price={expCate.price}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
