// Baked-in Configuration
const CONFIG = {
    firebase: {
        apiKey: "AIzaSyDRQnwFFpgvmLm0QTq4QaHxD0tXEVy6lSs",
        authDomain: "mun-test-8f150.firebaseapp.com",
        databaseURL: "https://mun-test-8f150.firebaseio.com",
        projectId: "mun-test-8f150",
        storageBucket: "mun-test-8f150.firebasestorage.app",
        messagingSenderId: "221644066883",
        appId: "1:221644066883:web:06a98b7f6968a92fc0c4f6"
    },
    apiProviders: {
        perplexity: {
            name: "Perplexity",
            endpoint: "https://api.perplexity.ai/chat/completions",
            model: "sonar",
            infoUrl: "https://www.perplexity.ai/api",
            description: "Fast, accurate AI for research and analysis"
        },
        gemini: {
            name: "Gemini",
            endpoint: "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
            model: "gemini-pro",
            infoUrl: "https://ai.google.dev",
            description: "Google's advanced AI model"
        }
    },
    app: {
        appName: "mun dash",
        defaultCommittee: "UNGA",
        privacyPassword: "uwu"
    }
};

// Application State
const appData = {
    munSessions: [],
    notes: [],
    currentSessionId: null,
    privacyLocked: false,
    privacyEnabled: false,
    privacyPassword: null,
    userId: null,
    userEmail: null,
    apiProvider: null,
    apiKey: null,
    apiConfigured: false,
    userCountry: null,
    userCommittee: null,
    setupComplete: false,
    firebaseInitialized: false,
    isAuthenticated: false
};

// Committees List
const COMMITTEES = [
  { name: 'United Nations General Assembly', code: 'UNGA' },
  { name: 'United Nations Security Council', code: 'UNSC' },
  { name: 'UN Human Rights Council', code: 'UNHRC' },
  { name: 'UN Refugee Agency', code: 'UNHCR' },
  { name: 'World Trade Organization', code: 'WTO' },
  { name: 'UN for Women', code: 'UNW' },
  { name: 'Fédération Internationale de Football', code: 'FIFA' },
  { name: 'Fédération Internationale de l\'Automobile', code: 'FIA' },
  { name: 'UN Children\'s Fund', code: 'UNICEF' },
  { name: 'UN Development Programme', code: 'UNDP' },
  { name: 'World Health Organization', code: 'WHO' },
  { name: 'UNESCO', code: 'UNESCO' },
  { name: 'International Court of Justice', code: 'ICJ' },
  { name: 'International Monetary Fund', code: 'IMF' },
  { name: 'World Bank', code: 'WORLDBANK' },
  { name: 'Arctic Council', code: 'ARCTICCOUNCIL' },
  { name: 'ASEAN Summit', code: 'ASEAN' },
  { name: 'G20', code: 'G20' }
];

// Committee Data
const committeeCountries = {
    'UNGA': ['USA', 'Russia', 'China', 'UK', 'France', 'Germany', 'Japan', 'India', 'Brazil', 'Canada', 'Australia', 'South Korea', 'Turkey', 'Indonesia', 'Mexico', 'Argentina', 'South Africa', 'Egypt', 'Nigeria', 'Pakistan', 'Bangladesh', 'Iran', 'Saudi Arabia', 'UAE', 'Israel', 'Poland', 'Ukraine', 'Sweden', 'Norway', 'Netherlands', 'Belgium', 'Spain', 'Italy', 'Greece', 'Chile', 'Colombia', 'Peru', 'Venezuela', 'Vietnam', 'Thailand', 'Malaysia', 'Singapore', 'Philippines', 'New Zealand', 'Morocco', 'Kenya', 'Ethiopia', 'Algeria', 'Tunisia', 'Ghana', 'Tanzania', 'Uganda', 'Zambia', 'Zimbabwe', 'Switzerland', 'Austria', 'Denmark', 'Ireland', 'Portugal', 'Hungary', 'Croatia', 'Serbia', 'Bulgaria'],
    'UNHRC': ['USA', 'Russia', 'China', 'UK', 'France', 'Germany', 'Japan', 'India', 'Brazil', 'South Africa', 'Argentina', 'Mexico', 'Indonesia', 'Turkey', 'Saudi Arabia', 'UAE', 'Pakistan', 'Bangladesh', 'Nigeria', 'Egypt', 'Morocco', 'Kenya', 'Ethiopia', 'South Korea', 'Australia', 'Netherlands', 'Belgium', 'Sweden', 'Norway', 'Finland', 'Poland', 'Czech Republic', 'Romania', 'Ukraine', 'Chile', 'Colombia', 'Venezuela', 'Cuba', 'Bolivia', 'Peru', 'Philippines', 'Vietnam', 'Thailand', 'Malaysia', 'Singapore', 'New Zealand', 'Canada'],
    'UNSC': ['USA', 'Russia', 'China', 'UK', 'France', 'Japan', 'Germany', 'India', 'Brazil', 'South Africa', 'UAE', 'Albania', 'Ecuador', 'Malta', 'Mozambique'],
    'DISEC': ['USA', 'Russia', 'China', 'UK', 'France', 'Germany', 'Japan', 'India', 'Brazil', 'Canada', 'Australia', 'South Korea', 'Turkey', 'Indonesia', 'Mexico', 'Argentina', 'South Africa', 'Egypt', 'Nigeria', 'Pakistan', 'Bangladesh', 'Iran', 'Saudi Arabia', 'UAE', 'Israel', 'Poland', 'Ukraine', 'Sweden', 'Norway', 'Netherlands', 'Belgium', 'Spain', 'Italy', 'Greece', 'Chile', 'Colombia', 'Peru', 'Venezuela', 'Vietnam', 'Thailand', 'Malaysia', 'Singapore', 'Philippines', 'New Zealand', 'Morocco', 'Kenya', 'Ethiopia']
};

const swingStatesGlobal = ['Turkey', 'Brazil', 'Indonesia', 'South Africa', 'Mexico', 'Argentina', 'Sweden', 'Norway', 'UAE', 'Singapore', 'Malaysia', 'Vietnam', 'Thailand', 'Colombia', 'Chile'];

const speechTypes = ['General Speakers List (GSL)', 'Moderated Caucus 1', 'Moderated Caucus 2', 'Moderated Caucus 3', 'Unmoderated Caucus', 'Crisis Update', 'Debate', 'Q&A Session', 'Custom'];

// Utility Functions
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function showConfirm(title, message, onConfirm) {
    const modal = document.getElementById('confirm-modal');
    document.getElementById('confirm-title').textContent = title;
    document.getElementById('confirm-message').textContent = message;
    modal.classList.add('active');
    
    const yesBtn = document.getElementById('confirm-yes');
    const noBtn = document.getElementById('confirm-no');
    
    const handleYes = () => {
        onConfirm();
        modal.classList.remove('active');
        yesBtn.removeEventListener('click', handleYes);
        noBtn.removeEventListener('click', handleNo);
    };
    
    const handleNo = () => {
        modal.classList.remove('active');
        yesBtn.removeEventListener('click', handleYes);
        noBtn.removeEventListener('click', handleNo);
    };
    
    yesBtn.addEventListener('click', handleYes);
    noBtn.addEventListener('click', handleNo);
}

// Firebase Initialization
function initializeFirebase() {
    if (appData.firebaseInitialized) {
        console.log('✅ Firebase already initialized');
        return;
    }
    
    console.log('🔥 Initializing Firebase...');
    
    try {
        if (!window.firebase) {
            console.error('❌ Firebase SDK not loaded!');
            console.log('⚠️ Will retry in 2 seconds...');
            setTimeout(() => {
                console.log('🔄 Retrying Firebase initialization...');
                initializeFirebase();
            }, 2000);
            return;
        }
        
        firebase.initializeApp(CONFIG.firebase);
        appData.firebaseInitialized = true;
        console.log('✅ Firebase initialized successfully');
        console.log('📡 Database URL:', CONFIG.firebase.databaseURL);
        
        // Ensure admin account exists (non-blocking)
        setTimeout(() => ensureAdminAccount(), 1000);
        
        // Check if user is logged in (in-memory storage)
        if (appData.userId && appData.isAuthenticated) {
            console.log('👤 User session found:', appData.userId);
            console.log('📂 Loading user data from Firebase...');
            loadUserProfile();
        } else {
            appData.isAuthenticated = false;
            console.log('🔐 No active session - showing login');
            navigate('login');
        }
    } catch (error) {
        if (error.code === 'app/duplicate-app') {
            console.log('⚠️ Firebase already initialized (duplicate app error)');
            appData.firebaseInitialized = true;
            setTimeout(() => ensureAdminAccount(), 1000);
            if (!appData.userId || !appData.isAuthenticated) {
                navigate('login');
            }
        } else {
            console.error('❌ Firebase initialization error:', error);
            console.log('📌 Note: Login will still work with hardcoded credentials');
            // Don't show error toast - login will work anyway
            navigate('login');
        }
    }
}

// Initialize admin account if it doesn't exist
function ensureAdminAccount() {
    console.log('🔧 Ensuring admin account exists in Firebase...');
    
    if (!window.firebase || !appData.firebaseInitialized) {
        console.log('⚠️ Firebase not ready, skipping admin account check');
        return;
    }
    
    const database = firebase.database();
    const adminRef = database.ref('users/faraz');
    
    // Set timeout for admin check
    const timeoutId = setTimeout(() => {
        console.log('⏰ Admin check timeout - this is OK, hardcoded login works regardless');
    }, 5000);
    
    adminRef.once('value', 
        (snapshot) => {
            clearTimeout(timeoutId);
            if (!snapshot.exists()) {
                console.log('⚠️ Admin account not found in Firebase - creating...');
                // Create admin account
                adminRef.set({
                    username: 'faraz',
                    password: 'faraz123',
                    name: 'Admin',
                    isAdmin: true,
                    createdAt: Date.now()
                }).then(() => {
                    console.log('✅ Admin account created successfully in Firebase');
                    console.log('   Username: faraz');
                    console.log('   Password: faraz123');
                }).catch(error => {
                    console.error('❌ Error creating admin account:', error);
                    console.log('📌 Note: Login still works with hardcoded credentials');
                });
            } else {
                console.log('✅ Admin account exists in Firebase');
            }
        },
        (error) => {
            clearTimeout(timeoutId);
            console.error('❌ Error checking admin account:', error);
            console.log('📌 Note: Login still works with hardcoded credentials');
        }
    );
}

// Load user profile and check preferences
function loadUserProfile() {
    if (!appData.userId) {
        console.log('❌ Cannot load profile - no userId set');
        navigate('login');
        return;
    }
    
    if (!appData.firebaseInitialized || !window.firebase) {
        console.log('⚠️ Firebase not ready - going to initial setup');
        navigate('initial-setup');
        return;
    }
    
    console.log('📂 Loading user profile for:', appData.userId);
    
    const database = firebase.database();
    const userRef = database.ref(`users/${appData.userId}`);
    
    // Create timeout for profile loading (3 seconds)
    const timeoutId = setTimeout(() => {
        console.log('⏰ Profile loading timeout - redirecting to initial setup');
        navigate('initial-setup');
    }, 3000);
    
    // Load preferences (API, country, committee)
    userRef.child('preferences').once('value', 
        (snapshot) => {
            clearTimeout(timeoutId);
            const prefs = snapshot.val();
            console.log('⚙️ Preferences:', prefs ? 'Found' : 'Not configured');
            
            if (prefs && prefs.apiProvider && prefs.apiKey && prefs.country && prefs.defaultCommittee) {
                // All preferences set - load and continue
                appData.apiProvider = prefs.apiProvider;
                appData.apiKey = prefs.apiKey;
                appData.userCountry = prefs.country;
                appData.userCommittee = prefs.defaultCommittee;
                appData.apiConfigured = true;
                appData.setupComplete = true;
                
                console.log('✅ Setup complete - loading user data');
                
                // Load all user data from Firebase
                loadDataFromFirebase();
                
                // Navigate to dashboard immediately (NO SESSIONS PAGE)
                console.log('🚀 Navigating to dashboard');
                navigate('dashboard');
            } else {
                // No preferences configured, show INITIAL SETUP
                console.log('➡️ No preferences - navigating to INITIAL SETUP');
                navigate('initial-setup');
            }
        },
        (error) => {
            clearTimeout(timeoutId);
            console.error('❌ Error loading user profile:', error);
            console.log('🔄 Proceeding to initial setup despite error');
            navigate('initial-setup');
        }
    );
}

// Load data from Firebase
function loadDataFromFirebase() {
    if (!appData.userId || !appData.firebaseInitialized) return;
    
    console.log('📂 Loading ALL data from Firebase for user:', appData.userId);
    
    const database = firebase.database();
    const userRef = database.ref(`users/${appData.userId}`);
    
    // Load MUN sessions (with all nested data)
    userRef.child('munSessions').on('value', (snapshot) => {
        const sessions = snapshot.val();
        if (sessions) {
            appData.munSessions = Object.keys(sessions).map(key => ({
                id: key,
                ...sessions[key],
                verbatims: sessions[key].verbatims || {},
                speeches: sessions[key].speeches || [],
                blocData: sessions[key].blocData || {}
            }));
            console.log('✅ Loaded', appData.munSessions.length, 'sessions from Firebase');
        } else {
            appData.munSessions = [];
        }
    });
    
    // Load notes
    userRef.child('notes').on('value', (snapshot) => {
        const notes = snapshot.val();
        if (notes) {
            appData.notes = Object.keys(notes).map(key => ({
                id: key,
                ...notes[key]
            }));
            console.log('✅ Loaded', appData.notes.length, 'notes from Firebase');
        } else {
            appData.notes = [];
        }
    });
    
    console.log('🔄 Real-time Firebase sync active');
}

// Save data to Firebase
function saveToFirebase(path, data) {
    if (!appData.userId || !appData.firebaseInitialized) {
        console.warn('⚠️ Firebase not ready - data will be saved when connected');
        return Promise.resolve();
    }
    
    console.log('💾 Saving to Firebase:', path);
    
    const database = firebase.database();
    return database.ref(`users/${appData.userId}/${path}`).set(data)
        .then(() => {
            console.log('✅ Saved successfully:', path);
        })
        .catch(error => {
            console.error('❌ Firebase save error:', error);
            showToast('Failed to save to Firebase');
        });
}

// AI API Integration (Perplexity or Gemini)
async function callAIAPI(prompt) {
    if (!appData.apiKey || !appData.apiProvider) {
        showToast('Please configure your API key in settings');
        return null;
    }
    
    try {
        if (appData.apiProvider === 'perplexity') {
            return await callPerplexityAPI(prompt);
        } else if (appData.apiProvider === 'gemini') {
            return await callGeminiAPI(prompt);
        }
    } catch (error) {
        console.error('AI API Error:', error);
        showToast('AI request failed. Please check your API key.');
        return null;
    }
}

async function callPerplexityAPI(prompt) {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${appData.apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'sonar',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 500,
            temperature: 0.7
        })
    });
    
    if (!response.ok) throw new Error('Perplexity API request failed');
    const data = await response.json();
    return data.choices[0].message.content;
}

async function callGeminiAPI(prompt) {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${appData.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
        })
    });
    
    if (!response.ok) throw new Error('Gemini API request failed');
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

function parseQuestionsFromAI(text) {
    const questions = [];
    const lines = text.split('\n').filter(line => line.trim());
    
    let currentQuestion = null;
    for (const line of lines) {
        if (line.match(/^Q\d+:/i) || line.match(/^\d+\./)) {
            if (currentQuestion) questions.push(currentQuestion);
            currentQuestion = { text: line.replace(/^Q\d+:/i, '').replace(/^\d+\./, '').trim(), sources: '' };
        } else if (line.match(/^Source:/i) && currentQuestion) {
            currentQuestion.sources = line.replace(/^Source:/i, '').trim();
        } else if (currentQuestion && !currentQuestion.sources) {
            currentQuestion.text += ' ' + line.trim();
        }
    }
    if (currentQuestion) questions.push(currentQuestion);
    
    return questions;
}

function parseReasonsFromAI(text) {
    const reasons = [];
    const lines = text.split('\n').filter(line => line.trim());
    
    for (const line of lines) {
        const match = line.match(/^\d+\.\s*([^:]+):\s*(.+)$/);
        if (match) {
            reasons.push({ keyword: match[1].trim(), detail: match[2].trim() });
        }
    }
    
    return reasons;
}

// Initial Setup Page (First Time Only)
function renderInitialSetup() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="setup-container fade-in">
            <div class="bokeh-bg"></div>
            
            <div class="setup-card">
                <h1>Complete Your Profile</h1>
                <p>Set up once - then you're ready to go!</p>
                
                <form id="initial-setup-form" class="setup-form">
                    <!-- Country -->
                    <div class="form-group">
                        <label class="form-label">Your Country</label>
                        <input type="text" id="setup-country" class="form-input" placeholder="e.g., Switzerland" required>
                    </div>
                    
                    <!-- Committee Grid - CARDS ONLY -->
                    <div class="form-group">
                        <label class="form-label">Select Committee</label>
                        <div class="committee-grid" id="setup-committee-grid">
                            <!-- Cards generated by JS -->
                        </div>
                        <input type="hidden" id="setup-committee" required>
                    </div>
                    
                    <!-- API Provider Grid - CARDS ONLY -->
                    <div class="form-group">
                        <label class="form-label">Select AI Provider</label>
                        <div class="api-grid" id="setup-api-grid">
                            <!-- Generated by JS -->
                        </div>
                        <input type="hidden" id="setup-api" required>
                    </div>
                    
                    <!-- API Key -->
                    <div class="form-group">
                        <label class="form-label">API Key</label>
                        <input type="password" id="setup-api-key" class="form-input" placeholder="Paste your API key" required>
                    </div>
                    
                    <button type="submit" class="btn-primary btn-large">Complete Setup</button>
                    
                    <div class="api-error" style="display: none;"></div>
                    <div class="api-success" style="display: none;"></div>
                </form>
            </div>
        </div>
    `;
    
    setTimeout(() => {
        initializeSetupPage();
    }, 100);
}

function initializeSetupPage() {
    const committeeGrid = document.getElementById('setup-committee-grid');
    const apiGrid = document.getElementById('setup-api-grid');
    let selectedCommittee = null;
    let selectedApi = null;
    
    // Generate committee cards
    COMMITTEES.forEach(committee => {
        const card = document.createElement('div');
        card.className = 'committee-card';
        card.dataset.code = committee.code;
        card.innerHTML = `
            <div class="committee-code">${committee.code}</div>
            <div class="committee-name">${committee.name}</div>
        `;
        
        card.addEventListener('click', () => {
            if (selectedCommittee === card) {
                // Deselect
                card.classList.remove('selected');
                document.getElementById('setup-committee').value = '';
                selectedCommittee = null;
                committeeGrid.querySelectorAll('.committee-card').forEach(c => c.classList.remove('disabled'));
            } else {
                // Select this
                if (selectedCommittee) {
                    selectedCommittee.classList.remove('selected');
                }
                card.classList.add('selected');
                document.getElementById('setup-committee').value = committee.code;
                selectedCommittee = card;
                // Disable others
                committeeGrid.querySelectorAll('.committee-card').forEach(c => {
                    if (c !== card) c.classList.add('disabled');
                });
            }
        });
        
        committeeGrid.appendChild(card);
    });
    
    // Generate API cards
    const providers = [
        { name: 'Perplexity', code: 'perplexity', icon: '🚀', desc: 'Fast, accurate AI' },
        { name: 'Gemini', code: 'gemini', icon: '✨', desc: "Google's AI" }
    ];
    
    providers.forEach(provider => {
        const card = document.createElement('div');
        card.className = 'api-card';
        card.dataset.provider = provider.code;
        card.innerHTML = `
            <div class="api-icon">${provider.icon}</div>
            <div class="api-title">${provider.name}</div>
            <div class="api-desc">${provider.desc}</div>
        `;
        
        card.addEventListener('click', () => {
            if (selectedApi === card) {
                // Deselect
                card.classList.remove('selected');
                document.getElementById('setup-api').value = '';
                selectedApi = null;
                apiGrid.querySelectorAll('.api-card').forEach(c => c.classList.remove('disabled'));
            } else {
                // Select this
                if (selectedApi) {
                    selectedApi.classList.remove('selected');
                }
                card.classList.add('selected');
                document.getElementById('setup-api').value = provider.code;
                selectedApi = card;
                // Disable others
                apiGrid.querySelectorAll('.api-card').forEach(c => {
                    if (c !== card) c.classList.add('disabled');
                });
            }
        });
        
        apiGrid.appendChild(card);
    });
    
    // Form submit
    document.getElementById('initial-setup-form').addEventListener('submit', handleInitialSetup);
}



async function handleInitialSetup(e) {
    e.preventDefault();
    
    const country = document.getElementById('setup-country').value.trim();
    const committee = document.getElementById('setup-committee').value;
    const apiProvider = document.getElementById('setup-api').value;
    const apiKey = document.getElementById('setup-api-key').value.trim();
    
    if (!country || !committee || !apiProvider || !apiKey) {
        const errorDiv = document.querySelector('.api-error');
        if (errorDiv) {
            errorDiv.textContent = 'Please complete all fields';
            errorDiv.style.display = 'block';
            setTimeout(() => { errorDiv.style.display = 'none'; }, 3000);
        }
        return;
    }
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.innerHTML = '<span class="loading"></span> Saving to Firebase...';
    submitBtn.disabled = true;
    
    console.log('='.repeat(50));
    console.log('💾 INITIAL SETUP - SAVING TO FIREBASE');
    console.log('='.repeat(50));
    
    // Save preferences to Firebase
    const preferences = {
        country: country,
        defaultCommittee: committee,
        apiProvider: apiProvider,
        apiKey: apiKey,
        createdAt: Date.now(),
        setupCompleted: true
    };
    
    console.log('🌍 Country:', country);
    console.log('🏛️ Committee:', committee);
    console.log('🤖 API Provider:', apiProvider);
    console.log('🔑 API Key:', apiKey ? '***' + apiKey.slice(-4) : 'none');
    
    await saveToFirebase('preferences', preferences);
    console.log('✅ Preferences saved to Firebase');
    
    // Update app data
    appData.apiProvider = apiProvider;
    appData.apiKey = apiKey;
    appData.userCountry = country;
    appData.userCommittee = committee;
    appData.apiConfigured = true;
    appData.setupComplete = true;
    
    const successDiv = document.querySelector('.api-success');
    if (successDiv) {
        successDiv.textContent = '✅ Setup complete! All data saved to Firebase.';
        successDiv.style.display = 'block';
    }
    
    console.log('🔄 Starting real-time Firebase sync...');
    loadDataFromFirebase();
    
    console.log('='.repeat(50));
    
    setTimeout(() => {
        navigate('dashboard');
    }, 1000);
}

// Account Settings Modal
function showAccountSettings() {
    const modal = document.getElementById('api-key-modal');
    const content = modal.querySelector('.modal-content');
    
    content.innerHTML = `
        <h3>Account Settings</h3>
        
        <div class="form-group">
            <label class="form-label">Username</label>
            <input type="text" class="form-input" value="${appData.userId}" disabled>
        </div>
        
        <div class="form-group">
            <label class="form-label">Country</label>
            <input type="text" class="form-input" id="settings-country" value="${appData.userCountry || ''}" placeholder="Your country">
        </div>
        
        <div class="form-group">
            <label class="form-label">Default Committee</label>
            <select class="form-input" id="settings-committee">
                ${COMMITTEES.map(c => `<option value="${c.code}" ${appData.userCommittee === c.code ? 'selected' : ''}>${c.code} - ${c.name}</option>`).join('')}
            </select>
        </div>
        
        <div class="form-group">
            <label class="form-label">Change Password</label>
            <input type="password" class="form-input" id="settings-current-password" placeholder="Current password">
            <input type="password" class="form-input" id="settings-new-password" placeholder="New password" style="margin-top: 8px;">
            <input type="password" class="form-input" id="settings-confirm-password" placeholder="Confirm new password" style="margin-top: 8px;">
        </div>
        
        <div class="form-group">
            <label class="form-label">API Provider</label>
            <select class="form-input" id="settings-provider">
                <option value="perplexity" ${appData.apiProvider === 'perplexity' ? 'selected' : ''}>Perplexity</option>
                <option value="gemini" ${appData.apiProvider === 'gemini' ? 'selected' : ''}>Gemini</option>
            </select>
        </div>
        
        <div class="form-group">
            <label class="form-label">API Key</label>
            <input type="password" class="form-input" id="settings-api-key" value="${appData.apiKey || ''}" placeholder="Enter new API key">
        </div>
        
        <div class="modal-actions">
            <button id="save-settings" class="btn btn-primary">Save Changes</button>
            <button id="logout-btn" class="btn btn-error">Logout</button>
            <button id="cancel-settings" class="btn btn-secondary">Close</button>
        </div>
    `;
    
    modal.classList.add('active');
    
    document.getElementById('save-settings').addEventListener('click', saveAccountSettings);
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
    document.getElementById('cancel-settings').addEventListener('click', () => modal.classList.remove('active'));
}

async function saveAccountSettings() {
    const country = document.getElementById('settings-country').value.trim();
    const committee = document.getElementById('settings-committee').value;
    const currentPassword = document.getElementById('settings-current-password').value;
    const newPassword = document.getElementById('settings-new-password').value;
    const confirmPassword = document.getElementById('settings-confirm-password').value;
    const provider = document.getElementById('settings-provider').value;
    const apiKey = document.getElementById('settings-api-key').value;
    
    if (!apiKey || !country || !committee) {
        showToast('Please fill all required fields');
        return;
    }
    
    // Handle password change if provided
    const VALID_CREDENTIALS = {
        'faraz': 'faraz123',
        'harshit': 'uwu'
    };
    
    if (currentPassword || newPassword || confirmPassword) {
        if (!currentPassword || !newPassword || !confirmPassword) {
            showToast('Please fill all password fields');
            return;
        }
        
        if (VALID_CREDENTIALS[appData.userId] !== currentPassword) {
            showToast('Current password is incorrect');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            showToast('New passwords do not match');
            return;
        }
        
        // Update password in Firebase IMMEDIATELY
        console.log('💾 Updating password in Firebase...');
        await saveToFirebase('profile/password', newPassword);
        showToast('Password updated in Firebase!');
    }
    
    // Update preferences
    appData.apiProvider = provider;
    appData.apiKey = apiKey;
    appData.userCountry = country;
    appData.userCommittee = committee;
    
    const preferences = {
        country: country,
        defaultCommittee: committee,
        apiProvider: provider,
        apiKey: apiKey,
        updatedAt: Date.now()
    };
    
    console.log('💾 Saving preferences to Firebase...');
    await saveToFirebase('preferences', preferences);
    document.getElementById('api-key-modal').classList.remove('active');
    showToast('All settings saved to Firebase!');
}

function handleLogout() {
    // Clear app data in memory
    appData.userId = null;
    appData.userEmail = null;
    appData.apiProvider = null;
    appData.apiKey = null;
    appData.apiConfigured = false;
    appData.isAuthenticated = false;
    appData.munSessions = [];
    appData.notes = [];
    appData.currentSessionId = null;
    appData.setupComplete = false;
    
    console.log('User logged out');
    showToast('Logged out successfully');
    
    // Close any open modals
    document.getElementById('api-key-modal').classList.remove('active');
    
    navigate('login');
}

// Routing
function navigate(view, sessionId = null) {
    if (appData.privacyLocked && view !== 'login' && view !== 'signup') return;
    
    const app = document.getElementById('app');
    
    if (sessionId) {
        appData.currentSessionId = sessionId;
    }
    
    switch(view) {
        case 'login':
            renderLogin();
            break;
        case 'initial-setup':
            renderInitialSetup();
            break;
        case 'api-setup':
            renderAPISetup();
            break;
        case 'welcome':
            renderWelcome();
            break;
        case 'sessions':
            renderSessions();
            break;
        case 'dashboard':
            renderDashboard();
            break;
        case 'verbatim':
            renderVerbatim();
            break;
        case 'speech':
            renderSpeech();
            break;
        case 'bloc':
            renderBloc();
            break;
        case 'resolution':
            renderResolutionGenerator();
            break;
        case 'position':
            renderPositionPaper();
            break;
        case 'country-profile':
            renderCountryProfiles();
            break;
        case 'voting-matrix':
            renderVotingMatrix();
            break;
        case 'notes-tool':
            renderResearchNotes();
            break;
        case 'debate':
            renderDebateStrategy();
            break;
        case 'amendments':
            renderAmendmentTracker();
            break;
        case 'speaker-list':
            renderSpeakerList();
            break;
        case 'questions':
            renderQuestionBank();
            break;
        case 'timeline':
            renderTimeline();
            break;
        case 'negotiation':
            renderNegotiationTracker();
            break;
        case 'media':
            renderMediaBrief();
            break;
        case 'scorecard':
            renderScorecard();
            break;
        case 'awards':
            renderAwardPredictor();
            break;
    }
}

// Login Screen
function renderLogin() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="welcome-screen fade-in">
            <div class="card welcome-card">
                <h1 class="welcome-title">${CONFIG.app.appName}</h1>
                <p class="welcome-subtitle">Login to continue</p>
                
                <div id="firebase-status" style="text-align: center; margin-bottom: 16px; color: var(--text-secondary); font-size: 14px;">
                    <span class="loading" style="display: inline-block; width: 16px; height: 16px; margin-right: 8px;"></span>
                    Connecting to Firebase...
                </div>
                
                <form id="login-form">
                    <div class="form-group">
                        <label class="form-label">Username</label>
                        <input type="text" class="form-input" id="login-username" required placeholder="Enter username" autocomplete="off">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Password</label>
                        <input type="password" class="form-input" id="login-password" required placeholder="Enter password" autocomplete="off">
                    </div>
                    
                    <p id="login-error" class="error-text" style="display:none;"></p>
                    
                    <button type="submit" class="btn btn-primary full-width" id="login-btn">Login</button>
                </form>
            </div>
        </div>
    `;
    
    // Check Firebase status and connectivity
    const statusEl = document.getElementById('firebase-status');
    
    // Remove the status message after brief check
    setTimeout(() => {
        statusEl.style.display = 'none';
    }, 1000);
    
    // Listen for online/offline events (optional, but no longer shows as blocking login)
    window.addEventListener('online', () => {
        statusEl.innerHTML = '<span style="color: var(--success); font-weight:600;">Back online</span>';
    });
    
    window.addEventListener('offline', () => {
        statusEl.innerHTML = '<span style="color: var(--error); font-weight:600;">Internet connection lost</span>';
    });
    
    document.getElementById('login-form').addEventListener('submit', handleLogin);
}

async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    const errorEl = document.getElementById('login-error');
    const loginBtn = document.getElementById('login-btn');
    
    console.log('🔐 LOGIN attempt for:', username);
    
    // Validate input
    if (!username || !password) {
        errorEl.textContent = 'Please enter both username and password';
        errorEl.style.display = 'block';
        setTimeout(() => { errorEl.style.display = 'none'; }, 3000);
        return;
    }
    
    // Show loading state
    loginBtn.innerHTML = '<span class="loading"></span> Logging in...';
    loginBtn.disabled = true;
    errorEl.style.display = 'none';
    
    // HARDCODED CREDENTIALS - CHECK IMMEDIATELY
    const VALID_CREDENTIALS = {
        'faraz': 'faraz123',
        'harshit': 'uwu'
    };
    
    // Check credentials FIRST - no async delay
    if (VALID_CREDENTIALS[username] !== password) {
        console.log('❌ Invalid credentials');
        errorEl.textContent = 'Invalid username or password';
        errorEl.style.display = 'block';
        loginBtn.innerHTML = 'Login';
        loginBtn.disabled = false;
        return;
    }
    
    // Credentials valid - set user data immediately
    console.log('✅ Credentials valid!');
    appData.userId = username;
    appData.userEmail = username;
    appData.isAuthenticated = true;
    
    showToast('Login successful!');
    
    // Now check Firebase for user preferences (non-blocking)
    if (window.firebase && appData.firebaseInitialized) {
        console.log('📡 Loading user profile from Firebase...');
        loadUserProfile();
    } else {
        console.log('⚠️ Firebase not ready - going to initial setup');
        loginBtn.innerHTML = 'Login';
        loginBtn.disabled = false;
        setTimeout(() => navigate('initial-setup'), 500);
    }
}

// Signup removed - accounts managed manually by admin

// Initialize Custom Select
function initializeCustomSelect() {
    const selectHeader = document.getElementById('select-header');
    const selectOptions = document.getElementById('select-options');
    const selectOptionsItems = document.querySelectorAll('.select-option');
    const hiddenInput = document.getElementById('api-provider');
    const descDiv = document.getElementById('provider-desc');
    
    const descriptions = {
        perplexity: '🚀 Fast, accurate AI perfect for research and analysis. Great for generating questions and diplomatic insights.',
        gemini: '✨ Google\'s most advanced AI model. Powerful for complex reasoning and detailed analysis.'
    };
    
    // Toggle options
    selectHeader.addEventListener('click', (e) => {
        e.stopPropagation();
        selectOptions.classList.toggle('active');
        selectHeader.classList.toggle('active');
    });
    
    // Select option
    selectOptionsItems.forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Remove selected from others
            selectOptionsItems.forEach(o => o.classList.remove('selected'));
            
            // Add selected to this
            option.classList.add('selected');
            
            // Update header text
            const title = option.querySelector('.option-title').textContent;
            selectHeader.querySelector('.select-placeholder').textContent = title;
            
            // Update hidden input
            const value = option.dataset.value;
            hiddenInput.value = value;
            
            // Update description
            descDiv.textContent = descriptions[value] || '';
            
            // Close options
            selectOptions.classList.remove('active');
            selectHeader.classList.remove('active');
            
            // Trigger change event
            hiddenInput.dispatchEvent(new Event('change'));
            
            // Show animation
            option.style.animation = 'none';
            setTimeout(() => {
                option.style.animation = '';
            }, 10);
        });
    });
    
    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!selectHeader.contains(e.target) && !selectOptions.contains(e.target)) {
            selectOptions.classList.remove('active');
            selectHeader.classList.remove('active');
        }
    });
}

// API Setup Screen
function renderAPISetup() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="api-container fade-in">
            <div class="bokeh-bg"></div>
            
            <div class="setup-card">
                <h1 class="setup-title">Configure Your AI Provider</h1>
                <p class="setup-subtitle">Choose which AI to power your questions and analysis</p>
                
                <form id="api-form" class="api-form">
                    <div class="form-group">
                        <label for="api-provider" class="form-label">API Provider</label>
                        
                        <!-- Hidden Native Select -->
                        <select id="api-provider" style="display: none;" required>
                            <option value="">Choose a provider...</option>
                            <option value="perplexity">Perplexity</option>
                            <option value="gemini">Gemini</option>
                        </select>
                        
                        <!-- Custom Select Dropdown -->
                        <div class="custom-select-container">
                            <div class="select-header" id="select-header">
                                <span class="select-placeholder">Choose a provider...</span>
                                <div class="select-icon">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                </div>
                            </div>
                            <div class="select-options" id="select-options">
                                <div class="select-option" data-value="perplexity">
                                    <div class="option-icon">🚀</div>
                                    <div class="option-content">
                                        <div class="option-title">Perplexity</div>
                                        <div class="option-desc">Fast, accurate AI for research</div>
                                    </div>
                                    <div class="option-checkmark">✓</div>
                                </div>
                                <div class="select-option" data-value="gemini">
                                    <div class="option-icon">✨</div>
                                    <div class="option-content">
                                        <div class="option-title">Gemini</div>
                                        <div class="option-desc">Google's advanced AI model</div>
                                    </div>
                                    <div class="option-checkmark">✓</div>
                                </div>
                            </div>
                        </div>
                        
                        <p class="provider-description" id="provider-desc"></p>
                    </div>
                    
                    <div class="form-group">
                        <label for="api-key" class="form-label">API Key</label>
                        <input 
                            type="password" 
                            id="api-key" 
                            name="api-key"
                            class="form-input"
                            placeholder="Paste your API key"
                            autocomplete="off"
                            required
                        >
                        <p class="form-hint">Your API key is stored securely and never shared</p>
                    </div>
                    
                    <div class="button-group">
                        <button type="button" id="test-api-btn" class="btn-secondary">Test API</button>
                        <button type="submit" id="save-api-btn" class="btn-primary">Save Configuration</button>
                    </div>
                    
                    <button type="button" id="skip-api-btn" class="btn-skip">Skip for Now</button>
                    
                    <div class="api-error" style="display: none;"></div>
                    <div class="api-success" style="display: none;"></div>
                </form>
                
                <div class="help-section">
                    <p class="help-title">How to get your API key:</p>
                    <div class="help-links">
                        <a href="https://www.perplexity.ai/api" target="_blank" class="help-link" id="perplexity-link" style="display: none;">
                            → Get Perplexity API Key
                        </a>
                        <a href="https://ai.google.dev" target="_blank" class="help-link" id="gemini-link" style="display: none;">
                            → Get Gemini API Key
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Initialize custom dropdown
    setTimeout(() => {
        initializeCustomSelect();
    }, 100);
    
    const providerSelect = document.getElementById('api-provider');
    const apiKeyInput = document.getElementById('api-key');
    const saveBtn = document.getElementById('save-api-btn');
    const testBtn = document.getElementById('test-api-btn');
    const skipBtn = document.getElementById('skip-api-btn');
    
    // Test API
    testBtn.addEventListener('click', () => {
        const provider = providerSelect.value;
        const apiKey = apiKeyInput.value.trim();
        
        if (!provider || !apiKey) {
            showAPIError('Please select a provider and enter an API key');
            return;
        }
        
        testAPIKeyBeautiful(provider, apiKey);
    });
    
    // Listen for provider changes from custom dropdown
    providerSelect.addEventListener('change', (e) => {
        const provider = e.target.value;
        // Show/hide help links
        document.getElementById('perplexity-link').style.display = provider === 'perplexity' ? 'inline-block' : 'none';
        document.getElementById('gemini-link').style.display = provider === 'gemini' ? 'inline-block' : 'none';
    });
    
    // Save API
    saveBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const provider = providerSelect.value;
        const apiKey = apiKeyInput.value.trim();
        
        if (!provider) {
            showAPIError('Please select a provider');
            return;
        }
        
        if (!apiKey) {
            showAPIError('Please enter your API key');
            return;
        }
        
        handleAPISetupBeautiful(provider, apiKey);
    });
    
    // Skip
    skipBtn.addEventListener('click', () => {
        navigate('dashboard');
    });
}

function showAPIError(msg) {
    const errorDiv = document.querySelector('.api-error');
    errorDiv.textContent = msg;
    errorDiv.style.display = 'block';
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 4000);
}

function showAPISuccess(msg) {
    const successDiv = document.querySelector('.api-success');
    successDiv.textContent = msg;
    successDiv.style.display = 'block';
    setTimeout(() => {
        successDiv.style.display = 'none';
    }, 4000);
}

async function testAPIKeyBeautiful(provider, apiKey) {
    showAPISuccess('Testing API key...');
    
    const testBtn = document.getElementById('test-api-btn');
    testBtn.innerHTML = '<span class="loading"></span> Testing...';
    testBtn.disabled = true;
    
    // Temporarily set the API config for testing
    const oldProvider = appData.apiProvider;
    const oldKey = appData.apiKey;
    appData.apiProvider = provider;
    appData.apiKey = apiKey;
    
    const result = await callAIAPI('Say hello in one word');
    
    // Restore old values
    appData.apiProvider = oldProvider;
    appData.apiKey = oldKey;
    
    testBtn.innerHTML = 'Test API';
    testBtn.disabled = false;
    
    if (result) {
        showAPISuccess('✅ API key is valid!');
    } else {
        showAPIError('❌ Invalid API key. Please check and try again.');
    }
}

async function handleAPISetupBeautiful(provider, apiKey) {
    const saveBtn = document.getElementById('save-api-btn');
    saveBtn.innerHTML = '<span class="loading"></span> Saving...';
    saveBtn.disabled = true;
    
    appData.apiProvider = provider;
    appData.apiKey = apiKey;
    appData.apiConfigured = true;
    
    // Save to Firebase
    const apiConfig = {
        provider: provider,
        apiKey: apiKey,
        createdAt: Date.now(),
        lastUpdated: Date.now()
    };
    
    await saveToFirebase('apiConfig', apiConfig);
    loadDataFromFirebase();
    
    showAPISuccess('✅ API configuration saved successfully!');
    
    setTimeout(() => {
        navigate('dashboard');
    }, 1500);
}



// Initialize Committee Dropdowns (Beautiful Custom Selects)
function initializeCommitteeSelects() {
    console.log('🎨 Initializing beautiful committee dropdowns');
    
    // Find all custom select wrappers
    const selectWrappers = document.querySelectorAll('.custom-select-wrapper');
    
    selectWrappers.forEach(wrapper => {
        const header = wrapper.querySelector('.select-header');
        const dropdown = wrapper.querySelector('.select-dropdown');
        const hiddenInput = wrapper.querySelector('input[type="hidden"]');
        
        if (!header || !dropdown || !hiddenInput) return;
        
        // Clear existing options
        dropdown.innerHTML = '';
        
        // Generate committee options
        COMMITTEES.forEach(committee => {
            const option = document.createElement('div');
            option.className = 'select-option';
            option.dataset.value = committee.code;
            option.innerHTML = `
                <span class="select-option-code">${committee.code}</span>
                <span class="select-option-name">${committee.name}</span>
            `;
            
            // Click handler for option
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                
                // Remove selected from all options
                dropdown.querySelectorAll('.select-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                
                // Add selected to this option
                option.classList.add('selected');
                
                // Update header text
                header.querySelector('.select-value').textContent = committee.code;
                
                // Update hidden input
                hiddenInput.value = committee.code;
                
                // Close dropdown
                dropdown.classList.remove('active');
                header.classList.remove('active');
                
                console.log('✅ Committee selected:', committee.code);
            });
            
            dropdown.appendChild(option);
        });
        
        // Toggle dropdown on header click
        header.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = dropdown.classList.contains('active');
            
            // Close all other dropdowns
            document.querySelectorAll('.select-dropdown.active').forEach(d => {
                if (d !== dropdown) d.classList.remove('active');
            });
            document.querySelectorAll('.select-header.active').forEach(h => {
                if (h !== header) h.classList.remove('active');
            });
            
            // Toggle this dropdown
            if (!isActive) {
                dropdown.classList.add('active');
                header.classList.add('active');
            } else {
                dropdown.classList.remove('active');
                header.classList.remove('active');
            }
        });
    });
    
    // Close dropdowns on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.custom-select-wrapper')) {
            document.querySelectorAll('.select-dropdown.active').forEach(d => {
                d.classList.remove('active');
            });
            document.querySelectorAll('.select-header.active').forEach(h => {
                h.classList.remove('active');
            });
        }
    });
    
    console.log('✨ Committee dropdowns initialized!');
}

// Welcome Screen
function renderWelcome() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="welcome-screen fade-in">
            <div class="card welcome-card">
                <h1 class="welcome-title">Create New Session</h1>
                <p class="welcome-subtitle">Start a new MUN research session</p>
                
                <form id="welcome-form">
                    <div class="form-group">
                        <label class="form-label">Your Name</label>
                        <input type="text" class="form-input" id="name" required placeholder="Enter your name">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Country</label>
                        <input type="text" class="form-input" id="country" required placeholder="Your country" value="${appData.userCountry || ''}">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Committee</label>
                        <select class="form-input" id="committee" required>
                            <option value="">Choose committee...</option>
                            ${COMMITTEES.map(c => `<option value="${c.code}" ${appData.userCommittee === c.code ? 'selected' : ''}>${c.code} - ${c.name}</option>`).join('')}
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Agenda</label>
                        <textarea class="form-textarea" id="agenda" required placeholder="e.g., Human rights violations in conflict zones"></textarea>
                    </div>
                    
                    <button type="submit" class="btn btn-primary full-width">Start Research</button>
                </form>
            </div>
        </div>
    `;
    
    document.getElementById('welcome-form').addEventListener('submit', handleWelcomeSubmit);
}

function handleWelcomeSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const country = document.getElementById('country').value;
    const committee = document.getElementById('committee').value;
    const agenda = document.getElementById('agenda').value;
    
    const sessionId = generateId();
    const session = {
        id: sessionId,
        name,
        country,
        committee,
        agenda,
        createdAt: Date.now(),
        verbatims: {},
        speeches: [],
        blocData: {}
    };
    
    appData.munSessions.push(session);
    appData.currentSessionId = session.id;
    
    // Update user preferences
    appData.userCountry = country;
    appData.userCommittee = committee;
    
    // Save session to Firebase
    console.log('💾 Creating new session in Firebase:', sessionId);
    const sessionData = { ...session };
    delete sessionData.id;
    saveToFirebase(`munSessions/${sessionId}`, sessionData);
    
    // Save updated preferences
    const preferences = {
        country: country,
        defaultCommittee: committee,
        apiProvider: appData.apiProvider,
        apiKey: appData.apiKey,
        updatedAt: Date.now()
    };
    saveToFirebase('preferences', preferences);
    
    showToast('Session created & saved to Firebase!');
    navigate('dashboard');
}

// Sessions List (DEPRECATED - kept for compatibility)
function renderSessions() {
    console.log('⚠️ Sessions view deprecated - redirecting to dashboard');
    navigate('dashboard');
}

// Dashboard
function renderDashboard() {
    // Create default session if none exists
    if (appData.munSessions.length === 0) {
        console.log('📝 Creating default session');
        const sessionId = generateId();
        const defaultSession = {
            id: sessionId,
            name: appData.userId,
            country: appData.userCountry,
            committee: appData.userCommittee,
            agenda: 'My Research Session',
            createdAt: Date.now(),
            verbatims: {},
            speeches: [],
            blocData: {}
        };
        appData.munSessions.push(defaultSession);
        appData.currentSessionId = sessionId;
        
        // Save to Firebase
        const sessionData = { ...defaultSession };
        delete sessionData.id;
        saveToFirebase(`munSessions/${sessionId}`, sessionData);
    }
    
    // Set current session if not set
    if (!appData.currentSessionId && appData.munSessions.length > 0) {
        appData.currentSessionId = appData.munSessions[0].id;
    }
    
    const session = appData.munSessions.find(s => s.id === appData.currentSessionId);
    if (!session) {
        console.error('❌ Session not found');
        return;
    }
    
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="container fade-in">
            <div class="dashboard-header">
                <div class="header-left">
                    <h1 id="session-title">Your MUN Dashboard</h1>
                    <p id="session-meta" style="color: var(--text-secondary); font-size: 14px; margin: 4px 0 0 0;">
                        Country: <span style="color: var(--text-primary); font-weight: 600;">${session.country}</span> | 
                        Committee: <span style="color: var(--text-primary); font-weight: 600;">${session.committee}</span>
                    </p>
                </div>
                <div class="header-right">
                    <button class="icon-btn" onclick="showAccountSettings()" title="Account Settings">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="3"></circle>
                            <path d="M12 1v6m0 6v6"></path>
                        </svg>
                    </button>
                </div>
            </div>
            
            <div style="margin-top: 32px;">
                <h2>Research Tools</h2>
            </div>
            <div class="tools-grid" style="margin-top: 24px;">
                <button class="card tool-card" onclick="navigateToTool('verbatim')" style="cursor: pointer; border: none; text-align: center; font-family: inherit;">
                    <div class="tool-icon">💬</div>
                    <h3>Verbatim Tracker</h3>
                    <p class="tool-subtitle">Track country speeches</p>
                </button>
                
                <button class="card tool-card" onclick="navigateToTool('speech')" style="cursor: pointer; border: none; text-align: center; font-family: inherit;">
                    <div class="tool-icon">📝</div>
                    <h3>Speech Organizer</h3>
                    <p class="tool-subtitle">Organize your speeches</p>
                </button>
                
                <button class="card tool-card" onclick="navigateToTool('bloc')" style="cursor: pointer; border: none; text-align: center; font-family: inherit;">
                    <div class="tool-icon">👥</div>
                    <h3>Bloc Builder</h3>
                    <p class="tool-subtitle">Map diplomatic relations</p>
                </button>
                
                <button class="card tool-card" onclick="navigateToTool('resolution')" style="cursor: pointer; border: none; text-align: center; font-family: inherit;">
                    <div class="tool-icon">📋</div>
                    <h3>Resolution Generator</h3>
                    <p class="tool-subtitle">Create resolution templates</p>
                </button>
                
                <button class="card tool-card" onclick="navigateToTool('position')" style="cursor: pointer; border: none; text-align: center; font-family: inherit;">
                    <div class="tool-icon">🎯</div>
                    <h3>Position Paper</h3>
                    <p class="tool-subtitle">Generate position papers</p>
                </button>
                
                <button class="card tool-card" onclick="navigateToTool('country-profile')" style="cursor: pointer; border: none; text-align: center; font-family: inherit;">
                    <div class="tool-icon">🌍</div>
                    <h3>Country Profiles</h3>
                    <p class="tool-subtitle">Country facts &amp; voting patterns</p>
                </button>
                
                <button class="card tool-card" onclick="navigateToTool('voting-matrix')" style="cursor: pointer; border: none; text-align: center; font-family: inherit;">
                    <div class="tool-icon">📊</div>
                    <h3>Voting Matrix</h3>
                    <p class="tool-subtitle">Predict votes &amp; build consensus</p>
                </button>
                
                <button class="card tool-card" onclick="navigateToTool('notes-tool')" style="cursor: pointer; border: none; text-align: center; font-family: inherit;">
                    <div class="tool-icon">📚</div>
                    <h3>Research Notes</h3>
                    <p class="tool-subtitle">Organize research &amp; notes</p>
                </button>
                
                <button class="card tool-card" onclick="navigateToTool('debate')" style="cursor: pointer; border: none; text-align: center; font-family: inherit;">
                    <div class="tool-icon">⚡</div>
                    <h3>Debate Strategy</h3>
                    <p class="tool-subtitle">Plan debate strategies</p>
                </button>
                
                <button class="card tool-card" onclick="navigateToTool('amendments')" style="cursor: pointer; border: none; text-align: center; font-family: inherit;">
                    <div class="tool-icon">✏️</div>
                    <h3>Amendment Tracker</h3>
                    <p class="tool-subtitle">Track resolution amendments</p>
                </button>
                
                <button class="card tool-card" onclick="navigateToTool('speaker-list')" style="cursor: pointer; border: none; text-align: center; font-family: inherit;">
                    <div class="tool-icon">🎤</div>
                    <h3>Speaker List</h3>
                    <p class="tool-subtitle">Manage speakers &amp; timing</p>
                </button>
                
                <button class="card tool-card" onclick="navigateToTool('questions')" style="cursor: pointer; border: none; text-align: center; font-family: inherit;">
                    <div class="tool-icon">❓</div>
                    <h3>Question Bank</h3>
                    <p class="tool-subtitle">Create Q&amp;A for prep</p>
                </button>
                
                <button class="card tool-card" onclick="navigateToTool('timeline')" style="cursor: pointer; border: none; text-align: center; font-family: inherit;">
                    <div class="tool-icon">📅</div>
                    <h3>Committee Timeline</h3>
                    <p class="tool-subtitle">Track deadlines &amp; events</p>
                </button>
                
                <button class="card tool-card" onclick="navigateToTool('negotiation')" style="cursor: pointer; border: none; text-align: center; font-family: inherit;">
                    <div class="tool-icon">🤝</div>
                    <h3>Negotiation Tracker</h3>
                    <p class="tool-subtitle">Document bilateral deals</p>
                </button>
                
                <button class="card tool-card" onclick="navigateToTool('media')" style="cursor: pointer; border: none; text-align: center; font-family: inherit;">
                    <div class="tool-icon">📢</div>
                    <h3>Media Brief</h3>
                    <p class="tool-subtitle">Create press releases</p>
                </button>
                
                <button class="card tool-card" onclick="navigateToTool('scorecard')" style="cursor: pointer; border: none; text-align: center; font-family: inherit;">
                    <div class="tool-icon">⭐</div>
                    <h3>Performance Card</h3>
                    <p class="tool-subtitle">Track your performance</p>
                </button>
                
                <button class="card tool-card" onclick="navigateToTool('awards')" style="cursor: pointer; border: none; text-align: center; font-family: inherit;">
                    <div class="tool-icon">🏆</div>
                    <h3>Award Predictor</h3>
                    <p class="tool-subtitle">Predict award chances</p>
                </button>
            </div>
        </div>
    `;
}

// Helper function to navigate to tools
function navigateToTool(tool) {
    console.log('🔧 Navigating to tool:', tool);
    navigate(tool);
}

// All 17 Tool Render Functions

function renderResolutionGenerator() {
    const session = appData.munSessions.find(s => s.id === appData.currentSessionId);
    if (!session) return;
    
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="container fade-in">
            <div class="session-header-container">
                <div class="session-flag">📋</div>
                <div class="session-info">
                    <div class="session-country">${session.country}</div>
                    <div class="session-meta">${session.committee} · Resolution Generator</div>
                </div>
                <div class="header-buttons">
                    <button class="btn-back" onclick="navigate('dashboard')">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                    </button>
                </div>
            </div>
            
            <div class="card" style="max-width: 800px; margin: 32px auto;">
                <h2>Resolution Generator</h2>
                <div class="form-group">
                    <label class="form-label">Resolution Topic</label>
                    <input type="text" id="res-topic" class="form-input" placeholder="e.g., Climate Change Action">
                </div>
                <div class="form-group">
                    <label class="form-label">Preambulatory Clauses</label>
                    <textarea id="res-clauses" class="form-textarea" placeholder="Add preambulatory clauses..."></textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">Operative Clauses</label>
                    <textarea id="res-operative" class="form-textarea" placeholder="Add operative clauses..."></textarea>
                </div>
                <button class="btn btn-primary" onclick="saveResolution()">Save Resolution</button>
            </div>
        </div>
    `;
}

function renderPositionPaper() {
    const session = appData.munSessions.find(s => s.id === appData.currentSessionId);
    if (!session) return;
    
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="container fade-in">
            <div class="session-header-container">
                <div class="session-flag">🎯</div>
                <div class="session-info">
                    <div class="session-country">${session.country}</div>
                    <div class="session-meta">${session.committee} · Position Paper</div>
                </div>
                <div class="header-buttons">
                    <button class="btn-back" onclick="navigate('dashboard')">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                    </button>
                </div>
            </div>
            
            <div class="card" style="max-width: 800px; margin: 32px auto;">
                <h2>Position Paper Generator</h2>
                <div class="form-group">
                    <label class="form-label">Topic</label>
                    <input type="text" id="pos-topic" class="form-input" placeholder="Committee agenda">
                </div>
                <div class="form-group">
                    <label class="form-label">Country Position</label>
                    <textarea id="pos-content" class="form-textarea" placeholder="Write your position..."></textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">Key Points</label>
                    <textarea id="pos-points" class="form-textarea" placeholder="Bullet points..."></textarea>
                </div>
                <button class="btn btn-primary" onclick="savePositionPaper()">Save Position Paper</button>
            </div>
        </div>
    `;
}

function renderCountryProfiles() {
    const session = appData.munSessions.find(s => s.id === appData.currentSessionId);
    if (!session) return;
    
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="container fade-in">
            <div class="session-header-container">
                <div class="session-flag">🌍</div>
                <div class="session-info">
                    <div class="session-country">${session.country}</div>
                    <div class="session-meta">${session.committee} · Country Profiles</div>
                </div>
                <div class="header-buttons">
                    <button class="btn-back" onclick="navigate('dashboard')">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                    </button>
                </div>
            </div>
            
            <div class="card" style="max-width: 800px; margin: 32px auto;">
                <h2>Country Profiles</h2>
                <div class="form-group">
                    <label class="form-label">Country</label>
                    <input type="text" id="country-name" class="form-input" placeholder="Enter country name">
                </div>
                <div class="form-group">
                    <label class="form-label">Key Facts</label>
                    <textarea id="country-facts" class="form-textarea" placeholder="Facts, history, policies..."></textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">Voting Pattern</label>
                    <select id="country-voting" class="form-input">
                        <option>Select voting tendency...</option>
                        <option>Consistently Yes</option>
                        <option>Usually Yes</option>
                        <option>Neutral/Variable</option>
                        <option>Usually No</option>
                        <option>Consistently No</option>
                    </select>
                </div>
                <button class="btn btn-primary" onclick="saveCountryProfile()">Save Profile</button>
            </div>
        </div>
    `;
}

function renderVotingMatrix() {
    const session = appData.munSessions.find(s => s.id === appData.currentSessionId);
    if (!session) return;
    
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="container fade-in">
            <div class="session-header-container">
                <div class="session-flag">📊</div>
                <div class="session-info">
                    <div class="session-country">${session.country}</div>
                    <div class="session-meta">${session.committee} · Voting Matrix</div>
                </div>
                <div class="header-buttons">
                    <button class="btn-back" onclick="navigate('dashboard')">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                    </button>
                </div>
            </div>
            
            <div class="card" style="max-width: 800px; margin: 32px auto;">
                <h2>Voting Prediction Matrix</h2>
                <div class="form-group">
                    <label class="form-label">Resolution Name</label>
                    <input type="text" id="vote-resolution" class="form-input" placeholder="Resolution to track">
                </div>
                <div class="form-group">
                    <label class="form-label">Add Country &amp; Vote Prediction</label>
                    <div style="display: flex; gap: 8px;">
                        <input type="text" id="vote-country" class="form-input" placeholder="Country" style="flex: 1;">
                        <select id="vote-prediction" class="form-input" style="flex: 1;">
                            <option>For</option>
                            <option>Against</option>
                            <option>Abstain</option>
                            <option>Undecided</option>
                        </select>
                        <button class="btn btn-secondary" onclick="addVotePrediction()">Add</button>
                    </div>
                </div>
                <div id="voting-list" style="margin-top: 20px;"></div>
            </div>
        </div>
    `;
}

function renderResearchNotes() {
    const session = appData.munSessions.find(s => s.id === appData.currentSessionId);
    if (!session) return;
    
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="container fade-in">
            <div class="session-header-container">
                <div class="session-flag">📚</div>
                <div class="session-info">
                    <div class="session-country">${session.country}</div>
                    <div class="session-meta">${session.committee} · Research Notes</div>
                </div>
                <div class="header-buttons">
                    <button class="btn-back" onclick="navigate('dashboard')">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                    </button>
                </div>
            </div>
            
            <div class="card" style="max-width: 800px; margin: 32px auto;">
                <h2>Research Notes</h2>
                <div class="form-group">
                    <label class="form-label">Note Topic</label>
                    <input type="text" id="note-topic" class="form-input" placeholder="e.g., USA Economic Policy">
                </div>
                <div class="form-group">
                    <label class="form-label">Tags</label>
                    <input type="text" id="note-tags" class="form-input" placeholder="economy, military, diplomacy">
                </div>
                <div class="form-group">
                    <label class="form-label">Content</label>
                    <textarea id="note-content-tool" class="form-textarea" placeholder="Your research notes..."></textarea>
                </div>
                <button class="btn btn-primary" onclick="saveResearchNote()">Save Note</button>
            </div>
        </div>
    `;
}

function renderDebateStrategy() {
    const session = appData.munSessions.find(s => s.id === appData.currentSessionId);
    if (!session) return;
    
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="container fade-in">
            <div class="session-header-container">
                <div class="session-flag">⚡</div>
                <div class="session-info">
                    <div class="session-country">${session.country}</div>
                    <div class="session-meta">${session.committee} · Debate Strategy</div>
                </div>
                <div class="header-buttons">
                    <button class="btn-back" onclick="navigate('dashboard')">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                    </button>
                </div>
            </div>
            
            <div class="card" style="max-width: 800px; margin: 32px auto;">
                <h2>Debate Strategy</h2>
                <div class="form-group">
                    <label class="form-label">Strategy Title</label>
                    <input type="text" id="debate-title" class="form-input" placeholder="e.g., Counter-argument to China">
                </div>
                <div class="form-group">
                    <label class="form-label">Counter-arguments</label>
                    <textarea id="debate-counters" class="form-textarea" placeholder="Counter-arguments you'll use..."></textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">Debate Flow</label>
                    <textarea id="debate-flow" class="form-textarea" placeholder="How you'll approach the debate..."></textarea>
                </div>
                <button class="btn btn-primary" onclick="saveDebateStrategy()">Save Strategy</button>
            </div>
        </div>
    `;
}

function renderAmendmentTracker() {
    const session = appData.munSessions.find(s => s.id === appData.currentSessionId);
    if (!session) return;
    
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="container fade-in">
            <div class="session-header-container">
                <div class="session-flag">✏️</div>
                <div class="session-info">
                    <div class="session-country">${session.country}</div>
                    <div class="session-meta">${session.committee} · Amendment Tracker</div>
                </div>
                <div class="header-buttons">
                    <button class="btn-back" onclick="navigate('dashboard')">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                    </button>
                </div>
            </div>
            
            <div class="card" style="max-width: 800px; margin: 32px auto;">
                <h2>Amendment Tracker</h2>
                <div class="form-group">
                    <label class="form-label">Amendment Description</label>
                    <textarea id="amend-desc" class="form-textarea" placeholder="What does this amendment change?"></textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">Proposed By</label>
                    <input type="text" id="amend-by" class="form-input" placeholder="Country">
                </div>
                <div class="form-group">
                    <label class="form-label">Status</label>
                    <select id="amend-status" class="form-input">
                        <option>Proposed</option>
                        <option>Approved</option>
                        <option>Rejected</option>
                    </select>
                </div>
                <button class="btn btn-primary" onclick="saveAmendment()">Save Amendment</button>
            </div>
        </div>
    `;
}

function renderSpeakerList() {
    const session = appData.munSessions.find(s => s.id === appData.currentSessionId);
    if (!session) return;
    
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="container fade-in">
            <div class="session-header-container">
                <div class="session-flag">🎤</div>
                <div class="session-info">
                    <div class="session-country">${session.country}</div>
                    <div class="session-meta">${session.committee} · Speaker List</div>
                </div>
                <div class="header-buttons">
                    <button class="btn-back" onclick="navigate('dashboard')">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                    </button>
                </div>
            </div>
            
            <div class="card" style="max-width: 800px; margin: 32px auto;">
                <h2>Speaker List Manager</h2>
                <div class="form-group">
                    <label class="form-label">Speaker</label>
                    <input type="text" id="speaker-name" class="form-input" placeholder="Country/Delegate name">
                </div>
                <div class="form-group">
                    <label class="form-label">Topic</label>
                    <input type="text" id="speaker-topic" class="form-input" placeholder="What they'll speak about">
                </div>
                <div class="form-group">
                    <label class="form-label">Time Allocated (minutes)</label>
                    <input type="number" id="speaker-time" class="form-input" placeholder="5">
                </div>
                <button class="btn btn-primary" onclick="addSpeaker()">Add Speaker</button>
            </div>
        </div>
    `;
}

function renderQuestionBank() {
    const session = appData.munSessions.find(s => s.id === appData.currentSessionId);
    if (!session) return;
    
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="container fade-in">
            <div class="session-header-container">
                <div class="session-flag">❓</div>
                <div class="session-info">
                    <div class="session-country">${session.country}</div>
                    <div class="session-meta">${session.committee} · Question Bank</div>
                </div>
                <div class="header-buttons">
                    <button class="btn-back" onclick="navigate('dashboard')">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                    </button>
                </div>
            </div>
            
            <div class="card" style="max-width: 800px; margin: 32px auto;">
                <h2>Question Bank</h2>
                <div class="form-group">
                    <label class="form-label">Question</label>
                    <textarea id="q-question" class="form-textarea" placeholder="Ask a question..."></textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">Answer</label>
                    <textarea id="q-answer" class="form-textarea" placeholder="Your answer or research..."></textarea>
                </div>
                <button class="btn btn-primary" onclick="saveQuestion()">Save Q&amp;A</button>
            </div>
        </div>
    `;
}

function renderTimeline() {
    const session = appData.munSessions.find(s => s.id === appData.currentSessionId);
    if (!session) return;
    
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="container fade-in">
            <div class="session-header-container">
                <div class="session-flag">📅</div>
                <div class="session-info">
                    <div class="session-country">${session.country}</div>
                    <div class="session-meta">${session.committee} · Committee Timeline</div>
                </div>
                <div class="header-buttons">
                    <button class="btn-back" onclick="navigate('dashboard')">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                    </button>
                </div>
            </div>
            
            <div class="card" style="max-width: 800px; margin: 32px auto;">
                <h2>Committee Timeline</h2>
                <div class="form-group">
                    <label class="form-label">Event Name</label>
                    <input type="text" id="event-name" class="form-input" placeholder="e.g., Resolution Vote">
                </div>
                <div class="form-group">
                    <label class="form-label">Date &amp; Time</label>
                    <input type="datetime-local" id="event-time" class="form-input">
                </div>
                <div class="form-group">
                    <label class="form-label">Description</label>
                    <textarea id="event-desc" class="form-textarea" placeholder="Event details..."></textarea>
                </div>
                <button class="btn btn-primary" onclick="saveEvent()">Save Event</button>
            </div>
        </div>
    `;
}

function renderNegotiationTracker() {
    const session = appData.munSessions.find(s => s.id === appData.currentSessionId);
    if (!session) return;
    
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="container fade-in">
            <div class="session-header-container">
                <div class="session-flag">🤝</div>
                <div class="session-info">
                    <div class="session-country">${session.country}</div>
                    <div class="session-meta">${session.committee} · Negotiation Tracker</div>
                </div>
                <div class="header-buttons">
                    <button class="btn-back" onclick="navigate('dashboard')">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                    </button>
                </div>
            </div>
            
            <div class="card" style="max-width: 800px; margin: 32px auto;">
                <h2>Negotiation Tracker</h2>
                <div class="form-group">
                    <label class="form-label">Country</label>
                    <input type="text" id="nego-country" class="form-input" placeholder="Negotiating with...">
                </div>
                <div class="form-group">
                    <label class="form-label">Deal/Agreement</label>
                    <textarea id="nego-deal" class="form-textarea" placeholder="What did you agree on?"></textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">Compromises</label>
                    <textarea id="nego-compromise" class="form-textarea" placeholder="Compromises made..."></textarea>
                </div>
                <button class="btn btn-primary" onclick="saveNegotiation()">Save Deal</button>
            </div>
        </div>
    `;
}

function renderMediaBrief() {
    const session = appData.munSessions.find(s => s.id === appData.currentSessionId);
    if (!session) return;
    
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="container fade-in">
            <div class="session-header-container">
                <div class="session-flag">📢</div>
                <div class="session-info">
                    <div class="session-country">${session.country}</div>
                    <div class="session-meta">${session.committee} · Media Brief</div>
                </div>
                <div class="header-buttons">
                    <button class="btn-back" onclick="navigate('dashboard')">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                    </button>
                </div>
            </div>
            
            <div class="card" style="max-width: 800px; margin: 32px auto;">
                <h2>Media Brief Generator</h2>
                <div class="form-group">
                    <label class="form-label">Press Release Title</label>
                    <input type="text" id="media-title" class="form-input" placeholder="Headline">
                </div>
                <div class="form-group">
                    <label class="form-label">Content</label>
                    <textarea id="media-content" class="form-textarea" placeholder="Write your press release..."></textarea>
                </div>
                <button class="btn btn-primary" onclick="saveMediaBrief()">Save Brief</button>
            </div>
        </div>
    `;
}

function renderScorecard() {
    const session = appData.munSessions.find(s => s.id === appData.currentSessionId);
    if (!session) return;
    
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="container fade-in">
            <div class="session-header-container">
                <div class="session-flag">⭐</div>
                <div class="session-info">
                    <div class="session-country">${session.country}</div>
                    <div class="session-meta">${session.committee} · Performance Card</div>
                </div>
                <div class="header-buttons">
                    <button class="btn-back" onclick="navigate('dashboard')">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                    </button>
                </div>
            </div>
            
            <div class="card" style="max-width: 800px; margin: 32px auto;">
                <h2>Performance Scorecard</h2>
                <div class="form-group">
                    <label class="form-label">Speech Title</label>
                    <input type="text" id="score-title" class="form-input" placeholder="Your speech">
                </div>
                <div class="form-group">
                    <label class="form-label">Rate Your Speech (1-10)</label>
                    <input type="range" id="score-rating" min="1" max="10" class="form-input" style="width: 100%;">
                </div>
                <div class="form-group">
                    <label class="form-label">Feedback</label>
                    <textarea id="score-feedback" class="form-textarea" placeholder="What went well? What to improve?"></textarea>
                </div>
                <button class="btn btn-primary" onclick="saveScorecard()">Save Score</button>
            </div>
        </div>
    `;
}

function renderAwardPredictor() {
    const session = appData.munSessions.find(s => s.id === appData.currentSessionId);
    if (!session) return;
    
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="container fade-in">
            <div class="session-header-container">
                <div class="session-flag">🏆</div>
                <div class="session-info">
                    <div class="session-country">${session.country}</div>
                    <div class="session-meta">${session.committee} · Award Predictor</div>
                </div>
                <div class="header-buttons">
                    <button class="btn-back" onclick="navigate('dashboard')">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                    </button>
                </div>
            </div>
            
            <div class="card" style="max-width: 800px; margin: 32px auto;">
                <h2>Award Predictor</h2>
                <div class="form-group">
                    <label class="form-label">Your Name/Delegate</label>
                    <input type="text" id="award-delegate" class="form-input" placeholder="Your name">
                </div>
                <div class="form-group">
                    <label class="form-label">Expected Awards</label>
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        <label style="display: flex; align-items: center; gap: 8px;"><input type="checkbox" id="award-best"> Best Delegate</label>
                        <label style="display: flex; align-items: center; gap: 8px;"><input type="checkbox" id="award-speaker"> Best Speaker</label>
                        <label style="display: flex; align-items: center; gap: 8px;"><input type="checkbox" id="award-written"> Best Written Work</label>
                        <label style="display: flex; align-items: center; gap: 8px;"><input type="checkbox" id="award-mention"> Honorable Mention</label>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Confidence Level</label>
                    <input type="range" id="award-confidence" min="0" max="100" class="form-input" style="width: 100%;">
                </div>
                <button class="btn btn-primary" onclick="savePrediction()">Save Prediction</button>
            </div>
        </div>
    `;
}

// Save Functions for All Tools
function saveResolution() {
    const topic = document.getElementById('res-topic').value;
    const clauses = document.getElementById('res-clauses').value;
    const operative = document.getElementById('res-operative').value;
    if (!topic) { showToast('Please enter a topic'); return; }
    saveToFirebase(`munSessions/${appData.currentSessionId}/resolutions/${generateId()}`, {
        topic, clauses, operative, createdAt: Date.now()
    });
    showToast('Resolution saved!');
}

function savePositionPaper() {
    const topic = document.getElementById('pos-topic').value;
    const content = document.getElementById('pos-content').value;
    const points = document.getElementById('pos-points').value;
    if (!topic) { showToast('Please enter a topic'); return; }
    saveToFirebase(`munSessions/${appData.currentSessionId}/positionPapers/${generateId()}`, {
        topic, content, points, createdAt: Date.now()
    });
    showToast('Position paper saved!');
}

function saveCountryProfile() {
    const country = document.getElementById('country-name').value;
    const facts = document.getElementById('country-facts').value;
    const voting = document.getElementById('country-voting').value;
    if (!country) { showToast('Please enter a country name'); return; }
    saveToFirebase(`munSessions/${appData.currentSessionId}/countryProfiles/${generateId()}`, {
        country, facts, voting, createdAt: Date.now()
    });
    showToast('Country profile saved!');
}

function addVotePrediction() {
    const resolution = document.getElementById('vote-resolution').value;
    const country = document.getElementById('vote-country').value;
    const prediction = document.getElementById('vote-prediction').value;
    if (!country) { showToast('Please enter a country'); return; }
    saveToFirebase(`munSessions/${appData.currentSessionId}/votingMatrix/${generateId()}`, {
        resolution, country, prediction, createdAt: Date.now()
    });
    showToast('Vote prediction added!');
    document.getElementById('vote-country').value = '';
}

function saveResearchNote() {
    const topic = document.getElementById('note-topic').value;
    const tags = document.getElementById('note-tags').value;
    const content = document.getElementById('note-content-tool').value;
    if (!topic) { showToast('Please enter a topic'); return; }
    saveToFirebase(`munSessions/${appData.currentSessionId}/researchNotes/${generateId()}`, {
        topic, tags, content, createdAt: Date.now()
    });
    showToast('Research note saved!');
}

function saveDebateStrategy() {
    const title = document.getElementById('debate-title').value;
    const counters = document.getElementById('debate-counters').value;
    const flow = document.getElementById('debate-flow').value;
    if (!title) { showToast('Please enter a title'); return; }
    saveToFirebase(`munSessions/${appData.currentSessionId}/debateStrategies/${generateId()}`, {
        title, counters, flow, createdAt: Date.now()
    });
    showToast('Debate strategy saved!');
}

function saveAmendment() {
    const desc = document.getElementById('amend-desc').value;
    const by = document.getElementById('amend-by').value;
    const status = document.getElementById('amend-status').value;
    if (!desc) { showToast('Please enter a description'); return; }
    saveToFirebase(`munSessions/${appData.currentSessionId}/amendments/${generateId()}`, {
        description: desc, proposedBy: by, status, createdAt: Date.now()
    });
    showToast('Amendment saved!');
}

function addSpeaker() {
    const speaker = document.getElementById('speaker-name').value;
    const topic = document.getElementById('speaker-topic').value;
    const time = document.getElementById('speaker-time').value;
    if (!speaker) { showToast('Please enter speaker name'); return; }
    saveToFirebase(`munSessions/${appData.currentSessionId}/speakers/${generateId()}`, {
        speaker, topic, time, createdAt: Date.now()
    });
    showToast('Speaker added!');
    document.getElementById('speaker-name').value = '';
    document.getElementById('speaker-topic').value = '';
    document.getElementById('speaker-time').value = '';
}

function saveQuestion() {
    const question = document.getElementById('q-question').value;
    const answer = document.getElementById('q-answer').value;
    if (!question) { showToast('Please enter a question'); return; }
    saveToFirebase(`munSessions/${appData.currentSessionId}/questionBank/${generateId()}`, {
        question, answer, createdAt: Date.now()
    });
    showToast('Q&A saved!');
}

function saveEvent() {
    const name = document.getElementById('event-name').value;
    const time = document.getElementById('event-time').value;
    const desc = document.getElementById('event-desc').value;
    if (!name) { showToast('Please enter event name'); return; }
    saveToFirebase(`munSessions/${appData.currentSessionId}/timeline/${generateId()}`, {
        name, time, description: desc, createdAt: Date.now()
    });
    showToast('Event saved!');
}

function saveNegotiation() {
    const country = document.getElementById('nego-country').value;
    const deal = document.getElementById('nego-deal').value;
    const compromise = document.getElementById('nego-compromise').value;
    if (!country) { showToast('Please enter country name'); return; }
    saveToFirebase(`munSessions/${appData.currentSessionId}/negotiations/${generateId()}`, {
        country, deal, compromise, createdAt: Date.now()
    });
    showToast('Negotiation saved!');
}

function saveMediaBrief() {
    const title = document.getElementById('media-title').value;
    const content = document.getElementById('media-content').value;
    if (!title) { showToast('Please enter a title'); return; }
    saveToFirebase(`munSessions/${appData.currentSessionId}/mediaBriefs/${generateId()}`, {
        title, content, createdAt: Date.now()
    });
    showToast('Media brief saved!');
}

function saveScorecard() {
    const title = document.getElementById('score-title').value;
    const rating = document.getElementById('score-rating').value;
    const feedback = document.getElementById('score-feedback').value;
    if (!title) { showToast('Please enter speech title'); return; }
    saveToFirebase(`munSessions/${appData.currentSessionId}/scorecards/${generateId()}`, {
        title, rating, feedback, createdAt: Date.now()
    });
    showToast('Scorecard saved!');
}

function savePrediction() {
    const delegate = document.getElementById('award-delegate').value;
    const best = document.getElementById('award-best').checked;
    const speaker = document.getElementById('award-speaker').checked;
    const written = document.getElementById('award-written').checked;
    const mention = document.getElementById('award-mention').checked;
    const confidence = document.getElementById('award-confidence').value;
    if (!delegate) { showToast('Please enter your name'); return; }
    saveToFirebase(`munSessions/${appData.currentSessionId}/awardPredictions/${generateId()}`, {
        delegate, awards: { best, speaker, written, mention }, confidence, createdAt: Date.now()
    });
    showToast('Award prediction saved!');
}

function generateUNLinks(agenda) {
    const links = [
        { name: 'UN General Assembly', url: 'https://www.un.org/en/ga/' },
        { name: 'UN Documents', url: 'https://www.un.org/en/documents/' }
    ];
    
    const keywords = agenda.toLowerCase();
    
    if (keywords.includes('human rights') || keywords.includes('rights')) {
        links.push({ name: 'UN Human Rights Council', url: 'https://www.ohchr.org/en/hr-bodies/hrc/home' });
        links.push({ name: 'UN Human Rights Office', url: 'https://www.ohchr.org/en' });
    }
    
    if (keywords.includes('climate') || keywords.includes('environment')) {
        links.push({ name: 'UN Climate Change', url: 'https://unfccc.int/' });
        links.push({ name: 'UN Environment Programme', url: 'https://www.unep.org/' });
    }
    
    if (keywords.includes('disarmament') || keywords.includes('nuclear') || keywords.includes('weapon')) {
        links.push({ name: 'UN Office for Disarmament Affairs', url: 'https://www.un.org/disarmament/' });
        links.push({ name: 'IAEA', url: 'https://www.iaea.org/' });
    }
    
    if (keywords.includes('refugee') || keywords.includes('migration')) {
        links.push({ name: 'UNHCR - UN Refugee Agency', url: 'https://www.unhcr.org/' });
        links.push({ name: 'UN Migration Agency (IOM)', url: 'https://www.iom.int/' });
    }
    
    if (keywords.includes('health') || keywords.includes('pandemic')) {
        links.push({ name: 'World Health Organization', url: 'https://www.who.int/' });
    }
    
    if (keywords.includes('child') || keywords.includes('children')) {
        links.push({ name: 'UNICEF', url: 'https://www.unicef.org/' });
    }
    
    if (keywords.includes('women') || keywords.includes('gender')) {
        links.push({ name: 'UN Women', url: 'https://www.unwomen.org/' });
    }
    
    if (keywords.includes('security') || keywords.includes('terrorism')) {
        links.push({ name: 'UN Security Council', url: 'https://www.un.org/securitycouncil/' });
        links.push({ name: 'UN Counter-Terrorism', url: 'https://www.un.org/counterterrorism/' });
    }
    
    return links;
}

function generateGovLinks(country, agenda) {
    // Function kept for compatibility but returns empty array
    return [];
}

function generateSwingStates(committee) {
    return swingStatesGlobal.slice(0, 12);
}

// Verbatim Tracker
function renderVerbatim() {
    const session = appData.munSessions.find(s => s.id === appData.currentSessionId);
    if (!session) return;
    
    const countries = Object.keys(session.verbatims);
    
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="container fade-in">
            <button class="icon-btn settings-icon" onclick="showAccountSettings()" title="Account Settings">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M12 1v6m0 6v6"></path>
                </svg>
            </button>
            
            <button class="icon-btn privacy-btn" onclick="lockPrivacy()" title="Privacy Lock">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
            </button>
            
            <div class="session-header-container">
                <div class="session-flag">💬</div>
                <div class="session-info">
                    <div class="session-country">${session.country}</div>
                    <div class="session-meta">${session.committee} · Verbatim Tracker</div>
                </div>
                <div class="header-buttons">
                    <button class="btn-back" onclick="navigate('dashboard')" title="Back to Dashboard">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                    </button>
                </div>
            </div>
            
            <div class="verbatim-layout">
                <div class="verbatim-sidebar">
                    <div class="flex-between">
                        <h3>Countries</h3>
                        <button class="icon-btn" onclick="addCountry()">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                        </button>
                    </div>
                    <ul class="country-list" id="country-list">
                        ${countries.length === 0 ? '<li class="empty-state">No countries added yet</li>' : ''}
                        ${countries.map((country, idx) => `
                            <li class="country-item ${idx === 0 ? 'active' : ''}" onclick="selectCountry('${country}')">
                                ${country}
                            </li>
                        `).join('')}
                    </ul>
                </div>
                
                <div class="verbatim-main" id="verbatim-main">
                    ${countries.length === 0 ? `
                        <div class="empty-state">
                            <div class="empty-state-icon">🌍</div>
                            <h3>No Countries Added</h3>
                            <p>Add a country to start tracking verbatims</p>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
    
    if (countries.length > 0) {
        selectCountry(countries[0]);
    }
}

function addCountry() {
    const session = appData.munSessions.find(s => s.id === appData.currentSessionId);
    const committeeKey = session.committee.toUpperCase().includes('UNGA') ? 'UNGA' :
                         session.committee.toUpperCase().includes('UNHRC') ? 'UNHRC' : 
                         session.committee.toUpperCase().includes('UNSC') ? 'UNSC' : 'UNGA';
    const availableCountries = committeeCountries[committeeKey] || committeeCountries['UNGA'];
    
    const country = prompt(`Enter country name (e.g., ${availableCountries.slice(0, 3).join(', ')})`);
    if (country && country.trim()) {
        if (!session.verbatims[country]) {
            session.verbatims[country] = {};
            console.log('💾 Saving new country to Firebase:', country);
            saveToFirebase(`munSessions/${session.id}/verbatims`, session.verbatims);
            renderVerbatim();
            showToast(`${country} added & saved!`);
        } else {
            showToast('Country already exists');
        }
    }
}

function selectCountry(country) {
    const session = appData.munSessions.find(s => s.id === appData.currentSessionId);
    const verbatims = session.verbatims[country] || {};
    
    document.querySelectorAll('.country-item').forEach(item => {
        item.classList.remove('active');
        if (item.textContent.trim() === country) {
            item.classList.add('active');
        }
    });
    
    const speechTypeKeys = Object.keys(verbatims);
    
    const mainArea = document.getElementById('verbatim-main');
    mainArea.innerHTML = `
        <div class="flex-between mb-16">
            <h2>${country}</h2>
            <button class="btn btn-primary" onclick="addSpeechType('${country}')">
                + Add Speech Type
            </button>
        </div>
        
        ${speechTypeKeys.length === 0 ? `
            <div class="empty-state">
                <div class="empty-state-icon">📢</div>
                <p>No speech types added yet</p>
            </div>
        ` : ''}
        
        ${speechTypeKeys.map(speechType => renderSpeechType(country, speechType, verbatims[speechType])).join('')}
    `;
}

function renderSpeechType(country, speechType, verbatims) {
    return `
        <div class="speech-type">
            <div class="speech-type-header" onclick="toggleSpeechType(this)">
                <strong>${speechType}</strong>
                <span>▼</span>
            </div>
            <div class="speech-type-content expanded">
                ${verbatims.map(v => renderVerbatimItem(country, speechType, v)).join('')}
                <button class="btn btn-secondary" onclick="addVerbatim('${country}', '${speechType}')">
                    + Add Verbatim
                </button>
            </div>
        </div>
    `;
}

function renderVerbatimItem(country, speechType, verbatim) {
    return `
        <div class="verbatim-item">
            <div class="verbatim-header">
                <strong>${verbatim.title}</strong>
                <button class="icon-btn" onclick="deleteVerbatim('${country}', '${speechType}', '${verbatim.id}')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
            <div class="verbatim-content">${verbatim.content}</div>
            <button class="btn btn-primary" onclick="generateQuestions('${country}', '${speechType}', '${verbatim.id}')" id="gen-btn-${verbatim.id}">
                ✨ Generate Questions
            </button>
            ${verbatim.questions && verbatim.questions.length > 0 ? `
                <div class="questions-list">
                    <strong>Generated Questions:</strong>
                    ${verbatim.questions.map((q, idx) => `
                        <div class="question-item">
                            <input type="checkbox" class="question-checkbox" ${q.asked ? 'checked' : ''} 
                                   onchange="toggleQuestionAsked('${country}', '${speechType}', '${verbatim.id}', ${idx})">
                            <div class="question-text">
                                <div>${q.text}</div>
                                ${q.sources ? `<div class="question-source">Source: ${q.sources}</div>` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        </div>
    `;
}

function toggleSpeechType(element) {
    const content = element.nextElementSibling;
    content.classList.toggle('expanded');
    const arrow = element.querySelector('span');
    arrow.textContent = content.classList.contains('expanded') ? '▼' : '▶';
}

function addSpeechType(country) {
    const session = appData.munSessions.find(s => s.id === appData.currentSessionId);
    
    const speechType = prompt(`Enter speech type (e.g., ${speechTypes.slice(0, 3).join(', ')})`);
    if (speechType && speechType.trim()) {
        if (!session.verbatims[country][speechType]) {
            session.verbatims[country][speechType] = [];
            saveToFirebase(`munSessions/${session.id}/verbatims`, session.verbatims);
            selectCountry(country);
            showToast('Speech type added');
        } else {
            showToast('Speech type already exists');
        }
    }
}

function addVerbatim(country, speechType) {
    const title = prompt('Enter verbatim title (e.g., "Capacity building")');
    if (!title) return;
    
    const content = prompt('Enter verbatim content (what they said)');
    if (!content) return;
    
    const session = appData.munSessions.find(s => s.id === appData.currentSessionId);
    const verbatim = {
        id: generateId(),
        title: title.trim(),
        content: content.trim(),
        questions: [],
        createdAt: Date.now()
    };
    
    session.verbatims[country][speechType].push(verbatim);
    console.log('💾 Saving verbatim to Firebase:', verbatim.id);
    saveToFirebase(`munSessions/${session.id}/verbatims`, session.verbatims);
    selectCountry(country);
    showToast('Verbatim saved to Firebase!');
}

function deleteVerbatim(country, speechType, verbatimId) {
    showConfirm('Delete Verbatim', 'Are you sure you want to delete this verbatim?', () => {
        const session = appData.munSessions.find(s => s.id === appData.currentSessionId);
        session.verbatims[country][speechType] = session.verbatims[country][speechType].filter(v => v.id !== verbatimId);
        saveToFirebase(`munSessions/${session.id}/verbatims`, session.verbatims);
        selectCountry(country);
        showToast('Verbatim deleted');
    });
}

async function generateQuestions(country, speechType, verbatimId) {
    const session = appData.munSessions.find(s => s.id === appData.currentSessionId);
    const verbatim = session.verbatims[country][speechType].find(v => v.id === verbatimId);
    
    const btn = document.getElementById(`gen-btn-${verbatimId}`);
    btn.innerHTML = '<span class="loading"></span> Generating...';
    btn.disabled = true;
    
    const prompt = `Generate 2 hard, specific, and challenging questions that target ${country} based on their speech on ${verbatim.title} where they said: "${verbatim.content}".\n\nEach question should:\n1. Be pointed and difficult to answer\n2. Reference specific contradictions or weaknesses in their position\n3. Include a brief source/context\n\nFormat EXACTLY as:\nQ1: [Question]\nSource: [Brief context/source]\n\nQ2: [Question]\nSource: [Brief context/source]`;
    
    const response = await callAIAPI(prompt);
    
    if (response) {
        const questions = parseQuestionsFromAI(response);
        verbatim.questions = questions.map(q => ({ ...q, asked: false, generatedAt: Date.now() }));
        console.log('💾 Saving AI-generated questions to Firebase');
        saveToFirebase(`munSessions/${session.id}/verbatims`, session.verbatims);
        selectCountry(country);
        showToast('Questions generated & saved!');
    } else {
        btn.innerHTML = '✨ Generate Questions';
        btn.disabled = false;
    }
}

function toggleQuestionAsked(country, speechType, verbatimId, questionIdx) {
    const session = appData.munSessions.find(s => s.id === appData.currentSessionId);
    const verbatim = session.verbatims[country][speechType].find(v => v.id === verbatimId);
    verbatim.questions[questionIdx].asked = !verbatim.questions[questionIdx].asked;
    verbatim.questions[questionIdx].askedAt = Date.now();
    console.log('💾 Saving question status to Firebase');
    saveToFirebase(`munSessions/${session.id}/verbatims`, session.verbatims);
}

// Speech Organizer
function renderSpeech() {
    const session = appData.munSessions.find(s => s.id === appData.currentSessionId);
    if (!session) return;
    
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="container fade-in">
            <button class="icon-btn settings-icon" onclick="showAccountSettings()" title="Account Settings">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M12 1v6m0 6v6"></path>
                </svg>
            </button>
            
            <button class="icon-btn privacy-btn" onclick="lockPrivacy()" title="Privacy Lock">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
            </button>
            
            <div class="session-header-container">
                <div class="session-flag">📝</div>
                <div class="session-info">
                    <div class="session-country">${session.country}</div>
                    <div class="session-meta">${session.committee} · Speech Organizer</div>
                </div>
                <div class="header-buttons">
                    <button class="btn-back" onclick="navigate('dashboard')" title="Back to Dashboard">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                    </button>
                </div>
            </div>
            
            <div class="speech-list">
                <button class="btn btn-primary mb-16" onclick="addSpeech()">
                    + New Speech
                </button>
                
                ${session.speeches.length === 0 ? `
                    <div class="empty-state">
                        <div class="empty-state-icon">📄</div>
                        <h3>No Speeches Yet</h3>
                        <p>Add your first speech to get started</p>
                    </div>
                ` : ''}
                
                ${session.speeches.map((speech, idx) => `
                    <div class="card speech-card">
                        <div class="speech-header" onclick="toggleSpeech(this)">
                            <h3>${speech.title}</h3>
                            <span>▼</span>
                        </div>
                        <div class="speech-content" id="speech-${speech.id}">
                            <textarea class="form-textarea" id="content-${speech.id}">${speech.content}</textarea>
                            <div class="speech-actions">
                                <button class="btn btn-success" onclick="saveSpeech('${speech.id}')">
                                    💾 Save Changes
                                </button>
                                <button class="btn btn-error" onclick="deleteSpeech('${speech.id}')">
                                    🗑️ Delete
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function toggleSpeech(element) {
    const content = element.nextElementSibling;
    content.classList.toggle('expanded');
    const arrow = element.querySelector('span');
    arrow.textContent = content.classList.contains('expanded') ? '▼' : '▶';
}

function addSpeech() {
    const title = prompt('Enter speech title');
    if (!title) return;
    
    const session = appData.munSessions.find(s => s.id === appData.currentSessionId);
    const speech = {
        id: generateId(),
        title: title.trim(),
        content: '',
        createdAt: Date.now(),
        updatedAt: Date.now()
    };
    
    session.speeches.push(speech);
    console.log('💾 Saving new speech to Firebase:', speech.id);
    saveToFirebase(`munSessions/${session.id}/speeches`, session.speeches);
    renderSpeech();
    showToast('Speech saved to Firebase!');
}

function saveSpeech(speechId) {
    const session = appData.munSessions.find(s => s.id === appData.currentSessionId);
    const speech = session.speeches.find(s => s.id === speechId);
    const content = document.getElementById(`content-${speechId}`).value;
    
    speech.content = content;
    speech.updatedAt = Date.now();
    console.log('💾 Saving speech changes to Firebase:', speechId);
    saveToFirebase(`munSessions/${session.id}/speeches`, session.speeches);
    showToast('Speech saved to Firebase!');
}

function deleteSpeech(speechId) {
    showConfirm('Delete Speech', 'Are you sure you want to delete this speech?', () => {
        const session = appData.munSessions.find(s => s.id === appData.currentSessionId);
        session.speeches = session.speeches.filter(s => s.id !== speechId);
        saveToFirebase(`munSessions/${session.id}/speeches`, session.speeches);
        renderSpeech();
        showToast('Speech deleted');
    });
}

// Bloc Builder
function renderBloc() {
    const session = appData.munSessions.find(s => s.id === appData.currentSessionId);
    if (!session) return;
    
    const committeeKey = session.committee.toUpperCase().includes('UNGA') ? 'UNGA' :
                         session.committee.toUpperCase().includes('UNHRC') ? 'UNHRC' : 
                         session.committee.toUpperCase().includes('UNSC') ? 'UNSC' : 'UNGA';
    const countries = committeeCountries[committeeKey] || committeeCountries['UNGA'];
    
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="container fade-in">
            <button class="icon-btn settings-icon" onclick="showAccountSettings()" title="Account Settings">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M12 1v6m0 6v6"></path>
                </svg>
            </button>
            
            <button class="icon-btn privacy-btn" onclick="lockPrivacy()" title="Privacy Lock">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
            </button>
            
            <div class="session-header-container">
                <div class="session-flag">👥</div>
                <div class="session-info">
                    <div class="session-country">${session.country}</div>
                    <div class="session-meta">${session.committee} · Bloc Builder</div>
                </div>
                <div class="header-buttons">
                    <button class="btn-back" onclick="navigate('dashboard')" title="Back to Dashboard">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                    </button>
                </div>
            </div>
            
            <div class="bloc-grid">
                ${countries.map(country => renderBlocCountry(session, country)).join('')}
            </div>
        </div>
    `;
}

function renderBlocCountry(session, country) {
    const blocData = session.blocData[country] || {
        lobbying: null,
        diplomatic: null,
        reasons: { great: [], fair: [], avoid: [] },
        reasonsLoaded: false
    };
    
    if (!session.blocData[country]) {
        session.blocData[country] = blocData;
    }
    
    return `
        <div class="card country-bloc-card">
            <div class="country-header">
                <span>🌍</span>
                <span>${country}</span>
            </div>
            
            <div class="bloc-section">
                <h4>Lobbying Status</h4>
                <div class="status-buttons">
                    <button class="status-btn green ${blocData.lobbying === 'green' ? 'active' : ''}" 
                            onclick="setBlocStatus('${country}', 'lobbying', 'green')">
                        Sure
                    </button>
                    <button class="status-btn yellow ${blocData.lobbying === 'yellow' ? 'active' : ''}" 
                            onclick="setBlocStatus('${country}', 'lobbying', 'yellow')">
                        Unsure
                    </button>
                    <button class="status-btn red ${blocData.lobbying === 'red' ? 'active' : ''}" 
                            onclick="setBlocStatus('${country}', 'lobbying', 'red')">
                        Nope
                    </button>
                </div>
            </div>
            
            <div class="bloc-section">
                <h4>Diplomatic Assessment</h4>
                <div class="status-buttons">
                    <button class="status-btn great ${blocData.diplomatic === 'great' ? 'active' : ''}" 
                            onclick="setBlocStatus('${country}', 'diplomatic', 'great')">
                        Great
                    </button>
                    <button class="status-btn fair ${blocData.diplomatic === 'fair' ? 'active' : ''}" 
                            onclick="setBlocStatus('${country}', 'diplomatic', 'fair')">
                        Fair
                    </button>
                    <button class="status-btn avoid ${blocData.diplomatic === 'avoid' ? 'active' : ''}" 
                            onclick="setBlocStatus('${country}', 'diplomatic', 'avoid')">
                        Avoid
                    </button>
                </div>
                <div id="reasons-${country}" class="reasons-list">
                    ${renderReasons(blocData, blocData.diplomatic)}
                </div>
            </div>
        </div>
    `;
}

function renderReasons(blocData, status) {
    if (!status || !blocData.reasonsLoaded) return '';
    
    const reasons = blocData.reasons[status] || [];
    if (reasons.length === 0) return '';
    
    return reasons.map(reason => `
        <div class="reason-chip" onclick="showReasonDetail('${reason.keyword}', '${reason.detail}')">
            ${reason.keyword}
        </div>
    `).join('');
}

function showReasonDetail(keyword, detail) {
    alert(`${keyword}\n\n${detail}`);
}

async function setBlocStatus(country, type, status) {
    const session = appData.munSessions.find(s => s.id === appData.currentSessionId);
    session.blocData[country][type] = status;
    session.blocData[country].updatedAt = Date.now();
    console.log('💾 Saving bloc status to Firebase:', country, type, status);
    saveToFirebase(`munSessions/${session.id}/blocData`, session.blocData);
    
    if (type === 'diplomatic' && !session.blocData[country].reasonsLoaded) {
        const reasonsDiv = document.getElementById(`reasons-${country}`);
        reasonsDiv.innerHTML = '<span class="loading"></span> Loading reasons...';
        
        const prompt = `Analyze why ${country} would be a ${status} diplomatic partner for ${session.country} on the agenda of "${session.agenda}".\n\nProvide exactly 3-4 brief keyword reasons with one-line explanations.\n\nFormat EXACTLY as:\n1. [Keyword]: [One sentence explanation]\n2. [Keyword]: [One sentence explanation]\n3. [Keyword]: [One sentence explanation]\n4. [Keyword]: [One sentence explanation]`;
        
        const response = await callAIAPI(prompt);
        
        if (response) {
            const reasons = parseReasonsFromAI(response);
            session.blocData[country].reasons[status] = reasons;
            session.blocData[country].reasonsLoaded = true;
            saveToFirebase(`munSessions/${session.id}/blocData`, session.blocData);
            renderBloc();
        } else {
            reasonsDiv.innerHTML = '';
        }
    } else {
        renderBloc();
    }
}

// Notes
function initNotes() {
    const fab = document.getElementById('notes-fab');
    const panel = document.getElementById('notes-panel');
    const overlay = document.getElementById('notes-overlay');
    const closeBtn = document.getElementById('close-notes');
    const addBtn = document.getElementById('add-note-btn');
    
    fab.addEventListener('click', () => {
        panel.classList.add('active');
        overlay.classList.add('active');
        renderNotesList();
    });
    
    closeBtn.addEventListener('click', closeNotes);
    overlay.addEventListener('click', closeNotes);
    
    addBtn.addEventListener('click', () => {
        addNewNote();
    });
}

function closeNotes() {
    document.getElementById('notes-panel').classList.remove('active');
    document.getElementById('notes-overlay').classList.remove('active');
}

function renderNotesList() {
    const notesList = document.getElementById('notes-list');
    
    if (appData.notes.length === 0) {
        notesList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📝</div>
                <p>No notes yet</p>
            </div>
        `;
        return;
    }
    
    notesList.innerHTML = appData.notes.map(note => `
        <div class="note-card" onclick="toggleNote(this)">
            <div class="note-header">
                <div class="note-title">${note.title}</div>
                <button class="icon-btn" onclick="deleteNote('${note.id}', event)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
            <div class="note-preview">${note.content.substring(0, 100)}${note.content.length > 100 ? '...' : ''}</div>
            <div class="note-expanded">
                <textarea class="form-textarea" id="note-content-${note.id}">${note.content}</textarea>
                <button class="btn btn-success full-width mt-16" onclick="saveNote('${note.id}', event)">
                    💾 Save
                </button>
            </div>
        </div>
    `).join('');
}

function toggleNote(element) {
    element.classList.toggle('expanded');
}

function addNewNote() {
    const notesList = document.getElementById('notes-list');
    const tempId = 'new-' + Date.now();
    
    const noteForm = document.createElement('div');
    noteForm.className = 'note-form';
    noteForm.innerHTML = `
        <input type="text" class="form-input mb-16" id="note-title-${tempId}" placeholder="Note title">
        <textarea class="form-textarea" id="note-content-${tempId}" placeholder="Note content"></textarea>
        <div class="note-form-actions">
            <button class="btn btn-primary" onclick="saveNewNote('${tempId}')">
                💾 Save
            </button>
            <button class="btn btn-secondary" onclick="cancelNewNote(this)">
                Cancel
            </button>
        </div>
    `;
    
    notesList.insertBefore(noteForm, notesList.firstChild);
}

function saveNewNote(tempId) {
    const title = document.getElementById(`note-title-${tempId}`).value;
    const content = document.getElementById(`note-content-${tempId}`).value;
    
    if (!title.trim()) {
        showToast('Please enter a title');
        return;
    }
    
    const noteId = generateId();
    const note = {
        id: noteId,
        title: title.trim(),
        content: content.trim(),
        createdAt: Date.now()
    };
    
    appData.notes.push(note);
    
    // Save to Firebase IMMEDIATELY
    console.log('💾 Saving new note to Firebase:', noteId);
    const noteData = { ...note };
    delete noteData.id;
    saveToFirebase(`notes/${noteId}`, noteData);
    
    renderNotesList();
    showToast('Note saved to Firebase!');
}

function cancelNewNote(btn) {
    btn.closest('.note-form').remove();
}

function saveNote(noteId, event) {
    event.stopPropagation();
    const note = appData.notes.find(n => n.id === noteId);
    const content = document.getElementById(`note-content-${noteId}`).value;
    note.content = content;
    note.updatedAt = Date.now();
    
    // Save to Firebase IMMEDIATELY
    console.log('💾 Saving note update to Firebase:', noteId);
    const noteData = { ...note };
    delete noteData.id;
    saveToFirebase(`notes/${noteId}`, noteData);
    
    showToast('Note saved to Firebase!');
}

function deleteNote(noteId, event) {
    event.stopPropagation();
    showConfirm('Delete Note', 'Are you sure you want to delete this note?', () => {
        appData.notes = appData.notes.filter(n => n.id !== noteId);
        
        // Delete from Firebase
        if (appData.firebaseInitialized && appData.userId) {
            firebase.database().ref(`users/${appData.userId}/notes/${noteId}`).remove();
        }
        
        renderNotesList();
        showToast('Note deleted');
    });
}

// Privacy Lock
function lockPrivacy() {
    appData.privacyLocked = true;
    document.getElementById('privacy-overlay').classList.add('active');
    document.getElementById('privacy-password').value = '';
    document.getElementById('privacy-error').textContent = '';
}

function initPrivacy() {
    const unlockBtn = document.getElementById('unlock-btn');
    const passwordInput = document.getElementById('privacy-password');
    
    unlockBtn.addEventListener('click', () => {
        const password = passwordInput.value;
        if (password === CONFIG.app.privacyPassword) {
            appData.privacyLocked = false;
            document.getElementById('privacy-overlay').classList.remove('active');
            document.getElementById('privacy-error').textContent = '';
            showToast('Privacy unlocked');
        } else {
            document.getElementById('privacy-error').textContent = 'Incorrect password';
        }
    });
    
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            unlockBtn.click();
        }
    });
}



// Privacy Locker Functions
function initializePrivacyLocker() {
    const privacyBtn = document.getElementById('privacy-btn');
    const privacyModal = document.getElementById('privacy-modal');
    const closeBtn = document.getElementById('close-privacy');
    const privacyToggle = document.getElementById('privacy-toggle');
    const passwordForm = document.getElementById('privacy-password-form');
    const savePasswordBtn = document.getElementById('save-privacy-password');
    const disablePrivacyBtn = document.getElementById('disable-privacy');
    const passwordDisplay = document.getElementById('privacy-password-display');
    
    if (!privacyBtn || !privacyModal) return;
    
    // Load privacy setting from Firebase
    loadPrivacySetting();
    
    // Open modal
    privacyBtn.addEventListener('click', () => {
        privacyModal.style.display = 'flex';
        privacyModal.classList.add('active');
    });
    
    // Close modal
    closeBtn.addEventListener('click', () => {
        privacyModal.classList.remove('active');
        setTimeout(() => {
            privacyModal.style.display = 'none';
        }, 300);
    });
    
    // Close on outside click
    privacyModal.addEventListener('click', (e) => {
        if (e.target === privacyModal) {
            privacyModal.classList.remove('active');
            setTimeout(() => {
                privacyModal.style.display = 'none';
            }, 300);
        }
    });
    
    // Toggle privacy
    privacyToggle.addEventListener('change', () => {
        if (privacyToggle.checked) {
            passwordForm.style.display = 'flex';
            passwordDisplay.style.display = 'none';
        } else {
            passwordForm.style.display = 'none';
            passwordDisplay.style.display = 'none';
        }
    });
    
    // Save password
    savePasswordBtn.addEventListener('click', () => {
        const pwd = document.getElementById('privacy-password-input').value;
        const pwdConfirm = document.getElementById('privacy-password-confirm').value;
        
        if (!pwd || !pwdConfirm) {
            showToast('Please enter both passwords');
            return;
        }
        
        if (pwd !== pwdConfirm) {
            showToast('Passwords do not match');
            return;
        }
        
        if (pwd.length < 4) {
            showToast('Password must be at least 4 characters');
            return;
        }
        
        savePrivacySetting(true, pwd);
    });
    
    // Disable privacy
    disablePrivacyBtn.addEventListener('click', () => {
        savePrivacySetting(false, null);
    });
}

function savePrivacySetting(enabled, password) {
    if (!appData.userId || !appData.firebaseInitialized) {
        showToast('Firebase not ready');
        return;
    }
    
    const privacyRef = firebase.database().ref(`users/${appData.userId}/privacy`);
    
    privacyRef.set({
        enabled: enabled,
        password: password,
        updatedAt: firebase.database.ServerValue.TIMESTAMP
    }).then(() => {
        appData.privacyEnabled = enabled;
        appData.privacyPassword = password;
        
        updatePrivacyUI();
        showToast(enabled ? 'Privacy lock enabled!' : 'Privacy lock disabled!');
        
        const privacyBtn = document.getElementById('privacy-btn');
        if (privacyBtn) {
            if (enabled) {
                privacyBtn.classList.add('locked');
            } else {
                privacyBtn.classList.remove('locked');
            }
        }
        
        // Clear form
        document.getElementById('privacy-password-input').value = '';
        document.getElementById('privacy-password-confirm').value = '';
    }).catch(error => {
        console.error('Error saving privacy setting:', error);
        showToast('Failed to save privacy setting');
    });
}

function loadPrivacySetting() {
    if (!appData.userId || !appData.firebaseInitialized) return;
    
    const privacyRef = firebase.database().ref(`users/${appData.userId}/privacy`);
    
    privacyRef.once('value', (snapshot) => {
        if (snapshot.exists()) {
            const privacy = snapshot.val();
            appData.privacyEnabled = privacy.enabled;
            appData.privacyPassword = privacy.password;
            
            updatePrivacyUI();
            
            const privacyBtn = document.getElementById('privacy-btn');
            if (privacyBtn && appData.privacyEnabled) {
                privacyBtn.classList.add('locked');
            }
        }
    });
}

function updatePrivacyUI() {
    const toggle = document.getElementById('privacy-toggle');
    const passwordForm = document.getElementById('privacy-password-form');
    const passwordDisplay = document.getElementById('privacy-password-display');
    
    if (!toggle || !passwordForm || !passwordDisplay) return;
    
    if (appData.privacyEnabled) {
        toggle.checked = true;
        passwordForm.style.display = 'none';
        passwordDisplay.style.display = 'block';
    } else {
        toggle.checked = false;
        passwordForm.style.display = 'none';
        passwordDisplay.style.display = 'none';
    }
}

// Initialize App
function init() {
    console.log('='.repeat(50));
    console.log('🚀 MUN DASH - AUTO LOGIN PERSISTENCE');
    console.log('='.repeat(50));
    console.log('📅 Timestamp:', new Date().toISOString());
    console.log('🌐 Firebase SDK loaded:', !!window.firebase);
    console.log('📡 Firebase Database URL:', CONFIG.firebase.databaseURL);
    console.log('💾 Features:');
    console.log('   ✓ Auto-login on page refresh');
    console.log('   ✓ No session creation needed');
    console.log('   ✓ Direct to dashboard after setup');
    console.log('   ✓ All data persisted in Firebase');
    console.log('   ✓ Real-time sync enabled');
    console.log('='.repeat(50));
    
    // Initialize Firebase first
    initializeFirebase();
    
    // Set up UI components
    initNotes();
    initPrivacy();
    
    // Initialize privacy locker when dashboard loads
    setTimeout(() => {
        initializePrivacyLocker();
    }, 1000);
    
    // Check authentication state - NO AUTO LOGIN, just check
    if (!appData.isAuthenticated) {
        console.log('🔒 Not authenticated - showing login');
        navigate('login');
    } else {
        console.log('✅ User already authenticated:', appData.userId);
    }
    
    console.log('✅ App initialization complete');
    console.log('='.repeat(50));
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}