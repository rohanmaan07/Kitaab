import React, { useState } from 'react';
import { Link } from "react-router-dom";

const ShayariCard = ({ title, content, author, imageUrl, id, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link to={`/shayar/${id}`}>
      <div
        className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-[#E50914] transition-all duration-300 group h-[380px] flex flex-col"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative h-56 overflow-hidden bg-zinc-800 flex-shrink-0">
          <img
            className={`w-full h-full object-cover transition-transform duration-500 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
            src={imageUrl}
            alt={title}
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-[#E50914] transition-colors">
            {title}
          </h3>
          
          <p className="text-gray-300 text-sm mb-4 leading-relaxed line-clamp-3 flex-1">
            "{content}"
          </p>

          <div className="flex items-center justify-between mt-auto">
            <span className="text-gray-400 text-sm italic"> {author}</span>
            <span className="text-[#E50914] font-bold transform transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

const Shayar = () => {
  const shayaris = [
    {
      id: '1',
      title: 'एक नज़्म लिखने के लिए',
      content: 'एक नज़्म लिखने के लिए मुझे औरत चाहिए..🎀',
      author: '~rohannn...',
      imageUrl: 'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=800&q=80'
    },
    {
      id: '2',
      title: "Mohabbat kyaa hai",
      content: 'Mohabbat kyaa hai? shayad "wo", Wo kyaa hai? mera khawab',
      author: "~rohannn...",
      imageUrl: 'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?w=800&q=80'
    },
    {
      id: '3',
      title: 'Uskii narazgi',
      content: 'Uskii narazgi kaa maii, kya karuu???💭',
      author: "~rohannn...",
      imageUrl: 'https://images.unsplash.com/photo-1506443432602-ac2fcd6f54e0?w=800&q=80'
    },
    {
      id: '4',
      title: "होश आया तो लगा",
      content: 'होश आया तो लगा, मैं हकीकत में हूँ या किसी ख्वाब में पहुंच चुका हूँ।',
      author: "~rohannn...",
      imageUrl: 'https://images.unsplash.com/photo-1528465424850-54d22f092f9d?w=800&q=80'
    },
    {
      id: '5',
      title: "Bulanaa mujhko",
      content: 'Bulanaa mujhko Mai aungaa jarrur Teri sagaai mai..',
      author: "~rohannn...",
      imageUrl: 'https://images.unsplash.com/photo-1517685352821-92cf88aee5a5?w=800&q=80'
    },
    {
      id: '6',
      title: "Mai aadhi raat ko",
      content: 'Mai aadhi raat ko pankhee ko dekhtaa rhta hu...',
      author: "~rohannn...",
      imageUrl: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=800&q=80'
    },
    {
      id: '7',
      title: "जिस्मानी सुकून",
      content: 'जिस्मानी सुकून को वो हमनवा समझ बैठी है, उसे मारा जाए।',
      author: "~rohannn...",
      imageUrl: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?w=800&q=80'
    },
    {
      id: '8',
      title: "तुमसे इश्क़ करना",
      content: 'तुमसे इश्क़ करना मेरा इंतख़ाब तो नहीं..🫀',
      author: "~rohannn...",
      imageUrl: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800&q=80'
    },
    {
      id: '9',
      title: "Uski dhundlii yaadein",
      content: 'Uski dhundlii yaadein yhi khi pdi hai kisii Kone mein...💭',
      author: "~rohannn...",
      imageUrl: 'https://images.unsplash.com/photo-1494887205043-c5f291293cf6?w=800&q=80'
    },
    {
      id: '10',
      title: "मैं उसकी आदतें",
      content: 'मैं उसकी आदतें अपनी आदतों में ढालना चाहता हूं...🫶🏻',
      author: "~rohannn...",
      imageUrl: 'https://images.unsplash.com/photo-1464820453369-31d2c0b651af?w=800&q=80'
    },
    {
      id: '11',
      title: "Agar wo kitaabo se",
      content: 'Agar wo kitaabo se gazle pdhne lgi, toh tera kya hoga..',
      author: "~rohannn...",
      imageUrl: 'https://images.unsplash.com/photo-1520034475321-cbe63696469a?w=800&q=80'
    },
    {
      id: '12',
      title: 'December',
      content: 'Suna hai uska janamdin December-e-23 ko aata hai',
      author: '~rohannn...',
      imageUrl: 'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?w=800&q=80'
    },
    {
      id: '13',
      title: "Wo khawaab to nahi..",
      content: 'Mai to nafsiyaat hu, kahi wo khwaab to nahi..',
      author: "~rohannn...",
      imageUrl: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=800&q=80'
    },
    {
      id: '14',
      title: 'Nikaah karna..',
      content: 'मेरे इख्तियार में नहीं तुम्हे भूल पाना "rohannnn"...',
      author: "~rohannn...",
      imageUrl: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800&q=80'
    },
    {
      id: '15',
      title: "Tum toh maahirr ho",
      content: 'Bhot farak hai mohabbat aur tawaif k samne Rone mein...',
      author: "~rohannn...",
      imageUrl: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?w=800&q=80'
    },
    {
      id: '16',
      title: "Wo Humari akhiri Chahat..",
      content: 'अगर गिर जाए तो उसके जुल्फें तो क़यामत है',
      author: "~rohannn...",
      imageUrl: 'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=800&q=80'
    },
    {
      id: '17',
      title: "Intezaar Karta Hu Abhi Bhii..",
      content: 'म से मिन्नतें खुदा से करता हूं मै तुम्हारी।।',
      author: "~rohannn...",
      imageUrl: 'https://images.unsplash.com/photo-1517685352821-92cf88aee5a5?w=800&q=80'
    },
    {
      id: '18',
      title: "Saja-e-mohabbat..",
      content: 'aaj wo kisi aur ki dulhan bn gyii...',
      author: "~rohannn...",
      imageUrl: 'https://images.unsplash.com/photo-1494887205043-c5f291293cf6?w=800&q=80'
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-semibold text-white mb-3">
            Shayari Collection
          </h1>
          <p className="text-gray-400 text-lg mb-4">
            Explore heartfelt poetry and timeless verses that touch the soul
          </p>
          <div className="h-1 w-24 bg-[#E50914] rounded-full"></div>
        </div>

        {/* Shayari Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {shayaris.map((shayari, index) => (
            <ShayariCard
              key={shayari.id}
              title={shayari.title}
              content={shayari.content}
              author={shayari.author}
              imageUrl={shayari.imageUrl}
              id={shayari.id}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shayar;
