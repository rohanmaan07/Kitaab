import React from 'react';
import { Link } from "react-router-dom"; // For linking to details if needed

const ShayariCard = ({ title, content, author, imageUrl, id }) => { // Added id parameter
  return (
    <div className="w-full bg-black border border-white rounded-lg shadow-lg hover:shadow-red-500/50 transform hover:scale-105 transition-transform duration-300 overflow-hidden mb-5">
      <Link to={`/shayar/${id}`}> {/* Updated Link to use id */}
        <img
          className="w-full h-80 object-fill rounded-t-lg"
          src={imageUrl}
          alt={title}
        />
        <div className="p-4 text-white">
          <h1 className="text-lg font-semibold truncate hover:text-red-600">
            {title}
          </h1>
          <p className="text-sm text-gray-400 mt-1 leading-snug">
            "{content}"
          </p>
          <p className="mt-4 text-right text-gray-500 italic">- {author}</p>
        </div>
      </Link>
    </div>
  );
};

const Shayar = () => {
  const shayaris = [
    {
      id: '1', // Added unique ID
      title: 'December',
      content: 'Suna hai uska janamdin December-e-23 ko aata hai',
      author: 'rohannn',
      imageUrl: 'https://res.cloudinary.com/dqrxqpsyv/image/upload/v1728481342/IMG-20241009-WA0010_zqgrrw.jpg',

    },
    {
      id: '2', // Added unique ID
      title: "Wo khawaab to nahi..",
      content: 'Mai to nafsiyaat hu, kahi wo..',
      author: "~rohannn...",
      imageUrl: 'https://res.cloudinary.com/dqrxqpsyv/image/upload/v1728481591/IMG-20241009-WA0006_h7om3y.jpg',
    },
    {
      id: '3', // Added unique ID
      title: 'Nikaah karna..',
      content: 'मेरे इख्तियार में नहीं तुम्हे भूल पाना "rohannnn"...',
      author: "~rohannn...",
      imageUrl: 'https://res.cloudinary.com/dqrxqpsyv/image/upload/v1728481577/IMG-20241009-WA0011_d6mdbo.jpg',
    },
    {
      id: '4', // Added unique ID
      title: "Tum toh maahirr ho",
      content: 'Bhot farak hai mohabbat aur tawaif k samne Rone mein...',
      author: "~rohannn...",
      imageUrl: 'https://res.cloudinary.com/dqrxqpsyv/image/upload/v1728481609/IMG-20241009-WA0012_bpkzqd.jpg',
    },
    {
      id:'5',
      title: "Wo Humari akhiri Chahat..",
      content: 'अगर गिर जाए तो उसके जुल्फें तो क़यामत है',
      author: "~rohannn...",
      imageUrl: 'https://res.cloudinary.com/dqrxqpsyv/image/upload/v1728481629/IMG-20241009-WA0005_yb3qi7.jpg',
    },
    {
      id:'6',
      title: "Intezaar Karta Hu Abhi Bhii..",
      content: 'म से मिन्नतें खुदा से करता हूं मै तुम्हारी।।',
      author: "~rohannn...",
      imageUrl: 'https://res.cloudinary.com/dqrxqpsyv/image/upload/v1728481560/IMG-20241009-WA0009_lxtggn.jpg',
    },
    {
      id:'7',
      title: "Saja-e-mohabbat..",
      content: 'Suna hai  kya "rohannn" tumne aaj wo kisi aur ki dulhan bn gyii...',
      author: "~rohannn...",
      imageUrl: 'https://res.cloudinary.com/dqrxqpsyv/image/upload/v1728481546/IMG-20241009-WA0007_hsobud.jpg',
    },
  ];

  return (
    <div className="bg-balck from-gray-900 to-black h-auto flex items-center justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-8 container mx-auto">
        {shayaris.map((shayari) => (
          <ShayariCard 
            key={shayari.id} 
            title={shayari.title} 
            content={shayari.content} 
            author={shayari.author} 
            imageUrl={shayari.imageUrl} 
            id={shayari.id} // Pass the ID to the card
          />
        ))}
      </div>
    </div>
  );
};

export default Shayar;
