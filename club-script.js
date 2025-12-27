// ===== CLUB POST MANAGEMENT - VERIFIED WORKING VERSION =====

// API Base URL
const API_URL = 'backend';

// Initialize posts arrays
let technicalPosts = [];
let culturalPosts = [];
let sportsPosts = [];

// ===== LOAD POSTS FROM DATABASE =====
async function loadPostsFromDatabase(clubType) {
    try {
        const response = await fetch(`${API_URL}/fetch_messages.php?club=${clubType}`, {
            method: 'GET',
            credentials: 'include',  // CRITICAL: Send cookies
            headers: {
                'Accept': 'application/json'
            }
        });
        
        const data = await response.json();
        
        console.log('Load posts response:', data); // Debug
        
        if (data.success) {
            const posts = data.posts;
            
            // Store in memory
            switch(clubType) {
                case 'technical':
                    technicalPosts = posts;
                    break;
                case 'cultural':
                    culturalPosts = posts;
                    break;
                case 'sports':
                    sportsPosts = posts;
                    break;
            }
            
            return posts;
        } else {
            console.error('Error loading posts:', data.message);
            showNotification(data.message || 'Failed to load posts');
            return [];
        }
    } catch (error) {
        console.error('Error loading posts:', error);
        showNotification('Failed to load posts. Please refresh the page.');
        return [];
    }
}

// ===== GET POSTS FOR A SPECIFIC CLUB =====
function getPosts(clubType) {
    switch(clubType) {
        case 'technical':
            return technicalPosts;
        case 'cultural':
            return culturalPosts;
        case 'sports':
            return sportsPosts;
        default:
            return [];
    }
}

// ===== FORMAT TIME AGO =====
function timeAgo(timestamp) {
    const seconds = Math.floor((new Date() - timestamp) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    
    return "Just now";
}

// ===== GET USER INITIALS FOR AVATAR =====
function getUserInitials(name) {
    if (!name) return "?";
    const words = name.trim().split(' ');
    if (words.length >= 2) {
        return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
}

// ===== CREATE A NEW POST =====
async function createPost(clubType) {
    console.log('createPost called for:', clubType); // Debug
    console.log('isUserLoggedIn:', isUserLoggedIn); // Debug
    
    // Check if user is logged in
    if (typeof isUserLoggedIn === 'undefined' || !isUserLoggedIn) {
        alert('Please login to create a post!');
        if (typeof openModal === 'function') {
            openModal('loginModal');
        }
        return;
    }
    
    const contentTextarea = document.getElementById(`${clubType}-post-content`);
    if (!contentTextarea) {
        console.error('Textarea not found:', `${clubType}-post-content`);
        return;
    }
    
    const content = contentTextarea.value.trim();
    
    // Validation
    if (!content) {
        alert('Please write something to post!');
        contentTextarea.focus();
        return;
    }
    
    console.log('Attempting to create post:', { clubType, content }); // Debug
    
    try {
        // Send POST request to backend
        const response = await fetch(`${API_URL}/post_message.php`, {
            method: 'POST',
            credentials: 'include',  // CRITICAL: Send cookies
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                club: clubType,
                message: content
            })
        });
        
        console.log('Response status:', response.status); // Debug
        
        const data = await response.json();
        console.log('Response data:', data); // Debug
        
        if (data.success) {
            // Clear input
            contentTextarea.value = '';
            
            // Reload posts from database
            await loadPostsFromDatabase(clubType);
            displayPosts(clubType);
            
            // Success feedback
            showNotification('Post created successfully! 🎉');
        } else {
            // Show specific error message
            console.error('Post creation failed:', data);
            alert('Failed to create post: ' + (data.message || 'Unknown error'));
            
            // Show debug info if available
            if (data.debug) {
                console.log('Debug info:', data.debug);
            }
        }
    } catch (error) {
        console.error('Error creating post:', error);
        alert('Failed to create post. Check console for details.');
    }
}

// ===== DISPLAY POSTS =====
function displayPosts(clubType) {
    const postsContainer = document.getElementById(`${clubType}-posts`);
    if (!postsContainer) return;
    
    const posts = getPosts(clubType);
    
    // Update post count
    const postCountElement = document.getElementById(`${clubType}-post-count`);
    if (postCountElement) {
        postCountElement.textContent = posts.length;
    }
    
    // Check if user is logged in
    if (typeof isUserLoggedIn === 'undefined' || !isUserLoggedIn) {
        postsContainer.innerHTML = '';
        return;
    }
    
    // Clear container
    postsContainer.innerHTML = '';
    
    // Display empty state if no posts
    if (posts.length === 0) {
        postsContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📝</div>
                <p class="empty-state-text">No posts yet</p>
                <p style="font-size: 0.9rem; opacity: 0.7;">Be the first to share something!</p>
            </div>
        `;
        return;
    }
    
    // Display all posts
    posts.forEach(post => {
        const postCard = document.createElement('div');
        postCard.className = 'post-card';
        postCard.innerHTML = `
            <div class="post-header">
                <div class="post-avatar">${getUserInitials(post.username)}</div>
                <div class="post-user-info">
                    <div class="post-username">${escapeHtml(post.username)}</div>
                    <div class="post-time">${timeAgo(post.timestamp)}</div>
                </div>
            </div>
            <div class="post-content">${escapeHtml(post.content)}</div>
            <div class="post-actions">
                <button class="post-action-btn" onclick="likePost('${clubType}', ${post.id})">
                    👍 Like ${post.likes > 0 ? '(' + post.likes + ')' : ''}
                </button>
                <button class="post-action-btn" onclick="deletePost('${clubType}', ${post.id})">
                    🗑️ Delete
                </button>
            </div>
        `;
        postsContainer.appendChild(postCard);
    });
}

// ===== LIKE A POST =====
async function likePost(clubType, postId) {
    try {
        const response = await fetch(`${API_URL}/like_post.php`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                club: clubType,
                post_id: postId
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            await loadPostsFromDatabase(clubType);
            displayPosts(clubType);
        } else {
            showNotification(data.message);
        }
    } catch (error) {
        console.error('Error liking post:', error);
        showNotification('Failed to like post. Please try again.');
    }
}

// ===== DELETE A POST =====
async function deletePost(clubType, postId) {
    if (!confirm('Are you sure you want to delete this post?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/delete_post.php`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                club: clubType,
                post_id: postId
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            await loadPostsFromDatabase(clubType);
            displayPosts(clubType);
            showNotification('Post deleted');
        } else {
            showNotification(data.message);
        }
    } catch (error) {
        console.error('Error deleting post:', error);
        showNotification('Failed to delete post. Please try again.');
    }
}

// ===== ESCAPE HTML TO PREVENT XSS =====
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== SHOW NOTIFICATION =====
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #00d4ff 0%, #a855f7 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        font-family: 'Poppins', sans-serif;
        font-weight: 500;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);

// ===== INITIALIZE POSTS WHEN PAGE LOADS =====
document.addEventListener('DOMContentLoaded', async function() {
    console.log('club-script.js loaded'); // Debug
    
    // Determine which club page we're on
    const path = window.location.pathname;
    let clubType = null;
    
    if (path.includes('technical')) {
        clubType = 'technical';
    } else if (path.includes('cultural')) {
        clubType = 'cultural';
    } else if (path.includes('sports')) {
        clubType = 'sports';
    }
    
    console.log('Detected club type:', clubType); // Debug
    
    // Load and display posts if we're on a club page
    if (clubType) {
        await loadPostsFromDatabase(clubType);
        displayPosts(clubType);
        
        // Add enter key support for textarea
        const textarea = document.getElementById(`${clubType}-post-content`);
        if (textarea) {
            textarea.addEventListener('keydown', function(e) {
                if (e.ctrlKey && e.key === 'Enter') {
                    createPost(clubType);
                }
            });
        }
    }
});