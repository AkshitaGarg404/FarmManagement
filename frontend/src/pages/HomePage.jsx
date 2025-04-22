import CategoryItem from "../components/CategoryItem";

const categories = [
	{ href: "/dairy", name: "Dairy Products", imageUrl: "/dairy.jpeg" },
	{ href: "/flowers", name: "Flowers", imageUrl: "/flowers.webp" },
	{ href: "/fruits", name: "Fruits", imageUrl: "/fruits.jpeg" },
	{ href: "/grains", name: "Crops and Grains", imageUrl: "/grains.jpeg" },
	{ href: "/honey", name: "Honey and Other Products", imageUrl: "/honey.jpeg" },
	{ href: "/processed", name: "Processed Products", imageUrl: "/processed.jpeg" },
	{ href: "/vegetables", name: "Vegetables", imageUrl: "/vegetables.jpeg" },
];


const HomePage=() =>{
    return (
        <div className='relative min-h-screen text-white overflow-hidden'>
            <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
				<h1 className='text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4'>
					Explore Our Categories
				</h1>
				<p className='text-center text-xl text-gray-300 mb-12'>
					Discover the latest trends in eco-friendly fashion
				</p>

				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
					{categories.map((category) => (
						<CategoryItem category={category} key={category.name} />
					))}
				</div>

				{/* {!isLoading && products.length > 0 && <FeaturedProducts featuredProducts={products} />} */}
			</div>
        </div>
    )
}

export default HomePage;
