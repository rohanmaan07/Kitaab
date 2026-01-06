const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./Models/user");
const Tweet = require("./Models/tweet");
require("dotenv").config();

const shayarsData = [
  {
    name: "Mirza Ghalib",
    username: "mirzaghalib",
    email: "ghalib@kitaab.com",
    bio: "The legendary Urdu and Persian poet who redefined the art of Ghazal",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRU6DT0yOWgqtAn7PP5CC6Wx3UtJnf24-xH23Isr-JypbIFL0HnRWQB2D0xzkWtgCLqRGWEcKLMm8Ceg2Njv-alouWvBFLK-a0QA0pVb8g&s=10",
    shayaris: [
      "Hazaaron khwaahishen aisi ke har khwaahish pe dam nikle\nBohat nikle mere armaan, lekin phir bhi kam nikle",
      "Ishq par zor nahin, hai ye woh aatish 'Ghalib'\nKe lagaaye na lage, aur bujhaaye na bane",
      "Hum ko maloom hai jannat ki haqeeqat lekin\nDil ke khush rakhne ko 'Ghalib' ye khayaal achha hai",
      "Dil hi to hai na sang-o-khisht dard se bhar na aaye kyun\nRoyenge hum hazaar baar, koi hamein sataaye kyun",
      "Mohabbat mein nahin hai farq jeene aur marne ka\nUsi ko dekh kar jeete hain jis kaafir pe dam nikle",
      "Ye na thi hamari qismat ke visaal-e-yaar hota\nAgar aur jeete rehte yehi intezaar hota",
      "Dard minnat-kash-e-dawa na hua\nMain na achha hua bura na hua",
      "Koi ummeed bar nahi aati\nKoi surat nazar nahi aati",
      "Bas ke dushwar hai har kaam ka aasaan hona\nAadmi ko bhi mayassar nahin insaan hona",
      "Har ek baat pe kehte ho tum ke 'tu kya hai'\nTumhi kaho ke ye andaaz-e-guftgoo kya hai"
    ]
  },
  {
    name: "Faiz Ahmad Faiz",
    username: "faizahmad",
    email: "faiz@kitaab.com",
    bio: "Revolutionary poet who blended romance with resistance",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFZDPpxE9XBVjRn_vXBjPtCN_OLqR9sazPvtqTnR9uhyQHyVQjynVTtW0b2kB8nCAcDEFAWA&s",
    shayaris: [
      "Mujh se pehli si mohabbat mere mehboob na maang\nMain ne samjha tha ke tu hai to darakhshan hai hayaat",
      "Bol ke lab aazaad hain tere\nBol zabaan ab tak teri hai",
      "Gulon mein rang bhare, baad-e-naubahaar chale\nChale bhi aao ke gulshan ka kaarobaar chale",
      "Aur bhi dukh hain zamaane mein mohabbat ke siwa\nRaahatein aur bhi hain wasl ki raahat ke siwa",
      "Hum dekhenge, lazim hai ke hum bhi dekhenge\nWo din ke jis ka waada hai, jo lauh-e-azal mein likha hai",
      "Tanha tanha saans lene ke liye chain bhi to ho\nDil ko dukh dene ke liye dard ka yakin bhi to ho",
      "Dasht-e-tanhai mein ai jaan-e-wafa teri yaad\nAur bhi jahan bhar ke liye dil ko thaam liya",
      "Yun hi kisi roz tumhaari yaad aa gayi\nJaise ke ek larzish ki sham aa gayi",
      "Raat yun dil mein teri khoi hui yaad aayi\nJaise veerane mein chupke se bahaar aa jaaye",
      "Shaam se aankh mein nami si hai\nAaj phir aapki kami si hai"
    ]
  },
  {
    name: "Ahmad Faraz",
    username: "ahmadfaraz",
    email: "faraz@kitaab.com",
    bio: "Master of romantic poetry and voice of the oppressed",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-Xel0Ogw07WyUaBy4b44OSeip4CbHjkKxgQ&s",
    shayaris: [
      "Ranjish hi sahi dil hi dukhane ke liye aa\nAa phir se mujhe chhod ke jaane ke liye aa",
      "Kisi ki yaad ne humko yun bhega diya\nJaise kisi ne paani mein rang milaa diya",
      "Wo baat sare fasaane mein jiski thi talab\nWo ek suragh-e-tamanaa reh gayi",
      "Main akela hi chala tha janib-e-manzil magar\nLog saath aate gaye aur karwan banta gaya",
      "Waqt ne kiya kya haseen sitam\nTum rahe na tum, hum rahe na hum",
      "Mohabbat karne waale kam na honge\nTeri mehfil mein lekin hum na honge",
      "Roz-e-aakhir ek baar sab ko aana hi hoga\nTujh se milne ki tamanna liye jaana hi hoga",
      "Tum itna jo muskura rahe ho\nKya gham hai jisko chhupa rahe ho",
      "Khuda jaane mohabbat kya kahani thi\nKisi ki yaad thi ya koi nishani thi",
      "Muhabbat ka asar hota to kuchh aur hi hota\nTera mera milna ek silsila hota"
    ]
  },
  {
    name: "Parveen Shakir",
    username: "parveenshakir",
    email: "parveen@kitaab.com",
    bio: "Pioneer of modern feminist poetry in Urdu literature",
    avatar: "https://rekhta.pc.cdn.bitgravity.com/Images/Shayar/Round/parveen-shakir.png",
    shayaris: [
      "Khushbu rakhna khush rehna or mehka karna logo ko\nYahi hai ibadat yahi hai duain yahi hai bandagi",
      "Wo jo hum mein tum mein qaraar tha\nTumhein yaad ho ke na yaad ho",
      "Tumhare khat mein ek kaghaz kora tha\nWo kaghaz nahin ek paigham tha tumhara",
      "Dil ki baat lafzon mein dhal na payi\nAankhon se wo ik jhhalak nikal gayi",
      "Ik baar to apna aaina bhool gaye\nDekha to bohat der tak dekha tumhein",
      "Safar mein dhoop to hogi jo chaaDo ghar ka saaya\nYe sochkar ke phir lautenge, hum aage badh gaye",
      "Tum to kisi aur ke hue kya gham\nHum bhi kisi ko yad aayenge",
      "Mohabbat mein na poochh kaun gaya kahan se aaya\nNa poochh kaun hai apna, na poochh kaun paraaya",
      "Mujhe yaad hai sab tujhe yaad nahin\nYe hi to farq hai tujh mein mujh mein",
      "Shaam se lekar subah tak yaad aate ho\nAur subah se lekar shaam tak yaad aate ho"
    ]
  },
  {
    name: "Jaun Elia",
    username: "jaunelia",
    email: "jaun@kitaab.com",
    bio: "The melancholic philosopher-poet who spoke of solitude and pain",
    avatar: "https://rekhta.pc.cdn.bitgravity.com/Images/EBooks/small_kulliyat-e-john-elia-jaun-eliya-ebooks.jpg",
    shayaris: [
      "Guftagu band ho gayi magar\nRaat bhar humne aap ko suna",
      "Hum ne mana ke aap se muhabbat ki thi\nPar ye kahan kaha tha ke aap ko bhool denge",
      "Mujhe kabhi fursat nahi milti\nKhud se milne ki, khud ko samajhne ki",
      "Mohabbat se mujhe koi shikaayat nahin\nBas itna hai ke waqt kam mila",
      "Main akela hi to tha jo tanha na tha\nAik tha jis ne mujh ko sambhala",
      "Zindagi jitni bhi lambi ho kam hai\nMohabbat jitni bhi ho kam hai",
      "Tum aaye ho na shab-e-intezar guzri hai\nBaharon ki bahaar abhi qarar nahin aayi",
      "Ye dil hai ke manta nahi\nYe mohabbat hai ke bhulti nahi",
      "Khud ko jalate rahe taaron ki tarah\nAur logon ko raushni dete rahe",
      "Tanha tanha rehta hun main\nKhush hoon lekin akela hun"
    ]
  },
  {
    name: "Gulzar",
    username: "gulzar",
    email: "gulzar@kitaab.com",
    bio: "Poet, lyricist, and filmmaker who paints emotions with words",
    avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Gulzar_2008_-_still_38227.jpg/250px-Gulzar_2008_-_still_38227.jpg",
    shayaris: [
      "Tujhse naraz nahin zindagi hairaan hoon main\nTere masle hain bohat zindagi pareshaan hoon main",
      "Ek pal ki tanhai se darte ho\nKyu is kadar khud se bhagte ho",
      "Sheesha-e-dil mein khud ko dekhne ki aadat hai mujhe\nAaye din koi na koi chehra nazar aata hai",
      "Kuch to pal ki bhi kami se reh jaate hain\nAur kuch pal ki tasalli se khush ho jaate hain",
      "Waqt ki baarish mein bheegte chalo\nYaadein tumhari saath le jaate chalo",
      "Mohabbat mein kuchh aisa ho jaata hai\nKe insaan insaan nahin rehta",
      "Tanhai ka ek door tak aalam hai\nKoi paas hai to yaad door ki aati hai",
      "Khushiyon ke din thode hain\nGham ke din bohat hain",
      "Dard ka had se guzarna zaroori hai\nTabhì to dil ko asar hota hai",
      "Zindagi ek safar hai suhaana\nYahan kal kya ho kisne jaana"
    ]
  },
  {
    name: "Sahir Ludhianvi",
    username: "sahirludhianvi",
    email: "sahir@kitaab.com",
    bio: "Progressive poet and lyricist who challenged societal norms",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRct6LxZueztE_YRuCsCG6Y3CW_7IulnhKqOw&s",
    shayaris: [
      "Main pal do pal ka shayar hoon\nPal do pal meri kahani hai",
      "Kabhi kabhi mere dil mein khayal aata hai\nKe zindagi teri zulfon ki narm chhaon mein guzarne paati",
      "Wo subah kabhi to aayegi\nJab dard ke badal pighlenge",
      "Jinhe naaz hai hind par wo kahan hain\nKahan hain, kahan hain, kahan hain",
      "Chalo ek baar phir se ajnabi ban jaayen hum dono\nNa main tumhein janu, na tum mujhe jano",
      "Talash mein hain hum bhi usi shaam ki\nJo kal hamaare saath khushi ke pal gayi",
      "Teri yaad mein jaltey hain\nShama ki tarah hum bhi",
      "Zindagi bhar nahin bhoolegi woh barsaat ki raat\nEk tum the, ek hum the, aur baarish ka saath",
      "Mohabbat ki raah mein chalte hain\nAur manzil ko dhoondte hain",
      "Yeh duniya agar mil bhi jaaye to kya hai\nYeh duniya agar chhoot bhi jaaye to kya hai"
    ]
  },
  {
    name: "Munir Niazi",
    username: "munirniazi",
    email: "munir@kitaab.com",
    bio: "Mystical poet whose verses touched the depths of the heart",
    avatar: "https://rekhta.pc.cdn.bitgravity.com/Images/Shayar/Round/muneer-niyazi.png",
    shayaris: [
      "Aik tha main aik hai tu\nAur baki sab kehani hai",
      "Raat ko ik khwaab aaya tha\nSubah ko wo yaad aaya tha",
      "Dil ki baat dil mein reh gayi\nAur umr bhar ka gham ho gaya",
      "Tum jo keh do to aaj ki raat chand doobega nahin\nRaat ko rok lo, basant ki barsaat rok lo",
      "Mohabbat ki hai tumse, ye keh na sakoon\nAur bina kahe rehna bhi mushkil hai",
      "Tanha tanha rahein kyon hum\nKoi saathi bhi to ho",
      "Zindagi ne hume itna bataya hai\nKe har khushi ke peeche gham chhupa hai",
      "Dard ko dawa ki zaroorat nahi\nBas thoda waqt aur tera saath chahiye",
      "Mohabbat wo hai jo keh na sakein\nAur bin kahe mar jayein",
      "Raat bhar jagta hun main\nAur subah tak sochta hun tumhare baare mein"
    ]
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.ATLAS_DB);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    console.log("🗑️  Clearing existing shayars and tweets...");
    const existingShayars = await User.find({
      username: { $in: shayarsData.map(s => s.username) }
    });

    if (existingShayars.length > 0) {
      await Tweet.deleteMany({ userId: { $in: existingShayars.map(s => s._id) } });
      await User.deleteMany({ username: { $in: shayarsData.map(s => s.username) } });
      console.log("✅ Cleared old data");
    }

    const createdUsers = [];

    // Create users and their shayaris
    for (const shayarData of shayarsData) {
      console.log(`\n📝 Creating ${shayarData.name}...`);

      // Create user
      const hashedPassword = await bcrypt.hash("password123", 10);
      const user = new User({
        name: shayarData.name,
        username: shayarData.username,
        email: shayarData.email,
        password: hashedPassword,
        avatar: shayarData.avatar,
        bio: shayarData.bio || "Words that touch the soul",
        role: "user"
      });

      await user.save();
      createdUsers.push(user);
      console.log(`   ✅ User created: ${user.username}`);

      // Create tweets (shayaris) for this user
      const tweets = [];
      for (const shayari of shayarData.shayaris) {
        const tweet = new Tweet({
          description: shayari,
          userId: user._id,
          userDetails: [{
            name: user.name,
            username: user.username,
            avatar: user.avatar
          }],
          like: []
        });
        tweets.push(tweet);
      }

      await Tweet.insertMany(tweets);
      console.log(`   ✅ Added ${tweets.length} shayaris`);
    }

    // Add some followers and following relationships
    console.log("\n👥 Creating follow relationships...");
    for (let i = 0; i < createdUsers.length; i++) {
      const user = createdUsers[i];
      const followersCount = Math.floor(Math.random() * 5) + 3; // 3-7 followers

      const followers = [];
      const following = [];

      for (let j = 0; j < followersCount; j++) {
        const randomIndex = Math.floor(Math.random() * createdUsers.length);
        if (randomIndex !== i && !followers.includes(createdUsers[randomIndex]._id)) {
          followers.push(createdUsers[randomIndex]._id);
        }
      }

      const followingCount = Math.floor(Math.random() * 4) + 2; // 2-5 following
      for (let j = 0; j < followingCount; j++) {
        const randomIndex = Math.floor(Math.random() * createdUsers.length);
        if (randomIndex !== i && !following.includes(createdUsers[randomIndex]._id)) {
          following.push(createdUsers[randomIndex]._id);
        }
      }

      await User.findByIdAndUpdate(user._id, {
        $set: { followers, following }
      });
    }
    console.log("✅ Follow relationships created");

    // Add some likes to tweets
    console.log("\n❤️  Adding likes to shayaris...");
    const allTweets = await Tweet.find();
    for (const tweet of allTweets) {
      const likeCount = Math.floor(Math.random() * 150) + 50; // 50-200 likes
      const likes = [];

      for (let i = 0; i < Math.min(likeCount, createdUsers.length); i++) {
        const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
        if (!likes.includes(randomUser._id.toString())) {
          likes.push(randomUser._id.toString());
        }
      }

      await Tweet.findByIdAndUpdate(tweet._id, {
        $set: { like: likes }
      });
    }
    console.log("✅ Likes added to shayaris");

    console.log("\n✨ Database seeded successfully!");
    console.log(`📊 Summary:`);
    console.log(`   👤 Users created: ${createdUsers.length}`);
    console.log(`   📝 Total shayaris: ${allTweets.length}`);
    console.log("\n🔐 Login credentials for all users:");
    console.log(`   Username: Any of the usernames above`);
    console.log(`   Password: password123`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
