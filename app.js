// Application state
let currentSection = 'accueil';
let charts = {};

// Data from the JSON
const financialData = [
    {year: 2024, revenue: 160000, margin: 55, ebitda: 12000, employees: 5},
    {year: 2025, revenue: 250000, margin: 60, ebitda: 30000, employees: 7},
    {year: 2026, revenue: 450000, margin: 65, ebitda: 95000, employees: 12},
    {year: 2027, revenue: 750000, margin: 68, ebitda: 190000, employees: 18}
];

const fundingBreakdown = [
    {category: "Matériel studio vidéo", amount: 80000, percentage: 17.6},
    {category: "Logiciels et licences", amount: 25000, percentage: 5.5},
    {category: "Aménagement studio", amount: 40000, percentage: 8.8},
    {category: "Recrutement équipe", amount: 150000, percentage: 33.0},
    {category: "Marketing & commercial", amount: 60000, percentage: 13.2},
    {category: "Fonds de roulement", amount: 100000, percentage: 22.0}
];

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app...');
    initializeNavigation();
    updateProgressBar();
    
    // Initialize sidebar toggle for mobile
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('open');
        });
    }
    
    // Close sidebar when clicking on main content on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 1024 && !sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    });
    
    // Initialize charts after a short delay to ensure DOM is ready
    setTimeout(() => {
        initializeCharts();
    }, 500);
});

// Navigation functionality
function initializeNavigation() {
    console.log('Initializing navigation...');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    console.log('Found nav links:', navLinks.length);
    console.log('Found sections:', sections.length);
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('data-section');
            console.log('Navigating to:', targetSection);
            navigateToSection(targetSection);
        });
    });
    
    // Initialize first section
    navigateToSection('accueil');
}

function navigateToSection(sectionId) {
    console.log('Navigating to section:', sectionId);
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Hide all sections
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all nav links
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = sectionId;
        updateProgressBar();
        
        // Add active class to corresponding nav link
        const activeLink = document.querySelector(`[data-section="${sectionId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
        
        // Close sidebar on mobile after navigation
        if (window.innerWidth <= 1024) {
            const sidebar = document.getElementById('sidebar');
            if (sidebar) {
                sidebar.classList.remove('open');
            }
        }
        
        // Trigger chart animations if we're on the projections or funding sections
        if (sectionId === 'projections') {
            setTimeout(() => {
                if (!charts.revenue) {
                    initializeRevenueChart();
                }
                animateRevenueChart();
            }, 300);
        } else if (sectionId === 'financement') {
            setTimeout(() => {
                if (!charts.funding) {
                    initializeFundingChart();
                }
                animateFundingChart();
            }, 300);
        }
    }
}

function scrollToSection(sectionId) {
    navigateToSection(sectionId);
}

// Progress bar functionality
function updateProgressBar() {
    const sections = ['accueil', 'synthese', 'marche', 'proposition', 'modele', 'projections', 'equipe', 'financement', 'sortie', 'contact'];
    const currentIndex = sections.indexOf(currentSection);
    const progress = ((currentIndex + 1) / sections.length) * 100;
    
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }
}

// Chart initialization
function initializeCharts() {
    console.log('Initializing charts...');
    // We'll initialize charts when sections are visited to avoid issues
}

function initializeRevenueChart() {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) {
        console.log('Revenue chart canvas not found');
        return;
    }
    
    console.log('Initializing revenue chart...');
    
    // Destroy existing chart if any
    if (charts.revenue) {
        charts.revenue.destroy();
    }
    
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: financialData.map(d => d.year.toString()),
            datasets: [
                {
                    label: 'Chiffre d\'affaires (€)',
                    data: financialData.map(d => d.revenue),
                    backgroundColor: '#1FB8CD',
                    borderColor: '#21808D',
                    borderWidth: 2,
                    borderRadius: 6,
                    borderSkipped: false,
                },
                {
                    label: 'EBITDA (€)',
                    data: financialData.map(d => d.ebitda),
                    backgroundColor: '#FFC185',
                    borderColor: '#FF9F47',
                    borderWidth: 2,
                    borderRadius: 6,
                    borderSkipped: false,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return new Intl.NumberFormat('fr-FR', {
                                style: 'currency',
                                currency: 'EUR',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                            }).format(value);
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + 
                                   new Intl.NumberFormat('fr-FR', {
                                       style: 'currency',
                                       currency: 'EUR',
                                       minimumFractionDigits: 0,
                                       maximumFractionDigits: 0
                                   }).format(context.parsed.y);
                        }
                    }
                }
            },
            animation: {
                duration: 1500
            }
        }
    });
    
    charts.revenue = chart;
    console.log('Revenue chart initialized');
}

function initializeFundingChart() {
    const ctx = document.getElementById('fundingChart');
    if (!ctx) {
        console.log('Funding chart canvas not found');
        return;
    }
    
    console.log('Initializing funding chart...');
    
    // Destroy existing chart if any
    if (charts.funding) {
        charts.funding.destroy();
    }
    
    const colors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545'];
    
    const chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: fundingBreakdown.map(item => item.category),
            datasets: [{
                data: fundingBreakdown.map(item => item.amount),
                backgroundColor: colors,
                borderColor: colors.map(color => color + '80'),
                borderWidth: 2,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const item = fundingBreakdown[context.dataIndex];
                            return `${item.category}: ${new Intl.NumberFormat('fr-FR', {
                                style: 'currency',
                                currency: 'EUR',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                            }).format(item.amount)} (${item.percentage}%)`;
                        }
                    }
                }
            },
            animation: {
                duration: 1500
            }
        }
    });
    
    charts.funding = chart;
    console.log('Funding chart initialized');
}

// Chart animations
function animateRevenueChart() {
    if (charts.revenue) {
        charts.revenue.update('active');
    }
}

function animateFundingChart() {
    if (charts.funding) {
        charts.funding.update('active');
    }
}

// ROI Calculator
function calculateROI() {
    const investmentInput = document.getElementById('investmentAmount');
    const resultDiv = document.getElementById('roiResult');
    
    if (!investmentInput || !resultDiv) return;
    
    const investment = parseFloat(investmentInput.value) || 0;
    
    if (investment <= 0) {
        resultDiv.innerHTML = '<p style="color: var(--color-error);">Veuillez saisir un montant d\'investissement valide.</p>';
        return;
    }
    
    // Calculate ownership percentage
    const preMoney = 500000; // 500k€ pre-money valuation
    const totalFunding = 455000; // 455k€ funding requested
    const postMoney = preMoney + totalFunding;
    const ownershipPercent = (investment / totalFunding) * (totalFunding / postMoney) * 100;
    
    // Calculate potential returns based on exit strategy (6-8x EBITDA)
    const ebitda2027 = 190000; // 190k€ EBITDA in 2027
    const exitMultipleLow = 6;
    const exitMultipleHigh = 8;
    const exitValueLow = ebitda2027 * exitMultipleLow;
    const exitValueHigh = ebitda2027 * exitMultipleHigh;
    
    const returnLow = (exitValueLow * ownershipPercent / 100);
    const returnHigh = (exitValueHigh * ownershipPercent / 100);
    const roiLow = ((returnLow - investment) / investment) * 100;
    const roiHigh = ((returnHigh - investment) / investment) * 100;
    
    resultDiv.innerHTML = `
        <div style="background: var(--color-surface); padding: var(--space-16); border-radius: var(--radius-base); border: 1px solid var(--color-border);">
            <h4 style="color: var(--color-primary); margin-bottom: var(--space-12);">Simulation ROI</h4>
            <p><strong>Participation:</strong> ${ownershipPercent.toFixed(2)}% de CINEMX</p>
            <p><strong>Valorisation de sortie estimée:</strong> ${formatCurrency(exitValueLow)} - ${formatCurrency(exitValueHigh)}</p>
            <p><strong>Retour sur investissement:</strong> ${formatCurrency(returnLow)} - ${formatCurrency(returnHigh)}</p>
            <p style="color: var(--color-success); font-weight: var(--font-weight-bold);">
                <strong>ROI potentiel:</strong> ${roiLow.toFixed(0)}% - ${roiHigh.toFixed(0)}%
            </p>
            <p style="font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-top: var(--space-12);">
                * Simulation basée sur la stratégie de sortie 5-7 ans avec multiple 6-8x EBITDA
            </p>
        </div>
    `;
}

// PDF Download simulation
function downloadPDF() {
    // Show feedback to user
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = '📄 Téléchargement simulé...';
    button.disabled = true;
    
    setTimeout(() => {
        button.textContent = '✅ Dossier téléchargé';
        setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
        }, 2000);
    }, 1000);
}

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    const sections = ['accueil', 'synthese', 'marche', 'proposition', 'modele', 'projections', 'equipe', 'financement', 'sortie', 'contact'];
    const currentIndex = sections.indexOf(currentSection);
    
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        if (currentIndex < sections.length - 1) {
            navigateToSection(sections[currentIndex + 1]);
        }
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        if (currentIndex > 0) {
            navigateToSection(sections[currentIndex - 1]);
        }
    }
});

// Window resize handler
window.addEventListener('resize', function() {
    // Close sidebar on desktop
    if (window.innerWidth > 1024) {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.remove('open');
        }
    }
    
    // Resize charts
    Object.values(charts).forEach(chart => {
        if (chart) {
            chart.resize();
        }
    });
});

// Global functions to be accessible from HTML
window.scrollToSection = scrollToSection;
window.calculateROI = calculateROI;
window.downloadPDF = downloadPDF;

// Add some debugging
window.navigateToSection = navigateToSection;

console.log('App.js loaded successfully');