// ============================================
// CALENDARI D'ACTIVITATS - WILD FITNESS
// Activity Management System
// ============================================

// Activity Storage Key
const STORAGE_KEY = 'wild_fitness_activities';

// Activity Type Icons and Labels
const ACTIVITY_TYPES = {
    trail: { icon: '🏃', label: 'Trail Running' },
    trekking: { icon: '⛰️', label: 'Trekking' },
    training: { icon: '💪', label: 'Entrenament' },
    yoga: { icon: '🧘', label: 'Yoga' },
    workshop: { icon: '🎯', label: 'Workshop' }
};

// State Management
let activities = [];
let currentFilter = 'all';

// ============================================
// Initialize Calendar
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('📅 Initializing Calendar...');
    
    // Load activities from localStorage
    loadActivities();
    
    // Initialize event listeners
    initEventListeners();
    
    // Render activities
    renderActivities();
    
    // Set minimum date to today
    const dateInput = document.getElementById('activityDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }
});

// ============================================
// Event Listeners
// ============================================
function initEventListeners() {
    // Admin panel toggle
    const toggleAdminBtn = document.getElementById('toggleAdminBtn');
    const closeAdminBtn = document.getElementById('closeAdminBtn');
    const cancelFormBtn = document.getElementById('cancelFormBtn');
    const adminPanel = document.getElementById('adminPanel');
    
    if (toggleAdminBtn) {
        toggleAdminBtn.addEventListener('click', () => {
            adminPanel.style.display = adminPanel.style.display === 'none' ? 'block' : 'none';
            if (adminPanel.style.display === 'block') {
                adminPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }
    
    if (closeAdminBtn) {
        closeAdminBtn.addEventListener('click', () => {
            adminPanel.style.display = 'none';
        });
    }
    
    if (cancelFormBtn) {
        cancelFormBtn.addEventListener('click', () => {
            adminPanel.style.display = 'none';
            document.getElementById('activityForm').reset();
        });
    }
    
    // Activity form submission
    const activityForm = document.getElementById('activityForm');
    if (activityForm) {
        activityForm.addEventListener('submit', handleActivitySubmit);
    }
    
    // Filter tabs
    const filterTabs = document.querySelectorAll('.filter-tab');
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentFilter = tab.dataset.filter;
            renderActivities();
        });
    });
    
    // Modal close
    const closeModalBtn = document.getElementById('closeModalBtn');
    const bookingModal = document.getElementById('bookingModal');
    
    if (closeModalBtn && bookingModal) {
        closeModalBtn.addEventListener('click', () => {
            bookingModal.classList.remove('active');
        });
        
        bookingModal.addEventListener('click', (e) => {
            if (e.target === bookingModal) {
                bookingModal.classList.remove('active');
            }
        });
    }
}

// ============================================
// Activity Management
// ============================================
function loadActivities() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        activities = stored ? JSON.parse(stored) : getSampleActivities();
        console.log('✅ Activities loaded:', activities.length);
    } catch (error) {
        console.error('❌ Error loading activities:', error);
        activities = getSampleActivities();
    }
}

function saveActivities() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
        console.log('💾 Activities saved');
    } catch (error) {
        console.error('❌ Error saving activities:', error);
    }
}

function getSampleActivities() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    return [
        {
            id: Date.now() + 1,
            title: 'Trail Running Matinal - Parc Natural Cadí-Moixeró',
            type: 'trail',
            date: tomorrow.toISOString().split('T')[0],
            time: '08:00',
            location: 'Bagà - Parc Natural Cadí-Moixeró',
            latitude: '42.304482',
            longitude: '1.863868',
            capacity: 12,
            enrolled: 7,
            description: 'Sortida matinal de trail running per camins del Parc Natural. Nivell intermedi-avançat. Distància aproximada: 15km amb 600m de desnivell positiu. Porteu aigua, esmorzar lleuger i calçat adequat.',
            participants: []
        },
        {
            id: Date.now() + 2,
            title: 'Trekking Pirineus - Vall de Núria',
            type: 'trekking',
            date: nextWeek.toISOString().split('T')[0],
            time: '09:00',
            location: 'Estació de Núria, Girona',
            latitude: '42.405833',
            longitude: '2.161944',
            capacity: 15,
            enrolled: 10,
            description: 'Excursió guiada per la Vall de Núria. Sortida des de l\'estació fins al Pic de Finestrelles. Nivell mitjà. Porteu menjar per tot el dia, protecció solar i roba d\'abric.',
            participants: []
        },
        {
            id: Date.now() + 3,
            title: 'Sessió d\'Entrenament Funcional',
            type: 'training',
            date: tomorrow.toISOString().split('T')[0],
            time: '18:30',
            location: 'Parc de la Devesa, Girona',
            latitude: '41.993611',
            longitude: '2.826667',
            capacity: 10,
            enrolled: 5,
            description: 'Entrenament funcional orientat a trail runners. Treballarem força, potència i mobilitat. Material proporcionat. Durada: 60 minuts.',
            participants: []
        }
    ];
}

function handleActivitySubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const activity = {
        id: Date.now(),
        title: formData.get('title'),
        type: formData.get('type'),
        date: formData.get('date'),
        time: formData.get('time'),
        location: formData.get('location'),
        latitude: formData.get('latitude') || '',
        longitude: formData.get('longitude') || '',
        capacity: parseInt(formData.get('capacity')),
        enrolled: 0,
        description: formData.get('description') || '',
        participants: []
    };
    
    activities.push(activity);
    activities.sort((a, b) => new Date(a.date) - new Date(b.date));
    saveActivities();
    renderActivities();
    
    // Reset form and hide admin panel
    e.target.reset();
    document.getElementById('adminPanel').style.display = 'none';
    
    // Show success message
    alert('✅ Activitat creada correctament!');
}

function deleteActivity(id) {
    if (confirm('Segur que vols eliminar aquesta activitat?')) {
        activities = activities.filter(a => a.id !== id);
        saveActivities();
        renderActivities();
    }
}

// ============================================
// Rendering
// ============================================
function renderActivities() {
    const container = document.getElementById('activitiesList');
    if (!container) return;
    
    // Filter activities
    let filtered = activities;
    if (currentFilter !== 'all') {
        filtered = activities.filter(a => a.type === currentFilter);
    }
    
    // Filter only future activities
    const today = new Date().toISOString().split('T')[0];
    filtered = filtered.filter(a => a.date >= today);
    
    // Sort by date
    filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Render
    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📅</div>
                <h3>No hi ha activitats ${currentFilter !== 'all' ? 'per aquest tipus' : 'programades'}</h3>
                <p>De moment no hi ha cap activitat al calendari. Torna aviat per veure les pròximes sortides!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filtered.map(activity => createActivityCard(activity)).join('');
    
    // Add event listeners to booking buttons
    container.querySelectorAll('.btn-book').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.closest('[data-id]').dataset.id);
            openBookingModal(id);
        });
    });
    
    // Add event listeners to delete buttons
    container.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.closest('[data-id]').dataset.id);
            deleteActivity(id);
        });
    });
    
    // Add event listeners to map buttons
    container.querySelectorAll('.btn-map').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.closest('[data-id]').dataset.id);
            const activity = activities.find(a => a.id === id);
            if (activity && activity.latitude && activity.longitude) {
                window.open(`https://www.google.com/maps?q=${activity.latitude},${activity.longitude}`, '_blank');
            }
        });
    });
}

function createActivityCard(activity) {
    const typeInfo = ACTIVITY_TYPES[activity.type];
    const date = new Date(activity.date + 'T00:00:00');
    const formattedDate = date.toLocaleDateString('ca-ES', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    const capacityPercent = (activity.enrolled / activity.capacity) * 100;
    let capacityClass = '';
    if (capacityPercent >= 90) capacityClass = 'full';
    else if (capacityPercent >= 70) capacityClass = 'medium';
    
    const isFull = activity.enrolled >= activity.capacity;
    
    return `
        <div class="activity-card" data-id="${activity.id}">
            <div class="activity-header">
                <div class="activity-type-badge">
                    ${typeInfo.icon} ${typeInfo.label}
                </div>
                <h3 class="activity-title">${activity.title}</h3>
            </div>
            
            <div class="activity-body">
                <div class="activity-info">
                    <div class="activity-info-item">
                        <span class="info-icon">📅</span>
                        <div class="info-content">
                            <span class="info-label">Data</span>
                            <span class="info-value">${formattedDate}</span>
                        </div>
                    </div>
                    
                    <div class="activity-info-item">
                        <span class="info-icon">⏰</span>
                        <div class="info-content">
                            <span class="info-label">Hora</span>
                            <span class="info-value">${activity.time}</span>
                        </div>
                    </div>
                    
                    <div class="activity-info-item">
                        <span class="info-icon">📍</span>
                        <div class="info-content">
                            <span class="info-label">Lloc</span>
                            <span class="info-value">${activity.location}</span>
                        </div>
                    </div>
                </div>
                
                ${activity.description ? `
                    <div class="activity-description">
                        ${activity.description}
                    </div>
                ` : ''}
                
                <div class="capacity-indicator">
                    <div class="capacity-bar">
                        <div class="capacity-fill ${capacityClass}" style="width: ${capacityPercent}%"></div>
                    </div>
                    <span class="capacity-text">${activity.enrolled}/${activity.capacity}</span>
                </div>
            </div>
            
            <div class="activity-footer">
                <button class="btn-book" ${isFull ? 'disabled' : ''}>
                    <span>${isFull ? '❌ Complet' : '✓ Reservar plaça'}</span>
                </button>
                ${activity.latitude && activity.longitude ? `
                    <button class="btn-map" title="Veure mapa">
                        <span>🗺️</span>
                    </button>
                ` : ''}
                <button class="btn-delete" title="Eliminar activitat">
                    <span>🗑️</span>
                </button>
            </div>
        </div>
    `;
}

// ============================================
// Booking System
// ============================================
function openBookingModal(activityId) {
    const activity = activities.find(a => a.id === activityId);
    if (!activity) return;
    
    const modal = document.getElementById('bookingModal');
    const modalBody = document.getElementById('modalBody');
    
    const typeInfo = ACTIVITY_TYPES[activity.type];
    const date = new Date(activity.date + 'T00:00:00');
    const formattedDate = date.toLocaleDateString('ca-ES', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    modalBody.innerHTML = `
        <div class="booking-summary">
            <h3>Resum de l'activitat</h3>
            <div class="booking-summary-item">
                <strong>${typeInfo.icon} ${typeInfo.label}:</strong> ${activity.title}
            </div>
            <div class="booking-summary-item">
                <strong>📅 Data:</strong> ${formattedDate}
            </div>
            <div class="booking-summary-item">
                <strong>⏰ Hora:</strong> ${activity.time}
            </div>
            <div class="booking-summary-item">
                <strong>📍 Lloc:</strong> ${activity.location}
            </div>
            <div class="booking-summary-item">
                <strong>👥 Places disponibles:</strong> ${activity.capacity - activity.enrolled}/${activity.capacity}
            </div>
        </div>
        
        <form id="bookingForm" class="booking-form">
            <div class="form-group">
                <label for="participantName">
                    <span class="label-icon">👤</span>
                    <span>Nom complet</span>
                    <span class="required">*</span>
                </label>
                <input type="text" id="participantName" name="name" required placeholder="El teu nom">
            </div>
            
            <div class="form-group">
                <label for="participantEmail">
                    <span class="label-icon">📧</span>
                    <span>Email</span>
                    <span class="required">*</span>
                </label>
                <input type="email" id="participantEmail" name="email" required placeholder="el.teu.email@exemple.com">
            </div>
            
            <div class="form-group">
                <label for="participantPhone">
                    <span class="label-icon">📱</span>
                    <span>Telèfon</span>
                    <span class="required">*</span>
                </label>
                <input type="tel" id="participantPhone" name="phone" required placeholder="+34 600 000 000">
            </div>
            
            <div class="form-group">
                <label for="participantNotes">
                    <span class="label-icon">📝</span>
                    <span>Comentaris o necessitats especials</span>
                </label>
                <textarea id="participantNotes" name="notes" rows="3" placeholder="Algun comentari que vulguis compartir..."></textarea>
            </div>
            
            <button type="submit" class="btn-submit">
                <span class="btn-icon">✓</span>
                <span>Confirmar Reserva</span>
            </button>
        </form>
    `;
    
    modal.classList.add('active');
    
    // Handle booking form submission
    const bookingForm = modalBody.querySelector('#bookingForm');
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleBookingSubmit(e, activityId);
    });
}

function handleBookingSubmit(e, activityId) {
    e.preventDefault();
    
    const activity = activities.find(a => a.id === activityId);
    if (!activity) return;
    
    const formData = new FormData(e.target);
    const participant = {
        id: Date.now(),
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        notes: formData.get('notes') || '',
        bookedAt: new Date().toISOString()
    };
    
    // Add participant to activity
    if (!activity.participants) activity.participants = [];
    activity.participants.push(participant);
    activity.enrolled = activity.participants.length;
    
    saveActivities();
    renderActivities();
    
    // Show success message
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <div class="booking-success">
            <div class="success-icon">✅</div>
            <h3>Reserva confirmada!</h3>
            <p>Hem registrat la teva plaça per a aquesta activitat.</p>
            <p>Rebràs un email de confirmació a <strong>${participant.email}</strong></p>
            <button class="btn-submit" onclick="document.getElementById('bookingModal').classList.remove('active')">
                Tancar
            </button>
        </div>
    `;
}

console.log('✅ Calendar JavaScript loaded');
