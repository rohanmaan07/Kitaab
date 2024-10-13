import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const FullShayari = () => {
  const { id } = useParams();
  const [shayari, setShayari] = useState(null);
  const navigate = useNavigate();

  const shayariData = [
    {
      id: "1",
      title: "December",
      content: `Suna hai uska janamdin December-e-23 ko aata hai..

Uska asshiq usko surkh-e-Gulaab dekar manaata hai..

Humare toh abhi zakhm-e-tammana bhi khtm nhi Hui,

Usko dekho mere saamne hi apne mehboob ko sajaata hai..

Fakir bn kar majaaro mei bhatkta rhta h "rohann",

Mandiro-masjido mei sirf usi ke dua k liya apne haath uthaata hai..

Mubarak baad Dene k liye koii jariya hi nhi bacha,

Maikhane m jaakr ab wo apni yaado ko bhulaata hai..`,
      author: "~rohannn...",
    },
    {
      id: "2",
      title: "Wo khawaab to nahi..",
      content: `तुमसे इश्क़ करना मेरा इंतख़ाब तो नहीं..🫀

इतना ना पढ़ो मुझको मैं कोई किताब तो नहीं..🍂

शब-ओ-रोज़ वो मेरे पास मेरे सामने बैठी रहती है,🤲🏻

मैं तो नफसियाती हूं, कहीं  "वो" ख्वाब तो नहीं..🔪

उसके सुर्ख होठों का नशा तुझको कैसे लग गया  "rohannn" , 🥀

मै तो ज़हर पी रहा था कोई शराब तो नहीं..🥂`,

      author: "~rohannn...",
      imageUrl:
        "https://via.placeholder.com/300x200.png?text=Mohabbat+Ki+Shayari",
    },
    {
      id: "3",
      title: "Nikaah karna..",
      content: `मैं उसकी आदतें अपनी आदतों में ढालना चाहता हूं...🫶🏻

उसको darshan पसंद है तो मैं बस उसको सुनना चाहता हूं...🧸

किसी दिन वो मिले और मेरे पास बैठे तो बोलूं उससे ,🫀

ख्वाबों में नहीं हकीकत में भी तुमसे ही निकाह करना चाहता हूं...💍

मेरे इख्तियार में नहीं तुम्हे भूल पाना "rohannnn", 🤍

वो किसी की उतरन हो तो भी उसी को पहनना चाहता हूं...🥀`,
      author: "~rohannn...",
      imageUrl:
        "https://via.placeholder.com/300x200.png?text=Yaadon+Ki+Shayari",
    },
    {
      id: "4",
      title: "Tum toh maahirr ho",
      content: `Uski dhundlii yaadein yhi khi pdi hai kisii Kone mein...💭

kya-kya dastavej lgte hai kisi ka Hone mein..👀

Tum kyaa jaano "rohannn" ye ehd-e-wafa kya hota h,🥀

Bhot farak hai mohabbat aur tawaif k samne Rone mein...🫀

Jyada se jyada teraa nikaah hogaa kisi aur se,💍

Lekin tum toh maahirr ho gairo ke saath hum-bistar Hone mein.. 🖤`,
      author: "~rohannn...",
      imageUrl: "https://via.placeholder.com/300x200.png?text=Nayi+Shayari",
    },

    {
      id: "5",
      title: "Wo Humari akhiri Chahat..",
      content: `उसकी तस्वीर, तस्वीर नहीं कीमती अमानत है,🥀

अगर गिर जाए तो उसके जुल्फें तो क़यामत है,

अपनी सहेलियों के सामने उसने दावा किया कि "rohannnn" जिस्मों का शौकीन है,

और हम है कि सबको बता रखा है कि वो हमारी आखिरी चाहत है। 🫀

उसने अपने निकाह के लिए भी मेरे ही दुश्मन को चुना,

हमने भी उसके शादी का माहौल ऐसा बनाया जैसे कोई इद्दत है!!`,
      author: "~rohannn...",
      imageUrl: "https://via.placeholder.com/300x200.png?text=Nayi+Shayari",
    },
    {
      id: "6",
      title: "Intezaar Karta Hu Abhi Bhii..",
      content: `ई से इबादादात करता हूं मैं तुम्हारी।

ई से इज्जत- ए-हिफाजत करता हूं मैं तुम्हारी।

ई से इश्क करता है rohannn तुमसे,

ई से इंतजार अभी भी करता हूं मैं तुम्हारी।।।

म से मशरूफ हो गया हूं मै फिर भी,

म से मिन्नतें खुदा से करता हूं मै तुम्हारी।।

म से मेहबूब बना लिया है तुमने, तुम्हें भूलकर,

म से मुश्किले कम करता हूं मै तुम्हारी।।!`,
      author: "~rohannn...",
      imageUrl: "https://via.placeholder.com/300x200.png?text=Nayi+Shayari",
    },
    {
      id: "7",
      title: "Saja-e-mohabbat..",
      content: `Khuda aaj meharban h bola tere liye Mai kya karr saku...

Muskurate hua manga Maine apne mehboob ke saamne marr sku..

Saja-e-mohabbat krte krte saja-e-maut ki qafan bn gyii,

Suna hai  kya "rohannn" tumne aaj wo kisi aur ki dulhan bn gyii....

Mai apni gairat ke wajah se qurbaan ho gya,

Chhodo saari baato ko abse wo mere liye anjaan ho gya..`,
      author: "~rohannn...",
      imageUrl: "https://via.placeholder.com/300x200.png?text=Nayi+Shayari",
    },
  ];

  useEffect(() => {
    const foundShayari = shayariData.find((shayari) => shayari.id === id);
    setShayari(foundShayari);
  }, [id]);

  if (!shayari) {
    return <div className="text-white text-center mt-10">Loading...</div>;
  }

  return (
    <div className="bg-black min-h-screen flex flex-col items-center justify-center p-6">
      <div className="bg-black border border-white rounded-lg shadow-lg p-6 w-full md:w-2/3 lg:w-1/2">
        <h1 className="text-3xl font-bold text-[#E50914] mb-4 text-center">
          {shayari.title}
        </h1>
        <p className=" lg:text-xl text-center text-gray-300 italic whitespace-pre-line mb-6 md:text-lg">
          "{shayari.content}"
        </p>
        <p className="text-lg text-gray-400 text-right"> {shayari.author}</p>
      </div>
      <button
        onClick={() => navigate(-1)}
        className=" mt-2 bg-black text-white px-8 py-2 rounded border border-[#E50914] hover:bg-[#E50914] hover:text-white transition duration-300"
      >
        Back
      </button>
    </div>
  );
};

export default FullShayari;
