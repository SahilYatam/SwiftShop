import CategoryItems from "../components/CategoryItems.jsx";
import { categories } from "../data/homePage.js";

const HomePage = () => {
    return (
        <div className="relative min-h-screen overflow-hidden text-white mt-0">
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h3 className="text-center text-5xl sm:text-6xl font-bold text-white mb-5 ">
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


                <div className="card bg-base-100 w-96 shadow-sm mt-5">
                    <figure>
                        <img
                            src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                            alt="Shoes"
                        />
                    </figure>
                    <div className="card-body">
                        <h2 className="card-title">
                            Card Title
                            <div className="badge badge-secondary">NEW</div>
                        </h2>
                        <p>
                            A card component has a figure, a body part, and inside body there
                            are title and actions parts
                        </p>
                        <div className="card-actions justify-end">
                            <div className="badge badge-outline">Fashion</div>
                            <div className="badge badge-outline">Products</div>
                        </div>
                    </div>
                </div>

            </div>



        </div>
    );
};

export default HomePage;
