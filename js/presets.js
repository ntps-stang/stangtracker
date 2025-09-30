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
