const mongoose = require("mongoose");
const Book = require("./Models/book");
const path = require("path");
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Connect to MongoDB
const conn = async () => {
  try {
    await mongoose.connect(process.env.ATLAS_DB);
    console.log("Connected to database");
  } catch (error) {
    console.log(error);
  }
};

conn();

const books = [
  // =======================
  // GHAZAL (8)
  // =======================
  {
    url: "https://rekhta.pc.cdn.bitgravity.com/Images/EBooks/small_deewan-e-ghalib-mirza-ghalib-ebooks.jpg",
    tittle: "Deewan-e-Ghalib",
    author: "Mirza Ghalib",
    price: 599,
    description: "The definitive collection of Mirza Ghalib’s ghazals. Philosophical, romantic, and intellectually dense.",
    language: "Urdu",
    category: "Ghazal"
  },
  {
    url: "https://m.media-amazon.com/images/I/61BWOG32fmL._AC_UF1000,1000_QL80_.jpg",
    tittle: "Kulliyat-e-Mir",
    author: "Mir Taqi Mir",
    price: 699,
    description: "Complete poetic works of Mir Taqi Mir, the emotional foundation of Urdu ghazal tradition.",
    language: "Urdu",
    category: "Ghazal"
  },
  {
    url: "https://m.media-amazon.com/images/I/41THD-h8sbS._SY445_SX342_FMwebp_.jpg",
    tittle: "Pratinidhi Kavitayen",
    author: "Parveen Shakir",
    price: 199,
    description: "Representative poems of Parveen Shakir in Hindi.",
    language: "Hindi",
    category: "Ghazal"
  },
  {
    url: "https://rekhta.pc.cdn.bitgravity.com/Images/EBooks/small_kulliyat-e-parveen-shakir-parveen-shakir-ebooks.jpg",
    tittle: "Kulliyat-e-Parveen Shakir",
    author: "Parveen Shakir",
    price: 451,
    description: "Complete works of Parveen Shakir, widely read and loved.",
    language: "Urdu",
    category: "Ghazal"
  },
  {
    url: "https://m.media-amazon.com/images/I/41w+9bZsBBL._SY445_SX342_QL70_FMwebp_.jpg",
    tittle: "Intikhab-e-Parveen Shakir",
    author: "Parveen Shakir",
    price: 99,
    description: "Selected verses of Parveen Shakir.",
    language: "Hindi",
    category: "Ghazal"
  },








  // =======================
  // NAZM (8)
  // =======================
  {
    url: "https://rekhta.pc.cdn.bitgravity.com/Images/EBooks/small_bang-e-dra-allama-iqbal-ebooks.jpg",
    tittle: "Bang-e-Dra",
    author: "Allama Iqbal",
    price: 649,
    description: "A landmark collection of nazms by Allama Iqbal focusing on selfhood and awakening.",
    language: "Urdu",
    category: "Nazm"
  },
  {
    url: "https://rekhta.pc.cdn.bitgravity.com/Images/EBooks/small_zarb-e-kaleem-allama-iqbal-ebooks.jpg",
    tittle: "Zarb-e-Kaleem",
    author: "Allama Iqbal",
    price: 629,
    description: "Revolutionary philosophical poetry challenging colonial thought.",
    language: "Urdu",
    category: "Nazm"
  },
  {
    url: "https://m.media-amazon.com/images/I/41+7ecVL-TL._SY445_SX342_FMwebp_.jpg",
    tittle: "Parveen Shakir Ki Nazmein",
    author: "Parveen Shakir",
    price: 1400,
    description: "A premium collection of Parveen Shakir's Nazms.",
    language: "Hindi",
    category: "Nazm"
  },
  {
    url: "https://m.media-amazon.com/images/I/612cBquV1AL._SL1350_.jpg",
    tittle: "Parveen Shakir (Hindi Edition)",
    author: "Parveen Shakir",
    price: 149,
    description: "Analysis and collection of Parveen Shakir's works.",
    language: "Hindi",
    category: "Nazm"
  },
  {
    url: "https://m.media-amazon.com/images/I/71N+tgKb3DL._SY466_.jpg",
    tittle: "Kulliyate Parveen Shakir (Hardcover)",
    author: "Parveen Shakir",
    price: 780,
    description: "Hardcover edition of the complete poetic collection.",
    language: "Urdu",
    category: "Nazm"
  },

  {
    url: "https://m.media-amazon.com/images/I/41VbLys3faL._SY445_SX342_FMwebp_.jpg",
    tittle: "Mere Dil Mere Musafir",
    author: "Faiz Ahmad Faiz",
    price: 166,
    description: "Poems of exile and travel by Faiz.",
    language: "Hindi",
    category: "Nazm"
  },
  {
    url: "https://m.media-amazon.com/images/I/81Kkfjo93bL._SY466_.jpg",
    tittle: "Best of Faiz",
    author: "Kuldip Salil",
    price: 278,
    description: "A careful selection of the best poems by Faiz.",
    language: "English/Urdu",
    category: "Nazm"
  },







  // =======================
  // ROMANTIC POETRY (8)
  // =======================
  {
    url: "https://m.media-amazon.com/images/I/615d2VJvLQL._SY466_.jpg",
    tittle: "Kulliyat-e-Ahmad Faraz",
    author: "Ahmad Faraz",
    price: 599,
    description: "Complete romantic and political poetry of Ahmad Faraz.",
    language: "Urdu",
    category: "Romantic Poetry"
  },
  {
    url: "https://rekhta.pc.cdn.bitgravity.com/Images/EBooks/small_khushbu-parveen-shakir-ebooks.jpg",
    tittle: "Khushbu",
    author: "Parveen Shakir",
    price: 549,
    description: "Groundbreaking romantic collection expressing feminine voice and vulnerability.",
    language: "Urdu",
    category: "Romantic Poetry"
  },
  {
    url: "https://rekhta.pc.cdn.bitgravity.com/Images/EBooks/small_tanha-tanha-ahmad-faraz-ebooks.jpg",
    tittle: "Tanha Tanha",
    author: "Ahmad Faraz",
    price: 549,
    description: "Introspective and emotionally restrained poetry by Ahmad Faraz.",
    language: "Urdu",
    category: "Romantic Poetry"
  },
  {
    url: "https://blog.rekhta.org/wp-content/uploads/2021/08/Ahmad-Faraz-Blog-Cover-271x271.jpg",
    tittle: "Pas-e-Aaina",
    author: "Ahmad Faraz",
    price: 579,
    description: "A mature poetic work reflecting loneliness, love, and political awareness.",
    language: "Urdu",
    category: "Romantic Poetry"
  },
  {
    url: "https://rekhta.pc.cdn.bitgravity.com/Images/EBooks/small_sad-barg-parveen-shakir-ebooks.jpg",
    tittle: "Sad Barg",
    author: "Parveen Shakir",
    price: 529,
    description: "Emotionally layered poetry dealing with separation and identity.",
    language: "Urdu",
    category: "Romantic Poetry"
  },
  {
    url: "https://rekhta.pc.cdn.bitgravity.com/Images/EBooks/small_maah-e-tamam-parveen-shakir-ebooks.jpg",
    tittle: "Mah-e-Tamam",
    author: "Parveen Shakir",
    price: 559,
    description: "A strong, self-aware poetic voice questioning love and society.",
    language: "Urdu",
    category: "Romantic Poetry"
  },
  {
    url: "https://m.media-amazon.com/images/I/41ykeWmSzoL._SY445_SX342_FMwebp_.jpg",
    tittle: "The Colours of My Heart",
    author: "Faiz Ahmad Faiz",
    price: 353,
    description: "Selected poems translated for a wider audience.",
    language: "English/Urdu",
    category: "Romantic Poetry"
  },
  {
    url: "https://m.media-amazon.com/images/I/41THD-h8sbS.jpg",
    tittle: "Lokpriya Shayar Aur Unki Shayari - Faiz",
    author: "Prakash Pandit",
    price: 160,
    description: "Popular selected poetry of Faiz Ahmad Faiz.",
    language: "Hindi",
    category: "Ghazal"
  },



  // =======================
  // REVOLUTIONARY POETRY (8)
  // =======================
  {
    url: "https://www.setuprakashan.com/wp-content/uploads/2023/08/9789389830729.jpg",
    tittle: "Nuskha-e-Haye-Wafa",
    author: "Faiz Ahmad Faiz",
    price: 599,
    description: "A seminal progressive poetry collection blending revolution, romance, and resistance.",
    language: "Urdu",
    category: "Revolutionary Poetry"
  },
  {
    url: "https://www.sufinama.org/Images/Shayar/shad-azimabadi-1.png",
    tittle: "Sarfaroshi Ki Tamanna",
    author: "Bismil Azimabadi",
    price: 549,
    description: "Iconic revolutionary poetry that became a symbol of India’s freedom struggle.",
    language: "Urdu",
    category: "Revolutionary Poetry"
  },


  {
    url: "https://m.media-amazon.com/images/I/41ZxpxcLqKL._SY445_SX342_FMwebp_.jpg",
    tittle: "Saare Sukhan Humare",
    author: "Faiz Ahmad Faiz",
    price: 362,
    description: "The complete voice of the revolution.",
    language: "Hindi",
    category: "Revolutionary Poetry"
  },
  {
    url: "https://m.media-amazon.com/images/I/41THD-h8sbS.jpg",
    tittle: "Lokpriya Shayar - Faiz",
    author: "Prakash Pandit",
    price: 160,
    description: "Selected revolutionary works.",
    language: "Hindi",
    category: "Revolutionary Poetry"
  },
















  // =======================
  // SUFI POETRY (8)
  // =======================
  {
    url: "https://m.media-amazon.com/images/I/81n0ZOHAnAL._UF1000,1000_QL80_.jpg",
    tittle: "Masnavi-e-Rumi",
    author: "Maulana Rumi",
    price: 799,
    description: "A monumental Sufi work exploring divine love, spirituality, and human consciousness.",
    language: "Persian (Urdu Translation)",
    category: "Sufi Poetry"
  },
  {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDYU8D-GYWcoarMXu4jyUHiqFqnOm0Mh7yVQ&s",
    tittle: "Kalam-e-Bulleh Shah",
    author: "Bulleh Shah",
    price: 599,
    description: "Punjabi Sufi poetry centered on divine love, self-realization, and rejection of orthodoxy.",
    language: "Punjabi (Urdu Script)",
    category: "Sufi Poetry"
  },




  {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLlhpk52GMG1BW-uBJmQEcMy-CWYe_aVPIzg&s",
    tittle: "Kulliyat-e-Sultan Bahu",
    author: "Sultan Bahu",
    price: 589,
    description: "Famous for his 'Hoo' chamois, piercing the heart with simple truth.",
    language: "Punjabi (Urdu Script)",
    category: "Sufi Poetry"
  },
  {
    url: "https://rekhta.pc.cdn.bitgravity.com/Images/EBooks/small_shayad-jaun-eliya-ebooks.jpg",
    tittle: "Shayad",
    author: "Jaun Elia",
    price: 579,
    description: "Cult classic modern poetry marked by existential despair, irony, and intellectual rebellion.",
    language: "Urdu",
    category: "Sufi Poetry"
  },
  {
    url: "https://m.media-amazon.com/images/I/81V8GnD8GmL.jpg",
    tittle: "Tanhai",
    author: "Gulzar",
    price: 569,
    description: "Minimalist modern poetry using silence, metaphor, and everyday language.",
    language: "Urdu",
    category: "Sufi Poetry"
  },
  {
    url: "https://m.media-amazon.com/images/I/41THD-h8sbS.jpg",
    tittle: "Lokpriya Shayar - Faiz",
    author: "Prakash Pandit",
    price: 160,
    description: "Modern sensibilities in classic form.",
    language: "Hindi",
    category: "Sufi Poetry"
  },

  // =======================
  // BEST SELLERS (8)
  // =======================
  {
    url: "https://m.media-amazon.com/images/I/8108GjhXa2L._AC_UF350,350_QL50_.jpg",
    tittle: "Muntakhab Kulliyat-e-Faiz",
    author: "Faiz Ahmad Faiz",
    price: 699,
    description: "Handpicked masterpieces of Faiz combining lyrical beauty with ideological depth.",
    language: "Urdu",
    category: "Best Sellers"
  },
  {
    url: "https://shayarguru.com/wp-content/uploads/Jaun-Elia-Shayari-%E0%A4%9C%E0%A5%89%E0%A4%A8-%E0%A4%8F%E0%A4%B2%E0%A4%BF%E0%A4%AF%E0%A4%BE-%E0%A4%B6%E0%A4%BE%E0%A4%AF%E0%A4%B0%E0%A5%80-2.webp",
    tittle: "Shikwa-e-Zindagi",
    author: "Jaun Elia",
    price: 649,
    description: "A philosophical exploration of life, failure, and existential conflict.",
    language: "Urdu",
    category: "Best Sellers"
  },





  {
    url: "https://m.media-amazon.com/images/I/41iXjQrDe4L.jpg",
    tittle: "Dohe Kabir",
    author: "Kabir Das",
    price: 399,
    description: "Timeless couplets of Kabir, offering wisdom on life and spirituality.",
    language: "Hindi/Urdu",
    category: "Best Sellers"
  },
  {
    url: "https://m.media-amazon.com/images/I/51YTmuKQUbL._SY445_SX342_FMwebp_.jpg",
    tittle: "Ye Meri Gazlen Ye Meri Nazme",
    author: "Ahmad Faraz",
    price: 147,
    description: "A compilation of ghazals and nazms selected by the poet himself.",
    language: "Hindi",
    category: "Best Sellers"
  },
  {
    url: "https://m.media-amazon.com/images/I/416L1jYCRiL._SY445_SX342_FMwebp_.jpg",
    tittle: "Ranjish He Sahi",
    author: "Ahmad Faraz",
    price: 275,
    description: "Popular collection of Faraz's romantic poetry in Hindi script.",
    language: "Hindi",
    category: "Best Sellers"
  },
  {
    url: "https://m.media-amazon.com/images/I/41lVLASsGaL._SY445_SX342_QL70_FMwebp_.jpg",
    tittle: "Khanabadosh",
    author: "Ahmad Faraz",
    price: 243,
    description: "Poems reflecting the nomadic soul and political exile of the poet.",
    language: "Hindi",
    category: "Best Sellers"
  },
  {
    url: "https://m.media-amazon.com/images/I/41YjgA1dR1L._SY466_.jpg",
    tittle: "Aaj ke Prasidh Shayar - Ahmad Faraz",
    author: "Ahmad Faraz",
    price: 180,
    description: "Selected famous works of Ahmad Faraz for Hindi readers.",
    language: "Hindi",
    category: "Best Sellers"
  },
  {
    url: "https://m.media-amazon.com/images/I/71N+tgKb3DL._SY466_.jpg",
    tittle: "Zindagi! E Zindagi!",
    author: "Ahmad Faraz",
    price: 240,
    description: "A profound collection exploring life's struggles and beauty.",
    language: "Hindi",
    category: "Best Sellers"
  }
];

const seedBooks = async () => {
  try {
    // Clear existing books
    await Book.deleteMany({});
    console.log("Cleared existing books");

    // Insert new books
    await Book.insertMany(books);
    console.log("✅ Successfully seeded", books.length, "books!");

    // Show category counts
    const categories = {};
    books.forEach(book => {
      categories[book.category] = (categories[book.category] || 0) + 1;
    });

    console.log("\n📚 Books by Category:");
    Object.keys(categories).forEach(cat => {
      console.log(`   ${cat}: ${categories[cat]} books`);
    });

    process.exit(0);
  } catch (error) {
    console.error("Error seeding books:", error);
    process.exit(1);
  }
};

seedBooks();
