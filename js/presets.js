let presets = [];
let presetPercentages = {};

// Initialize preset percentages
function initializePresetPercentages() {
    categories.forEach(cat => {
        presetPercentages[cat.id] = cat.defaultPercent;
    });
}

// Default presets
const defaultPresets = [
    {
        name: 'Balanced',
        percentages: { free: 15, mandatory: 30, semester: 15, car: 10, lunch: 10, investment: 20 }
    },
    {
        name: 'Aggressive Savings',
        percentages: { free: 10, mandatory: 25, semester: 15, car: 5, lunch: 10, investment: 35 }
    },
    {
        name: 'Student Focus',
        percentages: { free: 15, mandatory: 25, semester: 30, car: 10, lunch: 10, investment: 10 }
    },
    {
        name: 'Minimal Savings',
        percentages: { free: 25, mandatory: 35, semester: 10, car: 15, lunch: 10, investment: 5 }
    }
];

// Load default presets on init
function loadDefaultPresets() {
    if (presets.length === 0) {
        presets = [...defaultPresets];
    }
}

// Save a new preset
function savePreset() {
    const name = document.getElementById('presetName').value.trim();
    const total = Object.values(presetPercentages).reduce((sum, val) => sum + val, 0);
    
    if (!name) {
        alert('Please enter a preset name');
        return;
    }
    
    if (total !== 100) {
        alert('Total percentage must equal 100%');
        return;
    }
    
    // Check if preset name already exists
    const existingIndex = presets.findIndex(p => p.name === name);
    
    if (existingIndex >= 0) {
        if (!confirm('A preset with this name already exists. Overwrite it?')) {
            return;
        }
        presets[existingIndex] = {
            name: name,
            percentages: { ...presetPercentages }
        };
    } else {
        presets.push({
            name: name,
            percentages: { ...presetPercentages }
        });
    }
    
    document.getElementById('presetName').value = '';
    renderPresetsList();
    renderPresetButtons();
    alert('Preset saved successfully!');
}

// Load a preset into current percentages
function loadPreset(presetName) {
    const preset = presets.find(p => p.name === presetName);
    if (preset) {
        percentages = { ...preset.percentages };
        updateAllCategoryInputs();
        updateTotalPercent();
        updateAmounts();
        alert(`Loaded preset: ${presetName}`);
    }
}

// Load preset into preset editor
function loadPresetToEditor(presetName) {
    const preset = presets.find(p => p.name === presetName);
    if (preset) {
        presetPercentages = { ...preset.percentages };
        document.getElementById('presetName').value = preset.name;
        updatePresetCategoryInputs();
        updatePresetTotalPercent();
    }
}

// Delete a preset
function deletePreset(presetName) {
    if (confirm(`Are you sure you want to delete preset "${presetName}"?`)) {
        presets = presets.filter(p => p.name !== presetName);
        renderPresetsList();
        renderPresetButtons();
    }
}

// Update preset percentage
function updatePresetPercent(catId, value) {
    presetPercentages[catId] = parseFloat(value) || 0;
    updatePresetTotalPercent();
}

// Update preset total percentage display
function updatePresetTotalPercent() {
    const total = Object.values(presetPercentages).reduce((sum, val) => sum + val, 0);
    document.getElementById('presetTotalPercent').textContent = total + '%';
    
    const card = document.getElementById('presetTotalCard');
    const warning = document.getElementById('presetWarning');
    
    if (total === 100) {
        card.className = 'total-card complete';
        warning.style.display = 'none';
    } else {
        card.className = 'total-card incomplete';
        warning.style.display = 'block';
    }
}

// Render preset categories in editor
function renderPresetCategories() {
    const container = document.getElementById('presetCategories');
    container.innerHTML = categories.map(cat => `
        <div class="category-card">
            <div class="category-header">
                <div class="category-info">
                    <span class="category-icon">${cat.icon}</span>
                    <span class="category-name">${cat.name}</span>
                </div>
                <div class="category-percent">
                    <input type="number" value="${cat.defaultPercent}" 
                           onchange="updatePresetPercent('${cat.id}', this.value)"
                           min="0" max="100" 
                           id="preset-input-${cat.id}" />
                    <span style="font-weight: 700; font-size: 1.2em;">%</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Update preset category inputs
function updatePresetCategoryInputs() {
    categories.forEach(cat => {
        const input = document.getElementById(`preset-input-${cat.id}`);
        if (input) {
            input.value = presetPercentages[cat.id];
        }
    });
}

// Render saved presets list
function renderPresetsList() {
    const container = document.getElementById('presetsList');
    
    if (presets.length === 0) {
        container.innerHTML = '<p style="color: #6b7280; text-align: center; padding: 20px;">No saved presets yet</p>';
        return;
    }
    
    container.innerHTML = presets.map(preset => `
        <div class="preset-item">
            <div class="preset-header">
                <div class="preset-name">${preset.name}</div>
                <div class="preset-actions">
                    <button class="load-preset-btn" onclick="loadPresetToEditor('${preset.name}')">
                        ✏️ Edit
                    </button>
                    <button class="delete-preset-btn" onclick="deletePreset('${preset.name}')">
                        🗑️ Delete
                    </button>
                </div>
            </div>
            <div class="preset-details">
                ${categories.map(cat => `
                    <div class="preset-category">
                        ${cat.icon} <strong>${preset.percentages[cat.id]}%</strong> ${cat.name}
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

// Render preset buttons for quick load
function renderPresetButtons() {
    const container = document.getElementById('presetButtons');
    
    if (presets.length === 0) {
        container.innerHTML = '<p style="color: #6b7280; font-size: 0.9em;">No presets available. Create one in the Presets tab!</p>';
        return;
    }
    
    container.innerHTML = presets.map(preset => `
        <button class="preset-btn" onclick="loadPreset('${preset.name}')">
            ${preset.name}
        </button>
    `).join('');
}
```

---

## 📊 **File 4: js/data.js**

```javascript
// Data Management Module
// Handles all data storage and retrieval

const categories = [
    { id: 'free', name: 'Free', icon: '🆓', color: '#10b981', defaultPercent: 15 },
    { id: 'mandatory', name: 'Mandatory Expense', icon: '🏠', color: '#ef4444', defaultPercent: 30 },
    { id: 'semester', name: 'Semester Pay', icon: '🎓', color: '#3b82f6', defaultPercent: 15 },
    { id: 'car', name: 'Car', icon: '🚗', color: '#f59e0b', defaultPercent: 10 },
    { id: 'lunch', name: 'Lunch', icon: '🍱', color: '#ec4899', defaultPercent: 10 },
    { id: 'investment', name: 'Investment', icon: '📈', color: '#8b5cf6', defaultPercent: 20 }
];

let monthlyData = [];
let percentages = {};

// Initialize percentages with default values
function initializePercentages() {
    categories.forEach(cat => {
        percentages[cat.id] = cat.defaultPercent;
    });
}

// Get category totals for all months
function getCategoryTotals() {
    const totals = {};
    monthlyData.forEach(month => {
        month.allocations.forEach(alloc => {
            if (!totals[alloc.category]) {
                totals[alloc.category] = { total: 0, color: alloc.color };
            }
            totals[alloc.category].total += alloc.amount;
        });
    });
    return totals;
}

// Get total income across all months
function getTotalIncome() {
    return monthlyData.reduce((sum, m) => sum + m.income, 0);
}

// Get average monthly income
function getAverageIncome() {
    return monthlyData.length > 0 ? getTotalIncome() / monthlyData.length : 0;
}

// Format currency
function formatCurrency(amount) {
    return '฿' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '                    <button class="delete-preset-btn" onclick="deletePreset('${preset.name}')">
                        ,');
}

// Add new monthly entry
function addMonthlyEntry(month, income, allocations) {
    monthlyData.push({
        month: month,
        income: income,
        allocations: allocations
    });
}

// Delete monthly entry
function deleteMonthlyEntry(index) {
    monthlyData.splice(index, 1);
}
```

---

## 📈 **File 5: js/charts.js**

```javascript
// Charts Module
// Handles all chart rendering using Chart.js

let charts = {};

// Render income trend line chart
function renderTrendChart() {
    if (charts.trend) charts.trend.destroy();
    
    const trendData = monthlyData.map(m => ({ x: m.month, y: m.income }));
    
    charts.trend = new Chart(document.getElementById('trendChart'), {
        type: 'line',
        data: {
            datasets: [{
                label: 'Income',
                data: trendData,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 3,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: { legend: { display: false } }
        }
    });
}

// Render category distribution pie chart
function renderPieChart() {
    if (charts.pie) charts.pie.destroy();
    
    const categoryTotals = getCategoryTotals();
    const labels = Object.keys(categoryTotals);
    const data = labels.map(l => categoryTotals[l].total);
    const colors = labels.map(l => categoryTotals[l].color);
    
    charts.pie = new Chart(document.getElementById('pieChart'), {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors
            }]
        },
        options: { 
            responsive: true, 
            maintainAspectRatio: true 
        }
    });
}

// Render category totals bar chart
function renderBarChart() {
    if (charts.bar) charts.bar.destroy();
    
    const categoryTotals = getCategoryTotals();
    const labels = Object.keys(categoryTotals);
    const data = labels.map(l => categoryTotals[l].total);
    const colors = labels.map(l => categoryTotals[l].color);
    
    charts.bar = new Chart(document.getElementById('barChart'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: { legend: { display: false } }
        }
    });
}

// Render all charts
function renderAllCharts() {
    renderTrendChart();
    renderPieChart();
    renderBarChart();
}
