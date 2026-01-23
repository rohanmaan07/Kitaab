#!/usr/bin/env node
// Auto-Update Script for API URLs
// This file lists ALL files that need localhost URL updates

const filesToUpdate = {
    // ✅ COMPLETED
    completed: [
        'src/Pages/Login.jsx',
        'src/Pages/SignUp.jsx',
        'src/Context/SocketContext.jsx',
        'src/Pages/Profile.jsx',
        'src/Components/AssistantBot.jsx',
        'src/Pages/Explore.jsx',
    ],

    // 🔥 HIGH PRIORITY - User-facing features
    highPriority: [
        'src/Pages/User Profile.jsx',
        'src/Pages/Notifications.jsx',
        'src/Pages/FollowersPage.jsx',
        'src/Pages/Bookmarks.jsx',
        'src/Components/TweetCard.jsx',
        'src/Components/CreateTweet.jsx',
    ],

    // 📚 MEDIUM PRIORITY - Shopping & Books
    mediumPriority: [
        'src/Pages/Cart.jsx',
        'src/Pages/ViewBooks.jsx',
        'src/Pages/AllBooks.jsx',
        'src/Pages/CategoryPage.jsx',
        'src/Pages/RecentlyAdd.jsx',
        'src/Components/BookCard.jsx',
        'src/Components/Favourite.jsx',
        'src/Components/History.jsx',
    ],

    // ⚙️ LOW PRIORITY - Admin features
    lowPriority: [
        'src/Components/AddBooks.jsx',
        'src/Components/UpdateBook.jsx',
        'src/Components/AllOrders.jsx',
        'src/Components/EditProfileModal.jsx',
    ],
};

// Pattern to find and replace
const pattern = {
    find: 'http://localhost:8080/api/v1',
    replace: 'getApiUrl',
    import: 'import { getApiUrl } from "../config/api";',
};

console.log('Files Update Status:');
console.log('✅ Completed:', filesToUpdate.completed.length);
console.log('🔥 High Priority Remaining:', filesToUpdate.highPriority.length);
console.log('📚 Medium Priority Remaining:', filesToUpdate.mediumPriority.length);
console.log('⚙️ Low Priority Remaining:', filesToUpdate.lowPriority.length);

export default filesToUpdate;
