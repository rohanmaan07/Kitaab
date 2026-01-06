import { Link } from "react-router-dom";

const BookCategories = () => {
  const categories = [
    {
      id: 1,
      name: "Ghazal",
      description: "Timeless expressions of love and longing",
      image: "https://m.media-amazon.com/images/I/81Bmz+dOhiL._AC_UF1000,1000_QL80_.jpg",
      books: 6
    },
    {
      id: 2,
      name: "Nazm",
      description: "Narrative poetry with depth",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQ3j6xpl6FdWYslHlaP2X7n8m1RcGfwt3N3w&s",
      books: 8
    },
    {
      id: 3,
      name: "Romantic Poetry",
      description: "Verses of love and passion",
      image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500&q=80",
      books: 8
    },
    {
      id: 4,
      name: "Sufi Poetry",
      description: "Spiritual and mystical verses",
      image: "https://images.unsplash.com/photo-1519791883288-dc8bd696e667?w=500&q=80",
      books: 8
    },
    {
      id: 5,
      name: "Revolutionary Poetry",
      description: "Voices of change and resistance",
      image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500&q=80",
      books: 8
    },
    {
      id: 6,
      name: "Best Sellers",
      description: "Most loved poetry collections",
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&q=80",
      books: 8
    }
  ];

  return (
    <div className="bg-black py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Explore Categories
          </h2>
          <p className="text-gray-400 text-lg">
            Discover poetry collections across various genres
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
              className="group relative overflow-hidden rounded-xl shadow-xl"
            >
              <div className="relative h-72 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-3xl font-bold text-white mb-2 group-hover:text-[#E50914] transition-colors duration-300">
                    {category.name}
                  </h3>

                  <p className="text-gray-100 text-sm mb-4 leading-relaxed">
                    {category.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-white/90 text-sm font-medium bg-black/30 px-3 py-1 rounded-full">
                      {category.books} Books
                    </span>
                    <span className="text-[#E50914] font-bold text-xl group-hover:translate-x-2 transition-transform duration-300">
                      →
                    </span>
                  </div>
                </div>

                <div className="absolute top-0 left-0 right-0 bottom-0 border-2 border-transparent group-hover:border-[#E50914] transition-all duration-300 rounded-xl"></div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/all-books"
            className="inline-block bg-[#E50914] px-8 py-3 rounded text-white font-semibold hover:bg-opacity-90 transition"
          >
            View All Books
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookCategories;
