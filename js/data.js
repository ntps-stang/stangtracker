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
    return '฿' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
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
