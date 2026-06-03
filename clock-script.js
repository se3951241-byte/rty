// List of all available time zones
const TIMEZONES = [
    // Americas
    { name: 'New York', timezone: 'America/New_York' },
    { name: 'Los Angeles', timezone: 'America/Los_Angeles' },
    { name: 'Chicago', timezone: 'America/Chicago' },
    { name: 'Denver', timezone: 'America/Denver' },
    { name: 'Toronto', timezone: 'America/Toronto' },
    { name: 'Mexico City', timezone: 'America/Mexico_City' },
    { name: 'São Paulo', timezone: 'America/Sao_Paulo' },
    { name: 'Buenos Aires', timezone: 'America/Argentina/Buenos_Aires' },
    { name: 'Lima', timezone: 'America/Lima' },
    { name: 'Anchorage', timezone: 'America/Anchorage' },
    
    // Europe
    { name: 'London', timezone: 'Europe/London' },
    { name: 'Paris', timezone: 'Europe/Paris' },
    { name: 'Berlin', timezone: 'Europe/Berlin' },
    { name: 'Rome', timezone: 'Europe/Rome' },
    { name: 'Madrid', timezone: 'Europe/Madrid' },
    { name: 'Amsterdam', timezone: 'Europe/Amsterdam' },
    { name: 'Brussels', timezone: 'Europe/Brussels' },
    { name: 'Vienna', timezone: 'Europe/Vienna' },
    { name: 'Prague', timezone: 'Europe/Prague' },
    { name: 'Istanbul', timezone: 'Europe/Istanbul' },
    { name: 'Moscow', timezone: 'Europe/Moscow' },
    
    // Asia
    { name: 'Dubai', timezone: 'Asia/Dubai' },
    { name: 'New Delhi', timezone: 'Asia/Kolkata' },
    { name: 'Bangkok', timezone: 'Asia/Bangkok' },
    { name: 'Singapore', timezone: 'Asia/Singapore' },
    { name: 'Hong Kong', timezone: 'Asia/Hong_Kong' },
    { name: 'Tokyo', timezone: 'Asia/Tokyo' },
    { name: 'Seoul', timezone: 'Asia/Seoul' },
    { name: 'Shanghai', timezone: 'Asia/Shanghai' },
    { name: 'Jakarta', timezone: 'Asia/Jakarta' },
    { name: 'Manila', timezone: 'Asia/Manila' },
    { name: 'Tehran', timezone: 'Asia/Tehran' },
    { name: 'Karachi', timezone: 'Asia/Karachi' },
    
    // Africa
    { name: 'Cairo', timezone: 'Africa/Cairo' },
    { name: 'Lagos', timezone: 'Africa/Lagos' },
    { name: 'Johannesburg', timezone: 'Africa/Johannesburg' },
    { name: 'Nairobi', timezone: 'Africa/Nairobi' },
    
    // Oceania
    { name: 'Sydney', timezone: 'Australia/Sydney' },
    { name: 'Melbourne', timezone: 'Australia/Melbourne' },
    { name: 'Perth', timezone: 'Australia/Perth' },
    { name: 'Auckland', timezone: 'Pacific/Auckland' },
    { name: 'Fiji', timezone: 'Pacific/Fiji' },
    { name: 'Honolulu', timezone: 'Pacific/Honolulu' },
];

// Selected time zones
let selectedTimezones = [];

// DOM elements
const addButton = document.getElementById('addButton');
const modal = document.getElementById('timezoneModal');
const closeButton = document.querySelector('.close');
const clocksContainer = document.getElementById('clocksContainer');
const timezoneList = document.getElementById('timezoneList');
const searchInput = document.getElementById('searchInput');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadSelectedTimezones();
    populateTimezoneList();
    updateAllClocks();
    setInterval(updateAllClocks, 1000);

    // Event listeners
    addButton.addEventListener('click', openModal);
    closeButton.addEventListener('click', closeModal);
    searchInput.addEventListener('input', filterTimezones);
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
});

// Load selected timezones from localStorage
function loadSelectedTimezones() {
    const saved = localStorage.getItem('selectedTimezones');
    if (saved) {
        selectedTimezones = JSON.parse(saved);
    } else {
        // Add default timezones on first load
        selectedTimezones = [
            { name: 'London', timezone: 'Europe/London' },
            { name: 'New York', timezone: 'America/New_York' },
            { name: 'Tokyo', timezone: 'Asia/Tokyo' },
        ];
        saveSelectedTimezones();
    }
}

// Save selected timezones to localStorage
function saveSelectedTimezones() {
    localStorage.setItem('selectedTimezones', JSON.stringify(selectedTimezones));
}

// Populate timezone list in modal
function populateTimezoneList() {
    timezoneList.innerHTML = '';
    
    const searchTerm = searchInput.value.toLowerCase();
    const filteredTimezones = TIMEZONES.filter(tz => 
        tz.name.toLowerCase().includes(searchTerm) ||
        tz.timezone.toLowerCase().includes(searchTerm)
    );

    filteredTimezones.forEach(tz => {
        const option = document.createElement('div');
        option.className = 'timezone-option';
        
        const isSelected = selectedTimezones.some(s => s.timezone === tz.timezone);
        if (isSelected) {
            option.classList.add('selected');
        }
        
        option.textContent = `${tz.name} (${tz.timezone})`;
        option.addEventListener('click', () => toggleTimezone(tz, option));
        
        timezoneList.appendChild(option);
    });
}

// Filter timezone list
function filterTimezones() {
    populateTimezoneList();
}

// Toggle timezone selection
function toggleTimezone(tz, element) {
    const index = selectedTimezones.findIndex(s => s.timezone === tz.timezone);
    
    if (index > -1) {
        selectedTimezones.splice(index, 1);
        element.classList.remove('selected');
    } else {
        selectedTimezones.push(tz);
        element.classList.add('selected');
    }
    
    saveSelectedTimezones();
    renderClocks();
}

// Open modal
function openModal() {
    modal.classList.add('show');
}

// Close modal
function closeModal() {
    modal.classList.remove('show');
    searchInput.value = '';
    populateTimezoneList();
}

// Render all clock cards
function renderClocks() {
    clocksContainer.innerHTML = '';
    
    if (selectedTimezones.length === 0) {
        clocksContainer.innerHTML = '<div class="empty-message">No time zones selected. Click "+ Add Time Zone" to get started!</div>';
        return;
    }

    selectedTimezones.forEach(tz => {
        const card = document.createElement('div');
        card.className = 'clock-card';
        card.innerHTML = `
            <div class="timezone-name">${tz.name}</div>
            <div class="city-name">${tz.timezone}</div>
            <div class="time-display" data-timezone="${tz.timezone}">--:--:--</div>
            <div class="date-display" data-timezone-date="${tz.timezone}">Loading...</div>
            <div class="offset-display" data-timezone-offset="${tz.timezone}">UTC Offset: Loading...</div>
            <button class="remove-button" onclick="removeTimezone('${tz.timezone}')">Remove</button>
        `;
        clocksContainer.appendChild(card);
    });
}

// Remove timezone
function removeTimezone(timezone) {
    selectedTimezones = selectedTimezones.filter(tz => tz.timezone !== timezone);
    saveSelectedTimezones();
    renderClocks();
    populateTimezoneList();
}

// Update all clocks
function updateAllClocks() {
    selectedTimezones.forEach(tz => {
        updateClock(tz.timezone);
    });
}

// Update individual clock
function updateClock(timezone) {
    try {
        const now = new Date();
        
        // Get the time in the specified timezone
        const options = {
            timeZone: timezone,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };
        
        const timeString = new Intl.DateTimeFormat('en-US', options).format(now);
        
        // Get the date in the specified timezone
        const dateOptions = {
            timeZone: timezone,
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        
        const dateString = new Intl.DateTimeFormat('en-US', dateOptions).format(now);
        
        // Calculate UTC offset
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        
        const parts = formatter.formatToParts(now);
        const tzDate = new Date(
            parseInt(parts.find(p => p.type === 'year').value),
            parseInt(parts.find(p => p.type === 'month').value) - 1,
            parseInt(parts.find(p => p.type === 'day').value),
            parseInt(parts.find(p => p.type === 'hour').value),
            parseInt(parts.find(p => p.type === 'minute').value),
            parseInt(parts.find(p => p.type === 'second').value)
        );
        
        const offsetMs = now - tzDate;
        const offsetHours = Math.round(offsetMs / (1000 * 60 * 60));
        const offsetSign = offsetHours >= 0 ? '+' : '';
        const offsetString = `UTC ${offsetSign}${offsetHours}:00`;
        
        // Update DOM
        const timeElement = document.querySelector(`[data-timezone="${timezone}"]`);
        const dateElement = document.querySelector(`[data-timezone-date="${timezone}"]`);
        const offsetElement = document.querySelector(`[data-timezone-offset="${timezone}"]`);
        
        if (timeElement) timeElement.textContent = timeString;
        if (dateElement) dateElement.textContent = dateString;
        if (offsetElement) offsetElement.textContent = offsetString;
        
    } catch (error) {
        console.error(`Error updating clock for ${timezone}:`, error);
    }
}

// Initial render
renderClocks();
