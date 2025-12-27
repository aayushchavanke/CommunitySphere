let isUserLoggedIn = false;
let currentUser = null;
let currentUserFullName = null;

async function checkAuthStatus() {
    try {
        const response = await fetch('/auth_status.php', {
            credentials: 'include'
        });

        const data = await response.json();

        if (data.success && data.logged_in) {
            isUserLoggedIn = true;
            window.isUserLoggedIn = true;
            currentUserFullName = data.user.fullname;
            currentUser = data.user.email.split('@')[0];
            window.currentUser = data.user;
        } else {
            isUserLoggedIn = false;
            window.isUserLoggedIn = false;
            currentUser = null;
            currentUserFullName = null;
            window.currentUser = null;
        }

        updateAuthUI();
    } catch (error) {
        console.error('Auth check failed:', error);
    }
}

function toggleTheme() {
    document.body.classList.toggle('light-mode');
    const themeButton = document.querySelector('.theme-toggle');
    if (!themeButton) return;

    themeButton.textContent = document.body.classList.contains('light-mode')
        ? '🌙 Toggle Theme'
        : '☀️ Toggle Theme';
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'block';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
}

window.onclick = function (event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
};

async function handleSignup(event) {
    event.preventDefault();

    const name = document.getElementById('signupName')?.value.trim();
    const prn = document.getElementById('signupPRN')?.value.trim();
    const email = document.getElementById('signupEmail')?.value.trim();
    const password = document.getElementById('signupPassword')?.value;

    const prnError = document.getElementById('prnError');
    const emailError = document.getElementById('emailError');
    if (prnError) prnError.style.display = 'none';
    if (emailError) emailError.style.display = 'none';

    if (!name || name.length < 2) {
        alert('Please enter your full name');
        return;
    }

    if (!email || !email.endsWith('@gst.sies.edu.in')) {
        if (emailError) {
            emailError.textContent = 'Please use your college email (@gst.sies.edu.in)';
            emailError.style.display = 'block';
        }
        return;
    }

    if (!prn || prn.length < 5) {
        if (prnError) {
            prnError.textContent = 'Please enter a valid PRN';
            prnError.style.display = 'block';
        }
        return;
    }

    try {
        const response = await fetch('/register.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ fullname: name, prn, email, password })
        });

        const data = await response.json();

        if (data.success) {
            alert(`Welcome to CommunitySphere, ${name}! 🎉`);
            closeModal('signupModal');
            document.getElementById('signupForm')?.reset();
            window.location.reload();
        } else {
            if (data.message?.toLowerCase().includes('email') && emailError) {
                emailError.textContent = data.message;
                emailError.style.display = 'block';
            } else if (data.message?.toLowerCase().includes('prn') && prnError) {
                prnError.textContent = data.message;
                prnError.style.display = 'block';
            } else {
                alert(data.message || 'Signup failed');
            }
        }
    } catch (error) {
        console.error('Signup error:', error);
        alert('An error occurred. Please try again.');
    }
}

async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail')?.value.trim();
    const password = document.getElementById('loginPassword')?.value;
    const loginEmailError = document.getElementById('loginEmailError');
    if (loginEmailError) loginEmailError.style.display = 'none';

    if (!email || !email.endsWith('@gst.sies.edu.in')) {
        if (loginEmailError) {
            loginEmailError.textContent = 'Please use a valid college email';
            loginEmailError.style.display = 'block';
        }
        return;
    }

    try {
        const response = await fetch('/login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success) {
            alert(`Welcome back, ${data.user.fullname}! 👋`);
            closeModal('loginModal');
            document.getElementById('loginForm')?.reset();
            window.location.reload();
        } else if (loginEmailError) {
            loginEmailError.textContent = data.message || 'Login failed';
            loginEmailError.style.display = 'block';
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred. Please try again.');
    }
}

function updateAuthUI() {
    const authButtons = document.querySelector('.auth-buttons');
    if (!authButtons) return;

    authButtons.innerHTML = isUserLoggedIn
        ? `<span style="color: var(--accent-cyan); font-weight: 600; margin-right: 0.5rem;">
              Hi, ${currentUserFullName || currentUser}!
           </span>
           <button class="btn btn-login" onclick="handleLogout()">Logout</button>`
        : `<button class="btn btn-login" onclick="openModal('loginModal')">Login</button>
           <button class="btn btn-signup" onclick="openModal('signupModal')">Sign Up</button>`;
}

async function handleLogout() {
    try {
        const response = await fetch('/logout.php', {
            credentials: 'include'
        });

        const data = await response.json();
        if (data.success) {
            alert('You have been logged out successfully.');
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('Logout error:', error);
    }
}

let currentSlide = 0;

function changeSlide() {
    const slides = document.querySelectorAll('.hero-slide');
    if (!slides.length) return;

    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
}

if (document.querySelectorAll('.hero-slide').length > 0) {
    setInterval(changeSlide, 5000);
}

function scrollToClubs() {
    document.getElementById('clubs')?.scrollIntoView({ behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
});
