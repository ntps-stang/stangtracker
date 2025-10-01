function init() {
    initializePercentages();
    initializePresetPercentages();
    loadDefaultPresets();
    renderCategories();
    renderPresetCategories();
    renderPresetsList();
    renderPresetButtons();
    updateTotalPercent();
    updatePresetTotalPercent();
    
    // Add event listener for income input
    document.getElementById('income').addEventListener('input', updateAmounts);
}

// Render category cards
function renderCategories() {
    const container = document.getElementById('categories');
    container.innerHTML = categories.map(cat => `
        <div class="category-card">
            <div class="category-header">
                <div class="category-info">
                    <span class="category-icon">${cat.icon}</span>
                    <span class="category-name">${cat.name}</span>
                </div>
                <div class="category-percent">
                    <input type="number" value="${cat.defaultPercent}" 
                           onchange="updatePercent('${cat.id}', this.value)"
                           min="0" max="100" 
                           id="input-${cat.id}" />
                    <span style="font-weight: 700; font-size: 1.2em;">%</span>
                </div>
            </div>
            <div class="category-amount" id="amount-${cat.id}" style="color: ${cat.color}">
                ฿0.00
            </div>
        </div>
    `).join('');
}

// Update all category inputs
function updateAllCategoryInputs() {
    categories.forEach(cat => {
        const input = document.getElementById(`input-${cat.id}`);
        if (input) {
            input.value = percentages[cat.id];
        }
    });
}

// Update percentage for a category
function updatePercent(catId, value) {
    percentages[catId] = parseFloat(value) || 0;
    updateTotalPercent();
    updateAmounts();
}

// Update total percentage display
function updateTotalPercent() {
    const total = Object.values(percentages).reduce((sum, val) => sum + val, 0);
    document.getElementById('totalPercent').textContent = total + '%';
    
    const card = document.getElementById('totalCard');
    const warning = document.getElementById('warning');
    
    if (total === 100) {
        card.className = 'total-card complete';
        warning.style.display = 'none';
    } else {
        card.className = 'total-card incomplete';
        warning.style.display = 'block';
    }
}

// Update category amounts based on income
function updateAmounts() {
    const income = parseFloat(document.getElementById('income').value) || 0;
    categories.forEach(cat => {
        const amount = (income * percentages[cat.id]) / 100;
        document.getElementById(`amount-${cat.id}`).textContent = formatCurrency(amount);
    });
}

// Save monthly data
function saveData() {
    const month = document.getElementById('selectedMonth').value;
    const income = parseFloat(document.getElementById('income').value);
    const total = Object.values(percentages).reduce((sum, val) => sum + val, 0);
    
    if (!month || !income || total !== 100) {
        alert('Please fill all fields and ensure percentages total 100%');
        return;
    }
    
    const allocations = categories.map(cat => ({
        category: cat.name,
        color: cat.color,
        percent: percentages[cat.id],
        amount: (income * percentages[cat.id]) / 100
    }));
    
    addMonthlyEntry(month, income, allocations);
    
    // Clear inputs
    document.getElementById('income').value = '';
    document.getElementById('selectedMonth').value = '';
    
    // Switch to dashboard
    showView('dashboard');
}

// Switch between views
function showView(view) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    
    document.getElementById(view + '-view').classList.add('active');
    event.target.classList.add('active');
    
    if (view === 'dashboard') {
        updateDashboard();
    } else if (view === 'input') {
        updateAmounts();
    } else if (view === 'presets') {
        renderPresetsList();
    }
}

// Update dashboard with latest data
function updateDashboard() {
    const totalMonths = monthlyData.length;
    
    document.getElementById('totalMonths').textContent = totalMonths;
    document.getElementById('totalIncome').textContent = formatCurrency(getTotalIncome());
    document.getElementById('avgIncome').textContent = formatCurrency(getAverageIncome());
    
    if (totalMonths === 0) {
        document.getElementById('chartsSection').style.display = 'none';
        document.getElementById('emptyState').style.display = 'block';
    } else {
        document.getElementById('chartsSection').style.display = 'block';
        document.getElementById('emptyState').style.display = 'none';
        renderAllCharts();
        renderRecords();
    }
}

// Render monthly records list
function renderRecords() {
    const list = document.getElementById('recordsList');
    list.innerHTML = monthlyData.map((data, index) => `
        <div class="record-item">
            <div>
                <div class="record-month">${data.month}</div>
                <div class="record-amount">${formatCurrency(data.income)}</div>
            </div>
            <button class="delete-btn" onclick="deleteMonth(${index})">🗑️ Delete</button>
        </div>
    `).join('');
}

// Delete a month's record
function deleteMonth(index) {
    deleteMonthlyEntry(index);
    updateDashboard();
}

// Start the application
init();
