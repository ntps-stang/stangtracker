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
