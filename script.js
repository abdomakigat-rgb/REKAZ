/**
 * رِكاز 2026 - العقل المدبر (Logic)
 * المبرمج: Ab Maki
 */

// 1. قاعدة بيانات المواد والأسئلة
const REKAZ_DB = {
    stages: ["رابعة ابتدائي", "خامسة ابتدائي", "سادسة ابتدائي", "أولى إعدادي", "تانية إعدادي", "تالتة إعدادي", "أولى ثانوي", "تانية ثانوي", "تالتة ثانوي"],
    subjects: {
        elementary: ["اللغة العربية", "الرياضيات", "العلوم", "الدراسات الاجتماعية", "English (Connect)"],
        preparatory: ["اللغة العربية", "الرياضيات", "العلوم", "الدراسات", "اللغة الإنجليزية"],
        secondary: ["الفيزياء", "الكيمياء", "الأحياء", "التاريخ", "الجغرافيا", "اللغة العربية", "الرياضيات"]
    },
    // عينة لأسئلة الاختبارات
    quizBank: [
        { q: "ما هو العلم الذي يهتم بدراسة المادة والطاقة؟", o: ["الكيمياء", "الفيزياء", "الأحياء", "الفلك"], c: 1 },
        { q: "كم عدد أركان الإسلام؟", o: ["ثلاثة", "أربعة", "خمسة", "ستة"], c: 2 },
        { q: "من هو قائد معركة حطين؟", o: ["خالد بن الوليد", "صلاح الدين الأيوبي", "قطز", "عمر بن الخطاب"], c: 1 }
    ]
};

// 2. المتغيرات العامة للنظام
let currentUser = null;
let profileImage = "https://ui-avatars.com/api/?background=D4AF37&color=000&size=256";
let quizScore = 0;
let currentQuestionIndex = 0;
let activeQuizList = [];

// 3. نظام التوثيق (Auth System)
function toggleAuth(mode) {
    const inputs = document.getElementById('auth-inputs');
    const btnLogin = document.getElementById('btn-login');
    const btnSignup = document.getElementById('btn-signup');
    const actionText = document.getElementById('auth-action-text');

    if (mode === 'login') {
        btnLogin.className = "flex-1 py-3 rounded-xl font-bold bg-gold text-black shadow-lg shadow-gold/20";
        btnSignup.className = "flex-1 py-3 rounded-xl font-bold text-gray-400";
        actionText.innerText = "دخول النادي الملكي";
        inputs.innerHTML = `
            <input type="text" id="u-name-in" placeholder="اسم المستخدم" class="input-maki reveal">
            <input type="password" id="u-pass-in" placeholder="كلمة المرور" class="input-maki reveal" style="animation-delay: 0.1s">
        `;
    } else {
        btnSignup.className = "flex-1 py-3 rounded-xl font-bold bg-gold text-black shadow-lg shadow-gold/20";
        btnLogin.className = "flex-1 py-3 rounded-xl font-bold text-gray-400";
        actionText.innerText = "إنشاء عضوية ملكية";
        inputs.innerHTML = `
            <div class="flex justify-center mb-4 reveal">
                <label class="w-24 h-24 rounded-[2rem] border-2 border-dashed border-gold/30 flex items-center justify-center cursor-pointer overflow-hidden bg-white/5 hover:border-gold transition-all">
                    <img id="temp-pfp" class="hidden w-full h-full object-cover">
                    <i id="cam-icon" data-lucide="camera" class="text-gold"></i>
                    <input type="file" class="hidden" onchange="previewProfileImage(this)">
                </label>
            </div>
            <input type="text" id="u-name-in" placeholder="الاسم الرباعي" class="input-maki reveal">
            <select id="u-stage-in" class="input-maki reveal" style="animation-delay: 0.1s">
                ${REKAZ_DB.stages.map(s => `<option value="${s}">${s}</option>`).join('')}
            </select>
        `;
    }
    lucide.createIcons();
}

function previewProfileImage(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            profileImage = e.target.result;
            document.getElementById('temp-pfp').src = e.target.result;
            document.getElementById('temp-pfp').classList.remove('hidden');
            document.getElementById('cam-icon').classList.add('hidden');
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function handleAuth() {
    const nameInput = document.getElementById('u-name-in').value;
    const stageInput = document.getElementById('u-stage-in')?.value || "الثالث الثانوي";

    if (nameInput.length < 3) {
        alert("يا بطل، الاسم لازم يكون حقيقي وطويل شوية!");
        return;
    }

    // حفظ بيانات المستخدم
    currentUser = { name: nameInput, stage: stageInput };

    // تحديث الواجهة
    document.getElementById('display-name').innerText = currentUser.name;
    document.getElementById('display-rank').innerText = currentUser.stage;
    document.getElementById('user-avatar').src = profileImage;
    document.getElementById('stage-badge').innerText = `كتب ${currentUser.stage} - النسخة الأصلية`;

    // الانتقال للتطبيق
    document.getElementById('auth-screen').style.display = 'none';
    const app = document.getElementById('app-content');
    app.classList.remove('hidden');
    setTimeout(() => app.classList.add('opacity-100'), 50);

    loadLibrary(currentUser.stage);
}

// 4. نظام المكتبة (Library System)
function loadLibrary(stage) {
    const grid = document.getElementById('library-grid');
    let subList = [];

    if (stage.includes("ابتدائي")) subList = REKAZ_DB.subjects.elementary;
    else if (stage.includes("إعدادي")) subList = REKAZ_DB.subjects.preparatory;
    else subList = REKAZ_DB.subjects.secondary;

    grid.innerHTML = subList.map((sub, idx) => `
        <div onclick="startQuiz('${sub}')" class="glass-panel p-8 text-center group cursor-pointer reveal" style="animation-delay: ${idx * 0.1}s">
            <div class="w-16 h-16 bg-gold/10 rounded-[1.5rem] mx-auto mb-5 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black transition-all duration-500">
                <i data-lucide="book-open-check" size="28"></i>
            </div>
            <h5 class="font-black text-sm mb-4">${sub}</h5>
            <button class="w-full py-2 bg-white/5 rounded-xl text-[10px] text-gold font-bold border border-gold/10 group-hover:bg-gold/20 transition-all">تحميل PDF</button>
        </div>
    `).join('');
    lucide.createIcons();
}

// 5. نظام الاختبارات (Quiz Logic)
function startQuiz(subName) {
    activeQuizList = [...REKAZ_DB.quizBank].sort(() => Math.random() - 0.5); // خلط الأسئلة
    currentQuestionIndex = 0;
    quizScore = 0;
    
    document.getElementById('quiz-container').classList.remove('hidden');
    document.getElementById('q-title').innerText = `تحدي: ${subName}`;
    renderQuestion();
}

function renderQuestion() {
    const q = activeQuizList[currentQuestionIndex];
    if (!q) return showFinalResult();

    document.getElementById('q-text').innerText = q.q;
    const optionsGrid = document.getElementById('q-options');
    optionsGrid.innerHTML = q.o.map((opt, i) => `
        <button onclick="checkSelectedAnswer(${i}, ${q.c})" class="q-option reveal shadow-sm">
            ${opt}
        </button>
    `).join('');

    document.getElementById('next-q-btn').disabled = true;
    document.getElementById('next-q-btn').classList.add('opacity-30');
}

function checkSelectedAnswer(idx, correct) {
    const btns = document.querySelectorAll('.q-option');
    btns.forEach(b => b.disabled = true);

    if (idx === correct) {
        btns[idx].classList.add('q-correct');
        quizScore++;
    } else {
        btns[idx].classList.add('q-wrong');
        btns[correct].classList.add('q-correct');
    }

    const nextBtn = document.getElementById('next-q-btn');
    nextBtn.disabled = false;
    nextBtn.classList.remove('opacity-30');
}

function nextQuestion() {
    currentQuestionIndex++;
    renderQuestion();
}

function showFinalResult() {
    const total = activeQuizList.length;
    const percentage = (quizScore / total) * 100;
    let rank = percentage >= 90 ? "ملك التعليم 🔥" : percentage >= 70 ? "طالب مجتهد ✨" : "محتاج مراجعة 👍";
    
    alert(`النتيجة النهائية: ${quizScore} من ${total}\nرتبتك الحالية: ${rank}`);
    closeQuiz();
}

function closeQuiz() {
    document.getElementById('quiz-container').classList.add('hidden');
}

// تشغيل التأثيرات عند البداية
window.onload = () => {
    toggleAuth('login');
    lucide.createIcons();
};

