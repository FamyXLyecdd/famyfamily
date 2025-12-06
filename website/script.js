/**
 * Famy's Family - Verification Site
 * Powered by BitterFamy Bot
 * SMART MONETIZATION - Ads at key points, not blocking
 */

// ============================================================
// CONFIGURATION
// ============================================================

const CONFIG = {
    // Discord OAuth
    DISCORD_CLIENT_ID: '1446661285923000411',
    REDIRECT_URI: window.location.origin + '/callback.html',

    // Community
    DISCORD_INVITE: 'https://discord.gg/6mWRdPUPPB',
    BRAND_NAME: "Famy's Family",
    BOT_NAME: "BitterFamy",

    // Bot API (for local testing)
    BOT_API: 'http://localhost:5000',

    // Verification
    MIN_ACCOUNT_AGE: 7,
    VERIFICATION_STEPS: 3,  // Number of ad visits required
    COUNTDOWN_TIME: 10,     // Seconds to wait per step

    // Monetag Direct Link
    AD_URL: 'https://otieu.com/4/10228644'
};

// Try to fetch invite from bot API
async function fetchInviteUrl() {
    try {
        const response = await fetch(`${CONFIG.BOT_API}/api/invite`);
        if (response.ok) {
            const data = await response.json();
            if (data.invite_url) {
                CONFIG.DISCORD_INVITE = data.invite_url;
                // Update any invite links on page
                document.querySelectorAll('[data-discord-invite]').forEach(el => {
                    el.href = data.invite_url;
                });
                const discordNavLink = document.getElementById('discordNavLink');
                if (discordNavLink) discordNavLink.href = data.invite_url;
                console.log('Invite URL loaded:', data.invite_url);
            }
        }
    } catch (e) {
        console.log('Bot API not available, using default invite');
    }
}

// ============================================================
// STATE
// ============================================================

let currentStep = 1;
let userData = null;
let verificationProgress = 0;
let countdownTimer = null;

// ============================================================
// AD SYSTEM - AGGRESSIVE BUT SMART
// ============================================================

function showAd() {
    window.open(CONFIG.AD_URL, '_blank');
}

// Multiple ad triggers for MAXIMUM revenue
function initAds() {
    // Initial popup after 3 seconds
    setTimeout(showAd, 3000);

    // Every 45 seconds while on page
    setInterval(() => {
        if (document.visibilityState === 'visible') {
            showAd();
        }
    }, 45000);

    // On scroll (once)
    let scrolled = false;
    window.addEventListener('scroll', () => {
        if (!scrolled && window.scrollY > 150) {
            scrolled = true;
            showAd();
        }
    });

    // When user returns to page from ad
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            setTimeout(showAd, 2000);
        }
    });

    // On any external link click
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link && link.href && !link.href.includes(window.location.origin)) {
            showAd();
        }
    });
}

// ============================================================
// COUNTDOWN VERIFICATION SYSTEM
// ============================================================

function startVerificationCountdown() {
    const countdownOverlay = document.getElementById('countdownOverlay');
    const countdownNumber = document.getElementById('countdownNumber');
    const countdownProgress = document.getElementById('countdownProgress');
    const countdownStep = document.getElementById('countdownStep');
    const countdownTotal = document.getElementById('countdownTotal');

    if (!countdownOverlay) return;

    verificationProgress++;
    let timeLeft = CONFIG.COUNTDOWN_TIME;

    // Update step indicator
    if (countdownStep) countdownStep.textContent = verificationProgress;
    if (countdownTotal) countdownTotal.textContent = CONFIG.VERIFICATION_STEPS;

    // Update liquid fill and button text
    updateLiquidProgress();

    // Show overlay
    countdownOverlay.classList.add('active');

    // Open ad
    showAd();

    // Start countdown
    countdownTimer = setInterval(() => {
        timeLeft--;
        if (countdownNumber) countdownNumber.textContent = timeLeft;
        if (countdownProgress) {
            const progress = ((CONFIG.COUNTDOWN_TIME - timeLeft) / CONFIG.COUNTDOWN_TIME) * 100;
            countdownProgress.style.width = `${progress}%`;
        }

        if (timeLeft <= 0) {
            clearInterval(countdownTimer);

            // Check if done with all steps
            if (verificationProgress >= CONFIG.VERIFICATION_STEPS) {
                // All steps complete - proceed with verification
                countdownOverlay.classList.remove('active');
                completeVerification();
            } else {
                // More steps needed - update button
                countdownOverlay.classList.remove('active');
                updateLiquidProgress();
            }
        }
    }, 1000);
}

// Update liquid fill progress and button text
function updateLiquidProgress() {
    const liquidFill = document.getElementById('liquidFill');
    const progressCounter = document.querySelector('.progress-counter');
    const verifyBtn = document.getElementById('verifyBtn');

    const progress = (verificationProgress / CONFIG.VERIFICATION_STEPS) * 100;

    if (liquidFill) {
        liquidFill.style.height = `${progress}%`;
    }

    if (progressCounter) {
        progressCounter.textContent = `(${verificationProgress}/${CONFIG.VERIFICATION_STEPS})`;
    }

    // Update button text based on progress
    if (verifyBtn && verificationProgress > 0 && verificationProgress < CONFIG.VERIFICATION_STEPS) {
        const btnText = verifyBtn.querySelector('.btn-text');
        if (btnText) {
            btnText.innerHTML = `Continue <span class="progress-counter">(${verificationProgress}/${CONFIG.VERIFICATION_STEPS})</span>`;
        }
        verifyBtn.disabled = false;
    }
}

function showNextStepPrompt() {
    const continueBtn = document.getElementById('continueVerifyBtn');
    const stepCounter = document.getElementById('stepCounter');

    if (continueBtn) {
        continueBtn.style.display = 'flex';
        continueBtn.textContent = `Continue Verification (${verificationProgress}/${CONFIG.VERIFICATION_STEPS})`;
    }
    if (stepCounter) {
        stepCounter.textContent = `Step ${verificationProgress + 1} of ${CONFIG.VERIFICATION_STEPS}`;
    }
}

// ============================================================
// MOBILE MENU
// ============================================================

function initMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const nav = document.querySelector('.nav');

    if (!menuBtn || !nav) return;

    // Create mobile menu overlay
    const overlay = document.createElement('div');
    overlay.className = 'mobile-overlay';
    overlay.innerHTML = `
        <div class="mobile-menu">
            <div class="mobile-menu-header">
                <span class="mobile-menu-title">Menu</span>
                <button class="mobile-close-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            </div>
            <nav class="mobile-nav">
                <a href="/" class="mobile-nav-link">Home</a>
                <a href="about.html" class="mobile-nav-link">About</a>
                <a href="rules.html" class="mobile-nav-link">Rules</a>
                <a href="faq.html" class="mobile-nav-link">FAQ</a>
                <a href="tos.html" class="mobile-nav-link">Terms</a>
                <a href="privacy.html" class="mobile-nav-link">Privacy</a>
            </nav>
        </div>
    `;
    document.body.appendChild(overlay);

    const closeBtn = overlay.querySelector('.mobile-close-btn');

    // Open menu
    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        menuBtn.classList.add('active');
    });

    // Close menu
    function closeMenu() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        menuBtn.classList.remove('active');
    }

    closeBtn.addEventListener('click', closeMenu);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeMenu();
    });

    // Close on nav link click
    overlay.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });
}

// ============================================================
// PARTICLES ANIMATION
// ============================================================

function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 1}px;
            height: ${Math.random() * 4 + 1}px;
            background: rgba(124, 58, 237, ${Math.random() * 0.5 + 0.1});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: particleFloat ${Math.random() * 10 + 10}s linear infinite;
            animation-delay: ${Math.random() * -10}s;
        `;
        container.appendChild(particle);
    }
}

// ============================================================
// STEP NAVIGATION
// ============================================================

function updateProgress(step) {
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
        progressFill.style.width = `${(step / 3) * 100}%`;
    }
}

function goToStep(stepNumber) {
    // Update step indicators
    document.querySelectorAll('.step-item').forEach((item, index) => {
        item.classList.remove('active', 'completed');
        if (index + 1 < stepNumber) {
            item.classList.add('completed');
        } else if (index + 1 === stepNumber) {
            item.classList.add('active');
        }
    });

    // Update content
    document.querySelectorAll('.step-content').forEach((content, index) => {
        content.classList.remove('active');
        if (index + 1 === stepNumber) {
            content.classList.add('active');
        }
    });

    updateProgress(stepNumber);
    currentStep = stepNumber;

    // Trigger confetti on step 3
    if (stepNumber === 3) {
        createConfetti();
    }
}

// ============================================================
// CONFETTI
// ============================================================

function createConfetti() {
    const container = document.getElementById('confetti');
    if (!container) return;

    const colors = ['#7c3aed', '#06b6d4', '#ec4899', '#10b981', '#f59e0b'];

    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: absolute;
                width: ${Math.random() * 10 + 5}px;
                height: ${Math.random() * 10 + 5}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: 50%;
                top: 50%;
                border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
                animation: confettiFall 1s ease-out forwards;
                transform: translate(-50%, -50%) rotate(${Math.random() * 360}deg);
                --tx: ${(Math.random() - 0.5) * 200}px;
                --ty: ${Math.random() * -150 - 50}px;
            `;
            container.appendChild(confetti);

            setTimeout(() => confetti.remove(), 1000);
        }, i * 20);
    }
}

// Add confetti animation
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
    @keyframes confettiFall {
        0% { 
            opacity: 1;
            transform: translate(-50%, -50%) rotate(0deg) scale(1);
        }
        100% { 
            opacity: 0;
            transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) rotate(720deg) scale(0);
        }
    }
    @keyframes particleFloat {
        0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateY(-100vh) translateX(20px); opacity: 0; }
    }
`;
document.head.appendChild(confettiStyle);

// ============================================================
// DISCORD OAUTH
// ============================================================

function connectDiscord() {
    const params = new URLSearchParams({
        client_id: CONFIG.DISCORD_CLIENT_ID,
        redirect_uri: CONFIG.REDIRECT_URI,
        response_type: 'code',
        scope: 'identify guilds'
    });

    const popup = window.open(
        `https://discord.com/api/oauth2/authorize?${params}`,
        'Discord Login',
        'width=500,height=700,left=' + (screen.width - 500) / 2 + ',top=' + (screen.height - 700) / 2
    );

    window.addEventListener('message', handleOAuthCallback);

    const checkClosed = setInterval(() => {
        if (popup.closed) {
            clearInterval(checkClosed);
            window.removeEventListener('message', handleOAuthCallback);
        }
    }, 500);
}

function handleOAuthCallback(event) {
    if (event.origin !== window.location.origin) return;

    const { type, user, error } = event.data;

    if (type === 'discord_oauth_success' && user) {
        userData = user;
        displayUserInfo(user);
        goToStep(2);
    } else if (type === 'discord_oauth_error') {
        showError('Connection failed: ' + (error || 'Unknown error'));
    }
}

function displayUserInfo(user) {
    const avatar = document.getElementById('userAvatar');
    const name = document.getElementById('userName');
    const tag = document.getElementById('userTag');

    if (user.avatar) {
        avatar.src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`;
    } else {
        avatar.src = `https://cdn.discordapp.com/embed/avatars/${parseInt(user.discriminator || '0') % 5}.png`;
    }

    name.textContent = user.username;
    tag.textContent = user.discriminator && user.discriminator !== '0' ? `#${user.discriminator}` : '';
}

// ============================================================
// CAPTCHA - Starts countdown verification
// ============================================================

function handleCaptcha() {
    const input = document.getElementById('captchaInput');
    const verifyBtn = document.getElementById('verifyBtn');

    if (input.checked) {
        // Reset verification progress
        verificationProgress = 0;

        // Enable button after check
        setTimeout(() => {
            verifyBtn.disabled = false;
        }, 500);
    } else {
        verifyBtn.disabled = true;
    }
}

// ============================================================
// VERIFICATION - Now with countdown steps
// ============================================================

async function completeVerification() {
    const btn = document.getElementById('verifyBtn');

    btn.classList.add('loading');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> Finalizing...';

    try {
        // Check account age
        if (userData && userData.created_at) {
            const days = (Date.now() - new Date(userData.created_at).getTime()) / (1000 * 60 * 60 * 24);
            if (days < CONFIG.MIN_ACCOUNT_AGE) {
                throw new Error(`Account must be at least ${CONFIG.MIN_ACCOUNT_AGE} days old.`);
            }
        }

        // Generate verification code (user ID + timestamp hash)
        const verifyCode = generateVerifyCode(userData?.id);

        // Call bot API to assign role (only works if bot is running locally)
        if (userData && userData.id) {
            try {
                await fetch('http://localhost:5000/api/verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_id: userData.id, code: verifyCode })
                });
                console.log('Verification sent to bot');
            } catch (apiErr) {
                console.log('Bot API not available (expected on Vercel)');
            }
        }

        // Final processing delay
        await new Promise(r => setTimeout(r, 1500));

        btn.classList.remove('loading');
        btn.innerHTML = '✓ Verified!';

        // Show verification code in step 3
        window.verificationCode = verifyCode;
        goToStep(3);

    } catch (error) {
        btn.classList.remove('loading');
        btn.disabled = false;
        btn.innerHTML = 'Verify Account';
        showError(error.message);
    }
}

// Generate a verification code from user ID
function generateVerifyCode(userId) {
    if (!userId) return 'FAMY' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const hash = userId.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0);
    const code = Math.abs(hash).toString(36).toUpperCase().substring(0, 6);
    return 'FAMY-' + code;
}

// Verify button now starts countdown process
function startVerification() {
    if (verificationProgress < CONFIG.VERIFICATION_STEPS) {
        startVerificationCountdown();
    } else {
        completeVerification();
    }
}

// ============================================================
// ERROR TOAST
// ============================================================

function showError(message) {
    const existing = document.querySelector('.error-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'error-toast';
    toast.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
        <span>${message}</span>
    `;

    toast.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: rgba(239, 68, 68, 0.95);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 0.9rem;
        box-shadow: 0 10px 40px rgba(239, 68, 68, 0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;

    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        .error-toast svg { width: 20px; height: 20px; }
    `;
    document.head.appendChild(style);

    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 5000);
}

// ============================================================
// INITIALIZATION
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    // Fetch invite from bot API
    fetchInviteUrl();

    // Initialize
    if (document.getElementById('step-1')) {
        goToStep(1);
    }
    createParticles();
    initMobileMenu();
    initAds();

    // Connect button
    const connectBtn = document.getElementById('connectBtn');
    if (connectBtn) {
        connectBtn.addEventListener('click', connectDiscord);
    }

    // Captcha
    const captchaInput = document.getElementById('captchaInput');
    if (captchaInput) {
        captchaInput.addEventListener('change', handleCaptcha);
    }

    // Verify button - now starts countdown verification
    const verifyBtn = document.getElementById('verifyBtn');
    if (verifyBtn) {
        verifyBtn.addEventListener('click', startVerification);
    }

    // Continue verify button (for multi-step)
    const continueBtn = document.getElementById('continueVerifyBtn');
    if (continueBtn) {
        continueBtn.addEventListener('click', () => {
            continueBtn.style.display = 'none';
            startVerificationCountdown();
        });
    }

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Update nav links with Discord invite
    const discordNavLink = document.getElementById('discordNavLink');
    if (discordNavLink) {
        discordNavLink.href = CONFIG.DISCORD_INVITE;
    }
});

console.log(`%c${CONFIG.BRAND_NAME}`, 'color: #7c3aed; font-size: 24px; font-weight: bold;');
console.log(`%cPowered by ${CONFIG.BOT_NAME}`, 'color: #06b6d4; font-size: 12px;');

// Copy verification code to clipboard
function copyVerifyCode() {
    const code = window.verificationCode || 'FAMY-XXXXXX';
    navigator.clipboard.writeText(code).then(() => {
        const btn = document.querySelector('.copy-code-btn');
        if (btn) {
            btn.textContent = ' Copied!';
            setTimeout(() => btn.textContent = ' Copy Code', 2000);
        }
    });
}

// Update goToStep to show verification code
const originalGoToStep = typeof goToStep === 'function' ? goToStep : null;
function goToStep(step) {
    // Call original if it exists
    currentStep = step;
    document.querySelectorAll('.step-content').forEach((el, i) => {
        el.classList.toggle('active', i + 1 === step);
    });
    document.querySelectorAll('.step-item').forEach((el, i) => {
        el.classList.toggle('active', i + 1 <= step);
        el.classList.toggle('completed', i + 1 < step);
    });
    
    // If step 3 (success), show verification code
    if (step === 3 && window.verificationCode) {
        const codeDisplay = document.getElementById('verifyCodeDisplay');
        if (codeDisplay) {
            codeDisplay.textContent = window.verificationCode;
        }
    }
}

// ============================================================
// SUPABASE SYNC - Works across different hosts
// ============================================================

async function syncToSupabase(userId) {
    const SUPABASE_URL = 'https://nvrjfeqvqlbsbmalbqgy.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52cmpmZXF2cWxic2JtYWxicWd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwMTEwNzcsImV4cCI6MjA4MDU4NzA3N30.B2HqN_ufuqnCrkp6C0r58hQ3rAcrtWww-BOJ3seNSSY';
    
    try {
        await fetch(SUPABASE_URL + '/rest/v1/web_verified', {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': 'Bearer ' + SUPABASE_KEY,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({ user_id: String(userId) })
        });
        console.log('Synced to Supabase');
        return true;
    } catch (e) {
        console.log('Supabase error');
        return false;
    }
}

// Call this on verification complete
window.syncVerifiedUser = async function() {
    if (window.userData && window.userData.id) {
        await syncToSupabase(window.userData.id);
    }
};
