/**
 * ============================================================
 * PROJECT: NEO-REKAZ OS 2026
 * AUTHOR: AB MAKI (THE ARCHITECT)
 * VERSION: 4.0.0 (GOLDEN EDITION)
 * ============================================================
 */

// 1. قاعدة البيانات الضخمة (Central Database)
const REKAZ_CORE = {
    settings: {
        platformName: "رِكاز 2026",
        developer: "Ab Maki Experiments",
        isLive: true,
        pointsPerBook: 50,
    },
    // قاعدة بيانات الكتب الشاملة
    books: [
        { id: 101, title: "اللغة العربية", stage: "3s", type: "علمي/أدبي", file: "arabic_full.pdf", img: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=400", views: 1240 },
        { id: 102, title: "الفيزياء الحديثة", stage: "3s", type: "علمي", file: "physics_3s.pdf", img: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?q=80&w=400", views: 890 },
        { id: 103, title: "الكيمياء العضوية", stage: "3s", type: "علمي", file: "chem_3s.pdf", img: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?q=80&w=400", views: 750 },
        { id: 104, title: "تاريخ مصر الحديث", stage: "3s", type: "أدبي", file: "history_3s.pdf", img: "https://images.unsplash.com/photo-1585036156171-383f24ad0e49?q=80&w=400", views: 560 },
        { id: 105, title: "الفقه الحنفي", stage: "azhar", type: "أزهر", file: "fiqh_azhar.pdf", img: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=400", views: 430 },
        { id: 106, title: "الرياضيات التطبيقية", stage: "3s", type: "علمي رياضة", file: "math_3s.pdf", img: "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=400", views: 1100 }
    ],
    // بنك أسئلة التحدي اليومي
    dailyChallenges: [
        { q: "من هو مؤلف كتاب 'البيان والتبيين'؟", a: "الجاحظ" },
        { q: "ما هي وحدة قياس كثافة الفيض المغناطيسي؟", a: "التسلا" },
        { q: "في أي عام تم بناء الجامع الأزهر؟", a: "972" }
    ]
};

// 2. المتغيرات النشطة (Global State)
let userState = {
    isLoggedIn: false,
    data: null,
    points: 0,
    currentTab: 'home',
    timerInterval: null
};

/** 3. نظام بدء التشغيل (Initialization) **/
document.addEventListener('DOMContentLoaded', () => {
    console.log("%c NEO-REKAZ SYSTEM ACTIVATED ", "background: #D4AF37; color: #000; font-weight: bold; padding: 10px;");
    
    // تشغيل الأيقونات
    lucide.createIcons();

    // فحص الجلسة السابقة
    const savedUser = localStorage.getItem('rekaz_session');
    if (savedUser) {
        userState.data = JSON.parse(savedUser);
        userState.points = parseInt(localStorage.getItem('rekaz_points')) || 0;
        initApp();
    } else {
        showSplashScreen();
    }
});

/** 4. شاشة البداية والترحيب **/
function showSplashScreen() {
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        if (splash) {
            splash.style.opacity = '0';
            setTimeout(() => {
                splash.classList.add('hidden');
                document.getElementById('auth-gate').classList.remove('hidden');
            }, 1000);
        }
    }, 3000);
}

/** 5. محرك إدارة الهوية (Identity Management) **/
function switchTab(mode) {
    const fields = document.getElementById('auth-form');
    const loginBtn = document.getElementById('tab-login');
    const signupBtn = document.getElementById('tab-signup');

    if (mode === 'login') {
        loginBtn.className = "flex-1 py-3 rounded-xl font-black text-sm transition-all bg-gold text-black shadow-xl";
        signupBtn.className = "flex-1 py-3 rounded-xl font-black text-sm transition-all text-gray-500";
        fields.innerHTML = `
            <div class="space-y-4 reveal-animation">
                <input type="text" id="in-user" placeholder="كود الطالب أو البريد" class="input-field w-full p-4 rounded-2xl text-sm border border-white/10 bg-white/5">
                <input type="password" id="in-pass" placeholder="كلمة المرور" class="input-field w-full p-4 rounded-2xl text-sm border border-white/10 bg-white/5">
            </div>
        `;
    } else {
        signupBtn.className = "flex-1 py-3 rounded-xl font-black text-sm transition-all bg-gold text-black shadow-xl";
        loginBtn.className = "flex-1 py-3 rounded-xl font-black text-sm transition-all text-gray-500";
        fields.innerHTML = `
            <div class="space-y-4 reveal-animation">
                <input type="text" id="up-name" placeholder="الاسم الرباعي" class="input-field w-full p-4 rounded-2xl text-sm border border-white/10 bg-white/5">
                <select id="up-stage" class="input-field w-full p-4 rounded-2xl text-sm border border-white/10 bg-black text-white">
                    <option value="3s">الثالث الثانوي (عام)</option>
                    <option value="azhar">الثانوية الأزهرية</option>
                    <option value="2s">الثاني الثانوي</option>
                </select>
                <input type="password" id="up-pass" placeholder="كلمة مرور قوية" class="input-field w-full p-4 rounded-2xl text-sm border border-white/10 bg-white/5">
            </div>
        `;
    }
}

/** 6. معالج الدخول الرئيسي (Main Authenticator) **/
function startMakiExperience() {
    const nameInput = document.getElementById('up-name')?.value || document.getElementById('in-user')?.value;
    const stageInput = document.getElementById('up-stage')?.value || "3s";

    if (!nameInput || nameInput.length < 5) {
        showNotification("يا بطل، اكتب اسمك الحقيقي عشان تظهر في لوحة الشرف!");
        return;
    }

    // محاكاة الاتصال بالسيرفر
    const btn = document.querySelector('button[onclick="startMakiExperience()"]');
    btn.innerHTML = `<i class="animate-spin" data-lucide="loader-2"></i> جارِ التشفير...`;
    lucide.createIcons();

    setTimeout(() => {
        userState.data = { name: nameInput, stage: stageInput, id: "MAKI-" + Date.now().toString().slice(-4) };
        localStorage.setItem('rekaz_session', JSON.stringify(userState.data));
        initApp();
    }, 2000);
}

/** 7. تهيئة المنصة الداخلية (App Launch) **/
function initApp() {
    document.getElementById('auth-gate').classList.add('hidden');
    const app = document.getElementById('main-app');
    app.classList.remove('hidden');
    setTimeout(() => app.style.opacity = '1', 50);

    // تحديث البيانات المرئية
    document.getElementById('user-name-display').innerText = userState.data.name;
    document.getElementById('user-stage-display').innerText = `طالب ${userState.data.stage === 'azhar' ? 'أزهري' : 'ثانوية عامة'} | ID: ${userState.data.id}`;
    document.getElementById('user-avatar').src = `https://ui-avatars.com/api/?name=${userState.data.name}&background=D4AF37&color=000&bold=true`;

    loadLibrary();
    startLiveCheck();
    showNotification(`مرحباً بك يا ${userState.data.name.split(' ')[0]} في رِكاز 2026`);
}

/** 8. محرك المكتبة الذكي (Library Engine) **/
function loadLibrary(filter = 'all') {
    const container = document.getElementById('books-container');
    container.innerHTML = "";

    const filteredBooks = filter === 'all' 
        ? REKAZ_CORE.books 
        : REKAZ_CORE.books.filter(b => b.type.includes(filter));

    filteredBooks.forEach((book, idx) => {
        const card = document.createElement('div');
        card.className = "group relative reveal-animation";
        card.style.animationDelay = `${idx * 0.1}s`;
        card.innerHTML = `
            <div class="aspect-[3/4] bg-white/5 rounded-[2.5rem] overflow-hidden border border-white/10 group-hover:border-gold/50 transition-all duration-700 relative shadow-2xl">
                <img src="${book.img}" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700">
                <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                <div class="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
                    <i data-lucide="eye" size="12" class="text-gold"></i>
                    <span class="text-[9px] font-bold">${book.views}</span>
                </div>
                <div class="absolute bottom-6 left-4 right-4 translate-y-12 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <button onclick="downloadBook('${book.file}', ${book.id})" class="w-full py-4 bg-gold text-black rounded-2xl font-black text-[10px] flex items-center justify-center gap-2 shadow-xl shadow-gold/20 active:scale-95">
                        تحميل الكتاب <i data-lucide="download"></i>
                    </button>
                </div>
            </div>
            <h5 class="mt-5 font-black text-center text-sm group-hover:text-gold transition-colors">${book.title}</h5>
            <p class="text-[9px] text-gray-500 text-center font-black uppercase tracking-[0.2em] mt-1">${book.type}</p>
        `;
        container.appendChild(card);
    });
    lucide.createIcons();
}

/** 9. نظام التنبيهات والتحميل **/
function downloadBook(fileName, bookId) {
    showNotification("جارِ تجهيز رابط التحميل الآمن...");
    
    // محاكاة تحديث النقاط
    setTimeout(() => {
        userState.points += REKAZ_CORE.settings.pointsPerBook;
        localStorage.setItem('rekaz_points', userState.points);
        showNotification(`تم التحميل! حصلت على ${REKAZ_CORE.settings.pointsPerBook} نقطة مكافأة 🏆`);
        
        // كود التحميل الحقيقي (لو الملف موجود)
        // window.open('pdf/' + fileName, '_blank');
    }, 1500);
}

function showNotification(text) {
    const toast = document.getElementById('maki-notification');
    const toastText = document.getElementById('notification-text');
    toastText.innerText = text;
    
    toast.classList.remove('hidden');
    toast.style.transform = 'translate(-50%, 0)';
    toast.style.opacity = '1';

    setTimeout(() => {
        toast.style.transform = 'translate(-50%, -20px)';
        toast.style.opacity = '0';
        setTimeout(() => toast.classList.add('hidden'), 500);
    }, 4000);
}

/** 10. نظام البث المباشر الحي (Live Engine) **/
function startLiveCheck() {
    const liveBanner = document.getElementById('live-banner');
    setInterval(() => {
        const now = new Date();
        const hours = now.getHours();
        
        // يظهر البث من الساعة 7 مساءً حتى 11 مساءً
        if (hours >= 19 && hours <= 23) {
            liveBanner.classList.remove('hidden');
            liveBanner.classList.add('flex');
        } else {
            liveBanner.classList.add('hidden');
        }
    }, 60000); // يفحص كل دقيقة
}

/** 11. نظام الحماية (Anti-Cheat & Protection) **/
window.addEventListener('keydown', (e) => {
    // منع F12، Ctrl+Shift+I، Ctrl+U
    if (e.keyCode === 123 || (e.ctrlKey && e.shiftKey && e.keyCode === 73) || (e.ctrlKey && e.keyCode === 85)) {
        e.preventDefault();
        showNotification("عذراً، محاولة الوصول لأكواد المنصة مرفوضة 🛡️");
    }
});

function logoutMaki() {
    if (confirm("هل تريد تسجيل الخروج من النادي الملكي؟")) {
        localStorage.removeItem('rekaz_session');
        window.location.reload();
    }
}
