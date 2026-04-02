# 📚 Kitaab (किताब)- Beyond Just a Bookstore

**Kitaab** is a soulful digital ecosystem where literature meets community. It is a premium MERN stack application that serves as a high-end bookstore for Urdu and Hindi literature, seamlessly blended with a vibrant social network (Shayari Timeline) and an emotionally intelligent AI Poetry Assistant.

---

## 🚀 Detailed Features

### 🖥️ Frontend Excellence (React.js & Tailwind)
*   **Dynamic Dashboard & Navigation:**
    *   **Sidebars & Bottom Nav:** Intuitive navigation designed for multi-device compatibility.
    *   **Role-Based UI:** Conditional rendering for Admin (Inventory controls) and Users (Shopping & Social).
*   **Literary Bookstore Interface:**
    *   **Category Filtering:** Instant filter for Ghazals, Nazms, Romantic, Sufi, etc.
    *   **Detailed View:** High-quality book covers, rich descriptions, and related book suggestions.
    *   **Persistent Cart:** Redux-powered cart that stays synced with user sessions.
*   **Poetry Social Network (Twitter-style):**
    *   **Interactive Timeline:** Like, Bookmark, and Share original Shayari tweets.
    *   **Profile Mastery:** Personalized profile pages showing your followers, following count, and bookmarked poetry.
    *   **Explore Hub:** Trending tags and popular shayars discovery system.
*   **Real-time Communication:**
    *   **Chat Dashboard:** Multi-conversation chat interface with real-time delivery and message history.
    *   **Instant Notifications:** Desktop-style toast notifications for likes, follows, and new messages.

### ⚙️ Backend Infrastructure (Node.js, Express & MongoDB)
*   **Security & Authentication:**
    *   **JWT & Bcrypt:** Secure token-based auth with salted password hashing.
    *   **Multi-Role Access:** Granular permission system (Admin vs. User).
*   **Advanced AI Integration:**
    *   **Groq Llama 3.3 Engine:** High-speed LLM processing for the "Rohan Assistant".
    *   **Mood Detection Logic:** Custom backend engine analyzes user sentiment to pick the perfect verse from `rohanPoetry.json`.
*   **Social & Engagement Engine:**
    *   **Follow System:** Robust Mongoose logic for mutual following and social graphs.
    *   **Tweet Logic:** Scalable micro-blogging architecture with support for high-engagement metrics.
*   **E-Commerce Pipeline:**
    *   **Razorpay Gateway:** Full server-side order creation and signature verification for safe payments.
    *   **Cloudinary Asset Storage:** Automatic image optimization and secure storage for user avatars and book covers using Multer.
*   **Real-time Synchronization:**
    *   **Socket.io implementation:** Low-latency socket connections for instant messaging and presence updates.

---

## 🛠️ Tech Stack

### Frontend
- **React.js** (Vite) : High-performance UI rendering.
- **Redux Toolkit** : Robust global state management.
- **Tailwind CSS** : Modern, dark-themed aesthetics with glassmorphic elements.
- **Socket.io Client** : For real-time updates and chatting.

### Backend
- **Node.js & Express.js** : Scalable API architecture.
- **MongoDB & Mongoose** : Document-oriented data storage.
- **JWT & Bcrypt** : Secure authentication and authorization.
- **Cloudinary** : Optimization and storage for user avatars and book covers.
- **Groq SDK** : Blazing fast AI inference.

---

## 🎨 UI Preview

*(Place your screenshots here to WOW your visitors!)*

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas Account
- Cloudinary Account
- Razorpay API Keys
- Groq API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/rohanmaan07/Kitaab.git
   cd Kitaab
   ```

2. **Backend Setup:**
   ```bash
   cd Backend
   npm install
   # Create a .env file and add your credentials (see .env.example)
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd ../Frontend
   npm install
   # Create a .env file and add VITE_API_URL
   npm run dev
   ```

---

## 📜 License
Internal Project by **Rohan**. Distributed under the MIT License.

---

## ❤️ Credits
Developed with passion by **Rohan**. Inspired by the timeless beauty of Urdu and Hindi literature. 
Website: [kitaab-roh.vercel.app](https://kitaab-roh.vercel.app/)

---
*“Sitare jis jagah thahre hon us ki baat hi kuch aur hai...
Kitaabon ke pan-non me bas-ti ek puri ka-y-nat hai.”*
