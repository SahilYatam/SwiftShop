import CategoryItems from "../components/CategoryItems.jsx";
import { categories } from "../data/homePage.js";

const HomePage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h3 className="text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-2">
          Explore Our Categories
        </h3>

        <p className="text-center text-xl text-gray-200 mb-12">
            Discover the latest trends in eco-friendly fashion
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((category) => (
                <CategoryItems category={category} key={category.name}/>
            ))}
        </div>

      </div>
    </div>
  );
};

export default HomePage;
