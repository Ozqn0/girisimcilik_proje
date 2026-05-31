// TaskFlow Manager - Application Logic (Multi-Page System)

// Default Sample Data for Initial Load (Premium Matbaa Teması)
const defaultPlans = [
    { code: "PLN-10827", title: "Haftalık Edebiyat Dergisi Temmuz Sayısı", department: "Ofset Baskı", responsible: "Batuhan", description: "Derginin sayfa dizgilerinin tamamlanması, font kontrolleri ve mavi taslak (Cyan) kalıp çıkartılması.", status: "iletiliyor" },
    { code: "PLN-39482", title: "Lüks Ürün Tanıtım Kataloğu", department: "Dijital Baskı", responsible: "Halil", description: "Renk profillerinin Magenta kalıplara ayarlanması ve prova baskı kontrolleri.", status: "olusturuluyor" },
    { code: "PLN-84729", title: "Kurumsal Ambalaj Kutusu Basımı", department: "Flekso Baskı", responsible: "Sevenç", description: "250gr mat kuşe kağıda 4 renk (CMYK) ofset pres basımının fiilen başlatılması.", status: "tamamlandi" },
    { code: "PLN-94827", title: "Prestijli Şiir Kitabı Ciltlemesi", department: "Serigrafi (Elek) Baskı", responsible: "Ozan Yusuf", description: "İplik dikişlerin tamamlanması, sert mukavva kapak takımı, giyotin kesim ve paketleme.", status: "teslim_edildi" }
];

let state = {
    plans: [],
    responsibles: []
};

const defaultResponsibles = [
    { name: "Batuhan", department: "Ofset Baskı" },
    { name: "Halil", department: "Dijital Baskı" },
    { name: "Ozan Yusuf", department: "Serigrafi (Elek) Baskı" },
    { name: "Sevenç", department: "Flekso Baskı" },
    { name: "Mehmet", department: "Tifdruk (Çukur) Baskı" }
];

// 1. Initialize State
function initializeApp() {
    // 1.1. Initialize Responsibles List
    const savedResponsibles = localStorage.getItem("taskflow_responsibles");
    if (savedResponsibles) {
        try {
            state.responsibles = JSON.parse(savedResponsibles);
        } catch (e) {
            console.error("Error parsing localStorage responsibles", e);
            state.responsibles = [...defaultResponsibles];
            saveResponsiblesToStorage();
        }
    } else {
        state.responsibles = [...defaultResponsibles];
        saveResponsiblesToStorage();
    }

    // 1.2. Initialize Plans
    const savedPlans = localStorage.getItem("taskflow_plans");
    if (savedPlans) {
        try {
            state.plans = JSON.parse(savedPlans);
            
            // Migrate old assignments/departments to new randomized scheme
            let modified = false;
            const oldToNewMapping = {
                "Sevenç (Ofset Baskı)": "Batuhan (Ofset Baskı)",
                "Ozan Yusuf (Dijital Baskı)": "Halil (Dijital Baskı)",
                "Mehmet (Serigrafi (Elek) Baskı)": "Ozan Yusuf (Serigrafi (Elek) Baskı)",
                "Batuhan (Flekso Baskı)": "Sevenç (Flekso Baskı)",
                "Halil (Tifdruk (Çukur) Baskı)": "Mehmet (Tifdruk (Çukur) Baskı)",
                "Ozan Yusuf (Dizgi&Tasarım)": "Ozan Yusuf (Serigrafi (Elek) Baskı)",
                "Mehmet (Renk Kalıbı Hazırlama)": "Mehmet (Tifdruk (Çukur) Baskı)",
                "Batuhan (Mücellithane (Ciltleme))": "Sevenç (Flekso Baskı)",
                "Halil (Yönetim/Sevkiyat)": "Halil (Dijital Baskı)"
            };

            state.plans.forEach(plan => {
                if (oldToNewMapping[plan.responsible]) {
                    plan.responsible = oldToNewMapping[plan.responsible];
                    modified = true;
                }
                
                // Strip parentheses from responsible names: "Batuhan (Ofset Baskı)" -> "Batuhan"
                if (plan.responsible && plan.responsible.includes("(")) {
                    plan.responsible = plan.responsible.split("(")[0].trim();
                    modified = true;
                }
                
                // Keep department synced with responsible's registered department
                const ustaObj = state.responsibles.find(r => r.name.toLowerCase() === plan.responsible.toLowerCase());
                if (ustaObj && plan.department !== ustaObj.department) {
                    plan.department = ustaObj.department;
                    modified = true;
                }

                // Migrate old statuses to new process stages
                if (plan.status === "tamamlandi") {
                    plan.status = "teslim_edildi";
                    modified = true;
                } else if (plan.status === "devreye_sokma") {
                    plan.status = "tamamlandi";
                    modified = true;
                } else if (plan.status === "duzenleme") {
                    plan.status = "olusturuluyor";
                    modified = true;
                } else if (plan.status === "planlama") {
                    plan.status = "iletiliyor";
                    modified = true;
                }
            });

            if (modified) {
                saveStateToStorage();
            }
        } catch (e) {
            console.error("Error parsing localStorage plans", e);
            state.plans = [...defaultPlans];
            saveStateToStorage();
        }
    } else {
        // First run, populate with default sample data
        state.plans = [...defaultPlans];
        saveStateToStorage();
    }

    // Detect Page and run specific logic
    detectAndRoutePage();
}

// 2. Save State to Storage
function saveStateToStorage() {
    localStorage.setItem("taskflow_plans", JSON.stringify(state.plans));
}

// 3. Detect which page is currently open and trigger specific code
function detectAndRoutePage() {
    const path = window.location.pathname;
    
    if (path.includes("plan_ekle")) {
        const deptSelect = document.getElementById("plan-department");
        const respSelect = document.getElementById("plan-responsible");
        if (deptSelect && respSelect) {
            const updateResponsiblesDropdown = () => {
                const selectedDept = deptSelect.value;
                const filtered = state.responsibles.filter(r => r.department === selectedDept);
                
                respSelect.innerHTML = "";
                if (filtered.length === 0) {
                    const opt = document.createElement("option");
                    opt.value = "";
                    opt.textContent = "Kayıtlı usta bulunamadı";
                    opt.disabled = true;
                    respSelect.appendChild(opt);
                } else {
                    filtered.forEach((r, idx) => {
                        const opt = document.createElement("option");
                        const valueText = r.name;
                        opt.value = valueText;
                        opt.textContent = valueText;
                        if (idx === 0) opt.selected = true;
                        respSelect.appendChild(opt);
                    });
                }
            };
            
            // Populate on load
            updateResponsiblesDropdown();
            
            // Listen for changes
            deptSelect.addEventListener("change", updateResponsiblesDropdown);
        }
    } else if (path.includes("durum_sorgula")) {
        // Durum sorgula page loaded
        // Proactively check if there's a code in URL query string (optional bonus feature)
        const urlParams = new URLSearchParams(window.location.search);
        const codeParam = urlParams.get('code');
        if (codeParam) {
            document.getElementById("tracking-code-input").value = codeParam;
            queryPlanStatus();
        }
    } else if (path.includes("admin_paneli")) {
        // Admin panel loaded
        checkAdminAuth();
    }
}

/* ==========================================================================
   PLAN EKLE (CREATE PLAN) PAGE LOGIC
   ========================================================================== */

function handleCreatePlan(e) {
    e.preventDefault();
    
    const title = document.getElementById("plan-title").value.trim();
    const department = document.getElementById("plan-department").value;
    const responsible = document.getElementById("plan-responsible").value.trim();
    const description = document.getElementById("plan-description").value.trim();
    
    // Generate unique random code: PLN-XXXXX (5 random numbers)
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const code = `PLN-${randomNum}`;
    
    const newPlan = {
        code,
        title,
        department,
        responsible,
        description,
        status: "iletiliyor" // Starts in initial phase by default
    };
    
    state.plans.push(newPlan);
    saveStateToStorage();
    
    // UI Animations: Hide Form, Show success box
    document.getElementById("create-plan-form").classList.add("hidden");
    const successBox = document.getElementById("plan-success-box");
    successBox.classList.remove("hidden");
    
    // Set code value text
    document.getElementById("generated-plan-code").textContent = code;
    
    // Toast notification
    showToast(`Plan ${code} başarıyla oluşturuldu.`);
}

function copyPlanCode() {
    const codeVal = document.getElementById("generated-plan-code").textContent;
    navigator.clipboard.writeText(codeVal).then(() => {
        showToast("Takip kodu panoya kopyalandı! 📋");
    }).catch(err => {
        console.error("Clipboard copy failed", err);
    });
}

function resetFormView() {
    document.getElementById("create-plan-form").reset();
    document.getElementById("create-plan-form").classList.remove("hidden");
    document.getElementById("plan-success-box").classList.add("hidden");
}


/* ==========================================================================
   DURUM SORGULA (PLAN TRACKING) PAGE LOGIC
   ========================================================================== */

function queryPlanStatus() {
    const codeInput = document.getElementById("tracking-code-input").value.trim().toUpperCase();
    
    const errorBox = document.getElementById("query-error-box");
    const resultsBox = document.getElementById("query-results-box");
    
    if (!codeInput) {
        errorBox.classList.remove("hidden");
        document.getElementById("query-error-text").textContent = "Lütfen sorgulamak istediğiniz takip kodunu girin.";
        resultsBox.classList.add("hidden");
        return;
    }
    
    // Find plan
    const plan = state.plans.find(p => p.code === codeInput);
    
    if (!plan) {
        errorBox.classList.remove("hidden");
        document.getElementById("query-error-text").textContent = "Girdiğiniz takip koduna ait süreç planlaması bulunamadı. Lütfen kodu (örn: PLN-10827) kontrol edin.";
        resultsBox.classList.add("hidden");
        return;
    }
    
    // Success: Hide error, show result details
    errorBox.classList.add("hidden");
    resultsBox.classList.remove("hidden");
    
    document.getElementById("res-plan-code").textContent = plan.code;
    document.getElementById("res-plan-title").textContent = plan.title;
    document.getElementById("res-plan-responsible").textContent = plan.responsible;
    document.getElementById("res-plan-department").textContent = plan.department;
    document.getElementById("res-plan-description").textContent = plan.description;
    
    // Build vertical timeline stepper status
    renderTimelineStepper(plan.status);
}

// Map status key to step index values
const stepMapping = {
    "iletiliyor": 1,
    "olusturuluyor": 2,
    "tamamlandi": 3,
    "teslim_edildi": 4
};

function renderTimelineStepper(status) {
    const currentStepIndex = stepMapping[status] || 1;
    
    for (let i = 1; i <= 4; i++) {
        const stepNode = document.getElementById(`step-node-${i}`);
        const badge = document.getElementById(`step-badge-${i}`);
        
        // Reset classes
        stepNode.classList.remove("completed", "active");
        
        if (i < currentStepIndex) {
            // Completed steps
            stepNode.classList.add("completed");
            badge.textContent = "Tamamlandı";
        } else if (i === currentStepIndex) {
            // Active step
            stepNode.classList.add("active");
            
            // Customize text of active badge
            if (status === "iletiliyor") badge.textContent = "Aktif (İletiliyor)";
            else if (status === "olusturuluyor") badge.textContent = "Aktif (Oluşturuluyor)";
            else if (status === "tamamlandi") badge.textContent = "Aktif (Tamamlandı)";
            else if (status === "teslim_edildi") {
                stepNode.classList.remove("active");
                stepNode.classList.add("completed");
                badge.textContent = "Teslim Edildi";
            }
        } else {
            // Pending / Wait steps
            badge.textContent = "Beklemede";
        }
    }
}


/* ==========================================================================
   YÖNETİCİ PANELİ (ADMIN PANEL) PAGE LOGIC
   ========================================================================== */

function renderAdminDashboard() {
    calculateAndRenderMetrics();
    renderAdminTable();
    renderResponsiblesList();
}

function calculateAndRenderMetrics() {
    const total = state.plans.length;
    const iletiliyorCount = state.plans.filter(p => p.status === "iletiliyor").length;
    const olusturuluyorCount = state.plans.filter(p => p.status === "olusturuluyor").length;
    const tamamlandiCount = state.plans.filter(p => p.status === "tamamlandi").length;
    const teslimEdildiCount = state.plans.filter(p => p.status === "teslim_edildi").length;
    
    document.getElementById("total-plans-count").textContent = total;
    document.getElementById("todo-plans-count").textContent = iletiliyorCount;
    document.getElementById("progress-plans-count").textContent = olusturuluyorCount;
    document.getElementById("deploy-plans-count").textContent = tamamlandiCount;
    document.getElementById("done-plans-count").textContent = teslimEdildiCount;
}

function renderAdminTable() {
    const tbody = document.getElementById("plans-table-body");
    tbody.innerHTML = "";
    
    if (state.plans.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; color: var(--color-text-muted); padding: 30px;">
                    Sistemde kayıtlı süreç planı bulunmamaktadır. Eklemek için sağ üstteki butonu kullanın.
                </td>
            </tr>
        `;
        return;
    }
    
    state.plans.forEach(plan => {
        const row = document.createElement("tr");
        
        // Stylize border color using CMYK print variables
        let selectBorderColor = "var(--color-ink)";
        if (plan.status === "iletiliyor") selectBorderColor = "var(--color-cmyk-c)";
        else if (plan.status === "olusturuluyor") selectBorderColor = "var(--color-cmyk-m)";
        else if (plan.status === "tamamlandi") selectBorderColor = "var(--color-cmyk-y)";
        else if (plan.status === "teslim_edildi") selectBorderColor = "var(--color-cmyk-k)";

        row.innerHTML = `
            <td><strong style="color: var(--color-primary);">${plan.code}</strong></td>
            <td><strong>${plan.title}</strong></td>
            <td>${plan.responsible}</td>
            <td><span class="lbl" style="font-size: 11px;">${plan.department}</span></td>
            <td>
                <select class="admin-status-dropdown" onchange="updatePlanStatus('${plan.code}', this.value)" style="border: 1px solid ${selectBorderColor}; background-color: var(--color-bg-input); color: var(--color-text);">
                    <option value="iletiliyor" ${plan.status === 'iletiliyor' ? 'selected' : ''}>1. İlgili Departmana İletiliyor</option>
                    <option value="olusturuluyor" ${plan.status === 'olusturuluyor' ? 'selected' : ''}>2. Sipariş Oluşturuluyor</option>
                    <option value="tamamlandi" ${plan.status === 'tamamlandi' ? 'selected' : ''}>3. Sipariş Tamamlandı</option>
                    <option value="teslim_edildi" ${plan.status === 'teslim_edildi' ? 'selected' : ''}>4. Sipariş Teslim Edildi</option>
                </select>
            </td>
            <td style="text-align: right;">
                <button class="btn btn-danger" onclick="deletePlan('${plan.code}')">Sil</button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

function updatePlanStatus(code, newStatus) {
    const plan = state.plans.find(p => p.code === code);
    if (plan) {
        plan.status = newStatus;
        saveStateToStorage();
        calculateAndRenderMetrics();
        renderAdminTable(); // Refresh table borders and selects
        showToast(`Plan ${code} durumu güncellendi: ${getPhaseName(newStatus)}`);
    }
}

function deletePlan(code) {
    if (confirm(`Plan ${code} silinecektir. Emin misiniz?`)) {
        state.plans = state.plans.filter(p => p.code !== code);
        saveStateToStorage();
        calculateAndRenderMetrics();
        renderAdminTable();
        showToast(`Plan ${code} sistemden silindi.`);
    }
}

// Helpers to get visual phase names
function getPhaseName(status) {
    if (status === "iletiliyor") return "İlgili Departmana İletiliyor";
    if (status === "olusturuluyor") return "Sipariş Oluşturuluyor";
    if (status === "tamamlandi") return "Sipariş Tamamlandı";
    if (status === "teslim_edildi") return "Sipariş Teslim Edildi";
    return status;
}


/* ==========================================================================
   UTILITY ACTIONS (TOAST & SMOOTH SCROLL)
   ========================================================================== */

function showToast(message) {
    const toast = document.createElement("div");
    toast.style.position = "fixed";
    toast.style.bottom = "24px";
    toast.style.right = "24px";
    toast.style.backgroundColor = "var(--color-ink)";
    toast.style.border = "1px solid var(--color-ink)";
    toast.style.color = "var(--color-paper)";
    toast.style.padding = "12px 24px";
    toast.style.borderRadius = "var(--border-radius-sm)";
    toast.style.fontSize = "13px";
    toast.style.fontWeight = "600";
    toast.style.zIndex = "10000";
    toast.style.boxShadow = "var(--shadow-paper)";
    toast.style.animation = "slideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)";
    
    toast.innerHTML = `🖨️ ${message}`;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = "slideOut 0.3s ease-in";
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 2800);
}

// Append styling for toast slide animations dynamically
const styleTag = document.createElement('style');
styleTag.innerHTML = `
@keyframes slideIn {
    from { transform: translateY(80px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}
@keyframes slideOut {
    from { transform: translateY(0); opacity: 1; }
    to { transform: translateY(80px); opacity: 0; }
}
`;
document.head.appendChild(styleTag);

function saveResponsiblesToStorage() {
    localStorage.setItem("taskflow_responsibles", JSON.stringify(state.responsibles));
}

function handleAddResponsible(e) {
    e.preventDefault();
    const nameInput = document.getElementById("new-responsible-name");
    const deptSelect = document.getElementById("new-responsible-dept");
    
    if (!nameInput || !deptSelect) return;
    
    const name = nameInput.value.trim();
    const department = deptSelect.value;
    
    if (!name) return;
    
    // Check if usta is already registered in this department
    const exists = state.responsibles.some(r => r.name.toLowerCase() === name.toLowerCase() && r.department === department);
    if (exists) {
        showToast("Bu usta zaten bu departmanda kayıtlı!");
        return;
    }
    
    state.responsibles.push({ name, department });
    saveResponsiblesToStorage();
    
    nameInput.value = "";
    
    renderResponsiblesList();
    showToast(`${name} (${department}) ustası başarıyla eklendi.`);
}

function deleteResponsible(name, department) {
    const deptCount = state.responsibles.filter(r => r.department === department).length;
    if (deptCount <= 1) {
        alert(`${department} departmanı için en az 1 sorumlu usta bulunmalıdır!`);
        return;
    }

    if (confirm(`${name} (${department}) ustasını silmek istediğinize emin misiniz?`)) {
        state.responsibles = state.responsibles.filter(r => !(r.name === name && r.department === department));
        saveResponsiblesToStorage();
        renderResponsiblesList();
        showToast(`${name} ustası silindi.`);
    }
}

function renderResponsiblesList() {
    const tbody = document.getElementById("responsibles-table-body");
    if (!tbody) return;
    
    tbody.innerHTML = "";
    
    if (state.responsibles.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="3" style="text-align: center; color: var(--color-text-muted); padding: 20px;">
                    Kayıtlı usta bulunmamaktadır.
                </td>
            </tr>
        `;
        return;
    }
    
    state.responsibles.forEach(r => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><strong>${r.name}</strong></td>
            <td><span class="lbl" style="font-size: 11px;">${r.department}</span></td>
            <td style="text-align: right;">
                <button class="btn btn-danger" style="padding: 4px 8px; font-size: 11px;" onclick="deleteResponsible('${r.name.replace(/'/g, "\\'")}', '${r.department}')">Sil</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function handleAdminLogin(e) {
    e.preventDefault();
    const user = document.getElementById("login-username").value.trim();
    const pass = document.getElementById("login-password").value.trim();
    const errorMsg = document.getElementById("login-error-msg");
    
    if (user === "admin" && pass === "admin") {
        sessionStorage.setItem("admin_logged_in", "true");
        if (errorMsg) errorMsg.classList.add("hidden");
        checkAdminAuth();
        showToast("Yönetici konsoluna başarıyla giriş yapıldı.");
    } else {
        if (errorMsg) errorMsg.classList.remove("hidden");
    }
}

function handleAdminLogout() {
    sessionStorage.removeItem("admin_logged_in");
    window.location.reload();
}

function checkAdminAuth() {
    const loginGate = document.getElementById("admin-login-gate");
    const content = document.getElementById("admin-dashboard-content");
    
    if (loginGate && content) {
        const isLoggedIn = sessionStorage.getItem("admin_logged_in") === "true";
        if (isLoggedIn) {
            loginGate.classList.add("hidden");
            content.classList.remove("hidden");
            renderAdminDashboard();
        } else {
            loginGate.classList.remove("hidden");
            content.classList.add("hidden");
        }
    }
}

// Initialize application on page load
initializeApp();
