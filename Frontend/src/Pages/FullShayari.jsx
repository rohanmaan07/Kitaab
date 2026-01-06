import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const FullShayari = () => {
  const { id } = useParams();
  const [shayari, setShayari] = useState(null);
  const navigate = useNavigate();

  const shayariData = [
    {
      id: "1",
      title: "एक नज़्म लिखने के लिए",
      image:
        "https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=800&q=80",
      content: `एक नज़्म लिखने के लिए मुझे औरत चाहिए..🎀

हुबहु उस शख़्स जैसी सूरत चाहिए..🫂

ना कोई शोर हो, और ना कोई दस्तक हो,🌷

उसके साथ खाली कमरे में फुरसत चाहिए..👀

चूड़ियां तो ले आया मैं उसके ख़ातिर ,"rohannn" 🌹

लेकिन उसकी कलाई पकड़ने के लिए हिम्मत चाहिए..🙈

उसके बदन को पूरे तरीके से तराशने के लिए,🌙

मुझे उसकी रजामंदी और लहज़े में नज़ाकत चाहिए..🥀`,
      author: "~rohannn...",
    },
    {
      id: "2",
      title: "Mohabbat kyaa hai",
      image:
        "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?w=800&q=80",
      content: `Mohabbat kyaa hai? shayad "wo",

Wo kyaa hai? mera khawab,

Khawab kya hai? tript hona,

Tript kya hai? meri mohabbat,

Mohabbat kyaa hai? shayad "wo"..🥀

Wo kyaa hai? ik sukoon,

Sukoon kya hai? uski khamoshi,

Khamoshi kyaa hai? Bss ek ehsaas,

Ehsaas kya hai? usse mohabbat,

Mohabbat kyaa hai? shayad "wo"..🤍`,
      author: "~rohannn...",
    },
    {
      id: "3",
      title: "Uskii narazgi",
      image:
        "https://images.unsplash.com/photo-1506443432602-ac2fcd6f54e0?w=800&q=80",
      content: `Uskii narazgi kaa maii, kya karuu???💭

Siwaay ehtraam ke maii, kya karuu??🌙

Mujhe toh milnaa haii uss shaqss se,🩷

Wo mujhe dekhna nahi chahti toh mai, kya karuu??🎀

Usko chahiye mujhse mohabbat "rohannnn",🤌🏻

Lekin mujhko jism ki latt lag chuki h toh mai, kya karuu??🫀

Meri aarzoo hai ki wo aajayee wapas mere paas,🍂

Lekin meri duaa qabool ni Hoti toh mai, kya karuu??🧿`,
      author: "~rohannn...",
    },
    {
      id: "4",
      image:
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
      title: "होश आया तो लगा",
      content: `होश आया तो लगा, मैं हकीकत में हूँ या किसी ख्वाब में पहुंच चुका हूँ।

उसे मंडप में ले जाया जा रहा है, न जाने मैं कहाँ पहुंच चुका हूँ।

किसी अंजाने के हाथों में नारियल, और उसके कांपते हुए हाथ,

वो दुल्हन के कपड़ो में है, शायद मैं उसकी शादी तक पहुंच चुका हूँ।

आंसू बहते गये, रस्में पूरी होती रहीं और रात भी ढलने लगी,

ये सब अपनी आंखों से देखकर, मै मफ़लूजी में पहुंच चुका हूँ।

अब तो उसके माथे में सिंदूर और कलाई में कंगन है "rohannnn",

चार सालों के इंतज़ार में, मैं दर्द की कब्र तक पहुंच चुका हूँ।`,
      author: "~rohannn...",
    },
    {
      id: "5",
      image:
        "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&q=80",
      title: "Bulanaa mujhko",
      content: `Bulanaa mujhko Mai aungaa jarrur Teri sagaai mai..

Mere dil ka kya hai mai fek dunga usko khaai mai..

Ek toh mere imtehan, upr se tera Janamdin,

Kaatkar lagaa de khanjar tu meri kalaai Mai..

puchnaa usse kya tofa diya hai uske mehboob ne,

Koi toh bola Bss thi ek raat tere raqeeb ke rajaai Mai..

Tune kya December December lgaa rkha hai rohannn,

bss tu pdhta jaa duaa uski bhalaayi mai..`,
      author: "~rohannn...",
    },
    {
      id: "6",
      title: "Mai aadhi raat ko",
      image:
        "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=800&q=80",
      content: `Mai aadhi raat ko pankhee ko dekhtaa rhta hu...

Tu kyaa kr rhi hogi iss waqt bss yhi sochtaa rhta hu...

Ab toh dhoop kii aas krengee log iss sard mausam mei,

Mai toh bagair kisi jism ko odhee sotaa rhta hu...

Jaane de, Usee jaane de apne zehan se "rohannn",

 ab toh tawaif k saamne mai apni hawas naaptaa rhta hu..

Tu itnaa bhi khvaar na ho ki log tere badan ko hi chahee,

Bass isii darr se mai tujhe harr galiyon mei dhundtaa rhta hu...`,
      author: "~rohannn...",
    },
    {
      id: "7",
      title: "जिस्मानी सुकून",
      image:
        "https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?w=800&q=80",
      content: `जिस्मानी सुकून को वो हमनवा समझ बैठी है, उसे मारा जाए।

कई पागलों को इश्क़ ने ठिकानें लगाए है जो ना लगा उसे मारा जाए।

सुना है उसको शौक है मेहंदी लगाने के,

जिसका नाम होगी उसकी हथेली पर, काश वो मारा जाए।

सजी होगी वो दुलहन बनकर अपने निकाह के लिए,

भरी बारात में उसके होने वाला शौहर मारा जाए।

उसका मनपनसंदीदा रंग सुफैद है,

क्यों ना ये उसका मुस्तकबिल बनाया जाए, काश वो मारा जाए।।

नज्में-गजलें लिखने के बहाने ना जाने कितनी बद्दुआएं देदी तुमने "rohannn"

छोड़ो सारी बातों को उससे पहले ये नफसियाती-कमज़र्फ मारा जाए।।`,
      author: "~rohannn...",
    },
    {
      id: "8",
      title: "तुमसे इश्क़ करना",
      image:
        "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800&q=80",
      content: `तुमसे इश्क़ करना मेरा इंतख़ाब तो नहीं..🫀

इतना ना पढ़ो मुझको मैं कोई किताब तो नहीं..🍂

शब-ओ-रोज़ वो मेरे पास मेरे सामने बैठी रहती है,🤲🏻

मैं तो नफसियाती हूं, कहीं  "वो" ख्वाब तो नहीं..🔪

उसके सुर्ख होठों का नशा तुझको कैसे लग गया  "rohannn" , 🥀

मै तो ज़हर पी रहा था कोई शराब तो नहीं..🥂`,
      author: "~rohannn...",
    },
    {
      id: "9",
      title: "Uski dhundlii yaadein",
      image:
        "https://images.unsplash.com/photo-1494887205043-c5f291293cf6?w=800&q=80",
      content: `Uski dhundlii yaadein yhi khi pdi hai kisii Kone mein...💭

kya-kya dastavej lgte hai kisi ka Hone mein..👀

Tum kyaa jaano "rohannn" ye ehd-e-wafa kya hota h,🥀

Bhot farak hai mohabbat aur tawaif k samne Rone mein...🫀

Jyada se jyada teraa nikaah hogaa kisi aur se,💍

Lekin tum toh maahirr ho gairo ke saath hum-bistar Hone mein.. 🖤`,
      author: "~rohannn...",
    },
    {
      id: "10",
      title: "मैं उसकी आदतें",
      image:
        "https://images.unsplash.com/photo-1464820453369-31d2c0b651af?w=800&q=80",
      content: `मैं उसकी आदतें अपनी आदतों में ढालना चाहता हूं...🫶🏻

उसको darshan पसंद है तो मैं बस उसको सुनना चाहता हूं...🧸

किसी दिन वो मिले और मेरे पास बैठे तो बोलूं उससे ,🫀

ख्वाबों में नहीं हकीकत में भी तुमसे ही निकाह करना चाहता हूं...💍

मेरे इख्तियार में नहीं तुम्हे भूल पाना "rohannnn", 🤍

वो किसी की उतरन हो तो भी उसी को पहनना चाहता हूं...🥀`,
      author: "~rohannn...",
    },
    {
      id: "11",
      title: "Agar wo kitaabo se",
      image:
        "https://images.unsplash.com/photo-1520034475321-cbe63696469a?w=800&q=80",
      content: `Agar wo kitaabo se gazle pdhne lgi , toh tera kya hoga..

Husn ke naam parr mohabbat krne lgi, toh tera kya hogaa..

Uska naam kisi ne  zameen par likha tha  aur wo banjar ho gyi,

Socho agr wo "rohannn" ke zehan m basne lgi , toh tera kya hoga...

Matt kr gairo k saamne uski tarafdaari ,

Tere  alawa agr wo kisi or ki bahon m sone lagi, toh tera kya hoga...`,
      author: "~rohannn...",
    },
    {
      id: "12",
      title: "December",
      image:
        "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?w=800&q=80",
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
      id: "13",
      title: "Wo khawaab to nahi..",
      image:
        "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=800&q=80",
      content: `तुमसे इश्क़ करना मेरा इंतख़ाब तो नहीं..🫀

इतना ना पढ़ो मुझको मैं कोई किताब तो नहीं..🍂

शब-ओ-रोज़ वो मेरे पास मेरे सामने बैठी रहती है,🤲🏻

मैं तो नफसियाती हूं, कहीं  "वो" ख्वाब तो नहीं..🔪

उसके सुर्ख होठों का नशा तुझको कैसे लग गया  "rohannn" , 🥀

मै तो ज़हर पी रहा था कोई शराब तो नहीं..🥂`,
      author: "~rohannn...",
    },
    {
      id: "14",
      title: "Nikaah karna..",
      image:
        "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800&q=80",
      content: `मैं उसकी आदतें अपनी आदतों में ढालना चाहता हूं...🫶🏻

उसको darshan पसंद है तो मैं बस उसको सुनना चाहता हूं...🧸

किसी दिन वो मिले और मेरे पास बैठे तो बोलूं उससे ,🫀

ख्वाबों में नहीं हकीकत में भी तुमसे ही निकाह करना चाहता हूं...💍

मेरे इख्तियार में नहीं तुम्हे भूल पाना "rohannnn", 🤍

वो किसी की उतरन हो तो भी उसी को पहनना चाहता हूं...🥀`,
      author: "~rohannn...",
    },
    {
      id: "15",
      title: "Tum toh maahirr ho",
      image:
        "https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?w=800&q=80",
      content: `Uski dhundlii yaadein yhi khi pdi hai kisii Kone mein...💭

kya-kya dastavej lgte hai kisi ka Hone mein..👀

Tum kyaa jaano "rohannn" ye ehd-e-wafa kya hota h,🥀

Bhot farak hai mohabbat aur tawaif k samne Rone mein...🫀

Jyada se jyada teraa nikaah hogaa kisi aur se,💍

Lekin tum toh maahirr ho gairo ke saath hum-bistar Hone mein.. 🖤`,
      author: "~rohannn...",
    },
    {
      id: "16",
      title: "Wo Humari akhiri Chahat..",
      image:
        "https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=800&q=80",
      content: `उसकी तस्वीर, तस्वीर नहीं कीमती अमानत है,🥀

अगर गिर जाए तो उसके जुल्फें तो क़यामत है,

अपनी सहेलियों के सामने उसने दावा किया कि "rohannnn" जिस्मों का शौकीन है,

और हम है कि सबको बता रखा है कि वो हमारी आखिरी चाहत है। 🫀

उसने अपने निकाह के लिए भी मेरे ही दुश्मन को चुना,

हमने भी उसके शादी का माहौल ऐसा बनाया जैसे कोई इद्दत है!!`,
      author: "~rohannn...",
    },
    {
      id: "17",
      title: "Intezaar Karta Hu Abhi Bhii..",
      image:
        "https://images.unsplash.com/photo-1517685352821-92cf88aee5a5?w=800&q=80",
      content: `ई से इबादादात करता हूं मैं तुम्हारी।

ई से इज्जत- ए-हिफाजत करता हूं मैं तुम्हारी।

ई से इश्क करता है rohannn तुमसे,

ई से इंतजार अभी भी करता हूं मैं तुम्हारी।।।

म से मशरूफ हो गया हूं मै फिर भी,

म से मिन्नतें खुदा से करता हूं मै तुम्हारी।।

म से मेहबूब बना लिया है तुमने, तुम्हें भूलकर,

म से मुश्किले कम करता हूं मै तुम्हारी।।!`,
      author: "~rohannn...",
    },
    {
      id: "18",
      title: "Saja-e-mohabbat..",
      image:
        "https://images.unsplash.com/photo-1494887205043-c5f291293cf6?w=800&q=80",
      content: `Khuda aaj meharban h bola tere liye Mai kya karr saku...

Muskurate hua manga Maine apne mehboob ke saamne marr sku..

Saja-e-mohabbat krte krte saja-e-maut ki qafan bn gyii,

Suna hai  kya "rohannn" tumne aaj wo kisi aur ki dulhan bn gyii....

Mai apni gairat ke wajah se qurbaan ho gya,

Chhodo saari baato ko abse wo mere liye anjaan ho gya..`,
      author: "~rohannn...",
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
    <div className="h-screen bg-black text-white flex items-center justify-center px-4 py-6 overflow-hidden">
      <div className="w-full max-w-6xl h-full flex flex-col">
        {/* Shayari Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex-1 flex flex-col max-h-full">
          {/* Decorative Top Bar */}
          <div className="h-1 bg-gradient-to-r from-[#E50914] via-red-600 to-[#E50914] flex-shrink-0"></div>

          {/* Hero Image Section */}
          {shayari.image && (
            <div className="relative h-48 md:h-56 overflow-hidden flex-shrink-0">
              <img
                src={shayari.image}
                alt={shayari.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-zinc-900"></div>

              {/* Floating Title on Image */}
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                <div className="inline-block px-3 py-1 bg-[#E50914]/80 backdrop-blur-sm border border-[#E50914]/50 rounded-full mb-2">
                  <span className="text-white text-xs font-medium uppercase tracking-wide">
                    Poetry
                  </span>
                </div>
                <h1 className="text-xl md:text-3xl font-bold text-white drop-shadow-2xl">
                  {shayari.title}
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  <div className="h-px w-10 bg-gradient-to-r from-[#E50914] to-transparent"></div>
                  <div className="w-1.5 h-1.5 bg-[#E50914] rounded-full"></div>
                  <div className="h-px w-10 bg-gradient-to-l from-[#E50914] to-transparent"></div>
                </div>
              </div>
            </div>
          )}

          {/* Header (if no image) */}
          {!shayari.image && (
            <div className="p-4 md:p-6 border-b border-zinc-800 flex-shrink-0">
              <div className="text-center space-y-2">
                <div className="inline-block px-3 py-1 bg-[#E50914]/10 border border-[#E50914]/30 rounded-full mb-1">
                  <span className="text-[#E50914] text-xs font-medium uppercase tracking-wide">
                    Poetry
                  </span>
                </div>
                <h1 className="text-xl md:text-2xl font-semibold text-white">
                  {shayari.title}
                </h1>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#E50914]"></div>
                  <div className="w-1.5 h-1.5 bg-[#E50914] rounded-full"></div>
                  <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#E50914]"></div>
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="p-4 md:p-6 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="relative h-full flex flex-col">
              {/* Quote Icon Top */}
              <div className="absolute -top-1 -left-1 text-3xl text-[#E50914]/20 font-serif">
                "
              </div>

              {/* Shayari Text */}
              <div className="bg-black rounded-xl p-4 md:p-6 border border-zinc-700 flex-1 flex items-center justify-center">
                <p className="text-sm md:text-base text-gray-100 leading-relaxed whitespace-pre-line text-center font-light">
                  {shayari.content}
                </p>
              </div>

            </div>

            {/* Author Section */}
            <div className="flex justify-end items-center mt-3 pt-3 border-t border-zinc-800">
              <div className="text-right">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                  Written by
                </p>
                <p className="text-lg text-red-600 font-semibold italic mt-4">
                  {shayari.author}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-center gap-3 mt-4 flex-shrink-0">
          <button
            onClick={() => navigate(-1)}
            className="bg-zinc-900 border border-zinc-700 text-white px-6 py-2 rounded-lg hover:border-[#E50914] hover:bg-zinc-800 transition-all duration-300 font-medium text-sm"
          >
            ← Back
          </button>
          <button
            onClick={() => window.print()}
            className="bg-[#E50914] border border-[#E50914] text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-all duration-300 font-medium text-sm"
          >
            Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default FullShayari;
