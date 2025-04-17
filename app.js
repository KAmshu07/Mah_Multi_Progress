// DOM Elements
const eventCategoriesEl = document.getElementById('eventCategories');
const filterNameEl = document.getElementById('filterName');
const filterCategoryEl = document.getElementById('filterCategory');
const filterStatusEl = document.getElementById('filterStatus');
const filterPriorityEl = document.getElementById('filterPriority');
const filterDirectionEl = document.getElementById('filterDirection');
const exportBtnEl = document.getElementById('exportBtn');
const exportExcelBtnEl = document.getElementById('exportExcelBtn');
const importFileEl = document.getElementById('importFile');
const resetBtnEl = document.getElementById('resetBtn');
const editModalEl = document.getElementById('editModal');
const closeModalBtnEl = document.getElementById('closeModalBtn');
const editNameEl = document.getElementById('editName');
const editDirectionEl = document.getElementById('editDirection');
const editCategoryEl = document.getElementById('editCategory');
const editDescriptionEl = document.getElementById('editDescription');
const editStatusEl = document.getElementById('editStatus');
const editPriorityEl = document.getElementById('editPriority');
const editNotesEl = document.getElementById('editNotes');
const cancelEditBtnEl = document.getElementById('cancelEditBtn');
const saveEditBtnEl = document.getElementById('saveEditBtn');
const progressFillEl = document.getElementById('progressFill');
const collapseFiltersBtnEl = document.getElementById('collapseFilters');
const filtersBodyEl = document.getElementById('filtersBody');
const themeToggleBtnEl = document.getElementById('themeToggleBtn');

// Global variables
let events = [];
let filter = {
    name: '',
    category: 'all',
    status: 'all',
    priority: 'all',
    direction: 'all'
};
let categoryExpanded = {};
let editingEventId = null;
let isDarkTheme = localStorage.getItem('darkTheme') === 'true';

// Initialize
document.addEventListener('DOMContentLoaded', initialize);

function initialize() {
    // Set theme before any rendering
    if (isDarkTheme) {
        document.body.classList.add('dark-theme');
        themeToggleBtnEl.innerHTML = '<i class="fas fa-sun"></i>';
    }

    // Load data from localStorage or use initial data
    loadEvents();

    // Initialize UI
    updateStats();
    populateCategories();
    renderEvents();

    // Set up event listeners
    setupEventListeners();

    // Apply animation on load
    setTimeout(() => {
        document.querySelectorAll('.stat-card').forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 300);
}

function loadEvents() {
    const savedEvents = localStorage.getItem('mahjongEvents');
    events = savedEvents ? JSON.parse(savedEvents) : initialEvents;
}

function saveEvents() {
    localStorage.setItem('mahjongEvents', JSON.stringify(events));
}

function updateStats() {
    const stats = {
        total: events.length,
        completed: events.filter(e => e.status === 'completed').length,
        inProgress: events.filter(e => e.status === 'in-progress').length,
        notStarted: events.filter(e => e.status === 'not-started').length,
        hasBugs: events.filter(e => e.status === 'has-bugs').length
    };

    document.getElementById('statTotal').textContent = stats.total;
    document.getElementById('statCompleted').textContent = stats.completed;
    document.getElementById('statInProgress').textContent = stats.inProgress;
    document.getElementById('statNotStarted').textContent = stats.notStarted;
    document.getElementById('statHasBugs').textContent = stats.hasBugs;

    // Update progress bar
    const completionPercentage = (stats.completed / stats.total) * 100;
    progressFillEl.style.width = `${completionPercentage}%`;
}

function getUniqueCategories() {
    return [...new Set(events.map(e => e.category))];
}

function populateCategories() {
    const categories = getUniqueCategories();

    // Populate filter dropdown
    filterCategoryEl.innerHTML = '<option value="all">All Categories</option>';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        filterCategoryEl.appendChild(option);
    });

    // Populate edit modal dropdown
    editCategoryEl.innerHTML = '';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        editCategoryEl.appendChild(option);
    });

    // Initialize category expanded state
    categories.forEach(category => {
        if (categoryExpanded[category] === undefined) {
            categoryExpanded[category] = true;
        }
    });
}

function setupEventListeners() {
    // Filter inputs
    filterNameEl.addEventListener('input', handleFilterChange);
    filterCategoryEl.addEventListener('change', handleFilterChange);
    filterStatusEl.addEventListener('change', handleFilterChange);
    filterPriorityEl.addEventListener('change', handleFilterChange);
    filterDirectionEl.addEventListener('change', handleFilterChange);

    // Import/Export
    exportBtnEl.addEventListener('click', exportData);
    exportExcelBtnEl.addEventListener('click', exportToExcel);
    importFileEl.addEventListener('change', importData);
    resetBtnEl.addEventListener('click', resetData);

    // Edit modal
    closeModalBtnEl.addEventListener('click', closeEditModal);
    cancelEditBtnEl.addEventListener('click', closeEditModal);
    saveEditBtnEl.addEventListener('click', saveEditedEvent);

    // Collapse filters
    collapseFiltersBtnEl.addEventListener('click', toggleFilters);

    // Theme toggle
    themeToggleBtnEl.addEventListener('click', toggleTheme);

    // Close modal when clicking outside
    editModalEl.addEventListener('click', (e) => {
        if (e.target === editModalEl) {
            closeEditModal();
        }
    });
}

function handleFilterChange() {
    filter = {
        name: filterNameEl.value.toLowerCase(),
        category: filterCategoryEl.value,
        status: filterStatusEl.value,
        priority: filterPriorityEl.value,
        direction: filterDirectionEl.value
    };

    renderEvents();
}

function toggleCategoryExpanded(category) {
    categoryExpanded[category] = !categoryExpanded[category];

    const categoryContentEl = document.querySelector(`.category-content[data-category="${category}"]`);
    const toggleIconEl = document.querySelector(`.category-toggle[data-category="${category}"]`);

    if (categoryExpanded[category]) {
        categoryContentEl.classList.add('expanded');
        toggleIconEl.classList.add('expanded');
    } else {
        categoryContentEl.classList.remove('expanded');
        toggleIconEl.classList.remove('expanded');
    }
}

function toggleFilters() {
    filtersBodyEl.classList.toggle('collapsed');
    collapseFiltersBtnEl.innerHTML = filtersBodyEl.classList.contains('collapsed')
        ? '<i class="fas fa-chevron-down"></i>'
        : '<i class="fas fa-chevron-up"></i>';
}

function toggleTheme() {
    isDarkTheme = !isDarkTheme;
    document.body.classList.toggle('dark-theme', isDarkTheme);
    themeToggleBtnEl.innerHTML = isDarkTheme
        ? '<i class="fas fa-sun"></i>'
        : '<i class="fas fa-moon"></i>';
    localStorage.setItem('darkTheme', isDarkTheme);
}

function handleStatusChange(eventId, newStatus) {
    events = events.map(event =>
        event.id === eventId ? { ...event, status: newStatus } : event
    );

    saveEvents();
    updateStats();
    renderEvents();
}

function handlePriorityChange(eventId, newPriority) {
    events = events.map(event =>
        event.id === eventId ? { ...event, priority: newPriority } : event
    );

    saveEvents();
    renderEvents();
}

function getFilteredEvents() {
    return events.filter(event => {
        if (filter.name && !event.name.toLowerCase().includes(filter.name.toLowerCase()))
            return false;
        if (filter.category !== 'all' && event.category !== filter.category)
            return false;
        if (filter.status !== 'all' && event.status !== filter.status)
            return false;
        if (filter.priority !== 'all' && event.priority !== filter.priority)
            return false;
        if (filter.direction !== 'all' && event.direction !== filter.direction)
            return false;
        return true;
    });
}

function getSortedEvents(filteredEvents) {
    return [...filteredEvents].sort((a, b) => a.order - b.order);
}

function groupEventsByCategory(sortedEvents) {
    return sortedEvents.reduce((acc, event) => {
        if (!acc[event.category]) acc[event.category] = [];
        acc[event.category].push(event);
        return acc;
    }, {});
}

function renderEvents() {
    const filteredEvents = getFilteredEvents();
    const sortedEvents = getSortedEvents(filteredEvents);
    const eventsByCategory = groupEventsByCategory(sortedEvents);

    eventCategoriesEl.innerHTML = '';

    if (Object.keys(eventsByCategory).length === 0) {
        eventCategoriesEl.innerHTML = `
      <div class="no-results">
        <div class="no-results-icon">
          <i class="fas fa-search"></i>
        </div>
        <div class="no-results-text">
          No events match your filters
        </div>
      </div>
    `;
        return;
    }

    Object.entries(eventsByCategory).forEach(([category, categoryEvents]) => {
        const categoryElement = document.createElement('div');
        categoryElement.className = 'category-container';

        // Create category header
        const categoryHeader = document.createElement('div');
        categoryHeader.className = 'category-header';
        categoryHeader.innerHTML = `
      <div class="category-title">
        <i class="fas fa-folder"></i> ${category}
      </div>
      <div class="category-info">
        <div class="category-count">
          ${categoryEvents.length} events
        </div>
        <div class="category-toggle ${categoryExpanded[category] ? 'expanded' : ''}" data-category="${category}">
          <i class="fas fa-chevron-down"></i>
        </div>
      </div>
    `;
        categoryHeader.addEventListener('click', () => toggleCategoryExpanded(category));

        // Create category content
        const categoryContent = document.createElement('div');
        categoryContent.className = `category-content ${categoryExpanded[category] ? 'expanded' : ''}`;
        categoryContent.setAttribute('data-category', category);

        // Create events container
        const eventsContainer = document.createElement('div');
        eventsContainer.className = 'events-container';

        // Add events
        categoryEvents.forEach(event => {
            const eventCard = document.createElement('div');
            eventCard.className = `event-card status-${event.status} priority-${event.priority}`;

            eventCard.innerHTML = `
        <div class="event-header">
          <div class="event-name">${event.name}</div>
          <div class="event-direction">${event.direction}</div>
        </div>
        <div class="event-description">${event.description}</div>
        <div class="event-actions">
          <select class="event-status-select" onchange="handleStatusChange('${event.id}', this.value)">
            <option value="not-started" ${event.status === 'not-started' ? 'selected' : ''}>Not Started</option>
            <option value="in-progress" ${event.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
            <option value="completed" ${event.status === 'completed' ? 'selected' : ''}>Completed</option>
            <option value="has-bugs" ${event.status === 'has-bugs' ? 'selected' : ''}>Has Bugs</option>
          </select>
          <select class="event-priority-select" onchange="handlePriorityChange('${event.id}', this.value)">
            <option value="critical" ${event.priority === 'critical' ? 'selected' : ''}>Critical</option>
            <option value="high" ${event.priority === 'high' ? 'selected' : ''}>High</option>
            <option value="medium" ${event.priority === 'medium' ? 'selected' : ''}>Medium</option>
            <option value="low" ${event.priority === 'low' ? 'selected' : ''}>Low</option>
          </select>
          <button class="event-edit" onclick="openEditModal('${event.id}')">
            <i class="fas fa-pencil-alt"></i> Edit
          </button>
        </div>
      `;

            eventsContainer.appendChild(eventCard);
        });

        categoryContent.appendChild(eventsContainer);
        categoryElement.appendChild(categoryHeader);
        categoryElement.appendChild(categoryContent);

        eventCategoriesEl.appendChild(categoryElement);
    });
}

function openEditModal(eventId) {
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    editingEventId = eventId;

    // Populate form fields
    editNameEl.value = event.name;
    editDirectionEl.value = event.direction;
    editCategoryEl.value = event.category;
    editDescriptionEl.value = event.description;
    editStatusEl.value = event.status;
    editPriorityEl.value = event.priority;
    editNotesEl.value = event.notes || '';

    // Show modal
    editModalEl.classList.add('show');
    document.body.style.overflow = 'hidden'; // Disable scrolling
}

function closeEditModal() {
    editModalEl.classList.remove('show');
    document.body.style.overflow = ''; // Enable scrolling
    editingEventId = null;
}

function saveEditedEvent() {
    if (!editingEventId) return;

    const updatedEvent = {
        id: editingEventId,
        name: editNameEl.value,
        direction: editDirectionEl.value,
        category: editCategoryEl.value,
        description: editDescriptionEl.value,
        status: editStatusEl.value,
        priority: editPriorityEl.value,
        notes: editNotesEl.value,
        order: events.find(e => e.id === editingEventId).order
    };

    events = events.map(event =>
        event.id === editingEventId ? updatedEvent : event
    );

    saveEvents();
    updateStats();
    populateCategories();
    renderEvents();
    closeEditModal();

    // Show notification
    showNotification('Event updated successfully!');
}

function exportData() {
    const dataStr = JSON.stringify(events, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'mahjong_events.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    // Show notification
    showNotification('Exported events successfully!');
}

function importData(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            if (Array.isArray(data)) {
                events = data;
                saveEvents();
                updateStats();
                populateCategories();
                renderEvents();

                // Show notification
                showNotification(`Imported ${data.length} events successfully!`);
            }
        } catch (error) {
            showNotification('Invalid JSON file', 'error');
        }
    };
    reader.readAsText(file);
}

function resetData() {
    if (confirm("Are you sure you want to reset all data to default? This will erase your current progress.")) {
        events = [...initialEvents];
        saveEvents();
        updateStats();
        populateCategories();
        renderEvents();

        // Show notification
        showNotification('Reset to default data');
    }
}

function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
    <div class="notification-icon">
      <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'info' ? 'fa-info-circle' : 'fa-exclamation-circle'}"></i>
    </div>
    <div class="notification-message">${message}</div>
  `;

    // Add to DOM
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Remove after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

function exportToExcel() {
    try {
        // Show loading notification
        showNotification('Preparing Excel file...', 'info');

        // Organize events by category
        const eventsByCategory = events.reduce((acc, event) => {
            if (!acc[event.category]) acc[event.category] = [];
            acc[event.category].push(event);
            return acc;
        }, {});

        // Create workbook with multiple sheets
        const wb = XLSX.utils.book_new();
        wb.Props = {
            Title: "Mahjong Socket.IO Implementation Tracker",
            Author: "Socket.IO Tracker",
            CreatedDate: new Date()
        };

        // Add Summary Sheet
        addSummarySheet(wb);

        // Add All Events Sheet
        addAllEventsSheet(wb);

        // Add individual category sheets
        Object.entries(eventsByCategory).forEach(([category, categoryEvents]) => {
            addCategorySheet(wb, category, categoryEvents);
        });

        // Generate the Excel file and initiate download
        const filename = `mahjong_socket_tracker_${formatDate(new Date())}.xlsx`;
        XLSX.writeFile(wb, filename);

        // Show success notification
        showNotification('Excel file exported successfully!', 'success');
    } catch (error) {
        console.error('Error exporting to Excel:', error);
        showNotification('Error creating Excel file. See console for details.', 'error');
    }
}

/**
 * Add a summary sheet with statistics
 */
function addSummarySheet(workbook) {
    // Calculate statistics
    const stats = {
        total: events.length,
        completed: events.filter(e => e.status === 'completed').length,
        inProgress: events.filter(e => e.status === 'in-progress').length,
        notStarted: events.filter(e => e.status === 'not-started').length,
        hasBugs: events.filter(e => e.status === 'has-bugs').length
    };

    const completionPercentage = (stats.completed / stats.total * 100).toFixed(1);

    // Count events by category
    const categoryCounts = events.reduce((acc, event) => {
        acc[event.category] = (acc[event.category] || 0) + 1;
        return acc;
    }, {});

    // Count events by direction
    const directionCounts = events.reduce((acc, event) => {
        acc[event.direction] = (acc[event.direction] || 0) + 1;
        return acc;
    }, {});

    // Count events by priority
    const priorityCounts = events.reduce((acc, event) => {
        acc[event.priority] = (acc[event.priority] || 0) + 1;
        return acc;
    }, {});

    // Prepare summary data
    const summaryData = [
        ['Mahjong Socket.IO Implementation Tracker - Summary', ''],
        ['Generated on', formatDate(new Date())],
        ['', ''],
        ['Overall Progress', ''],
        ['Total Events', stats.total],
        ['Completed Events', stats.completed],
        ['Completion Percentage', `${completionPercentage}%`],
        ['In Progress Events', stats.inProgress],
        ['Not Started Events', stats.notStarted],
        ['Events with Bugs', stats.hasBugs],
        ['', ''],
        ['Events by Category', ''],
    ];

    // Add category counts
    Object.entries(categoryCounts).forEach(([category, count]) => {
        summaryData.push([category, count]);
    });

    summaryData.push(['', '']);
    summaryData.push(['Events by Direction', '']);

    // Add direction counts
    Object.entries(directionCounts).forEach(([direction, count]) => {
        summaryData.push([direction, count]);
    });

    summaryData.push(['', '']);
    summaryData.push(['Events by Priority', '']);

    // Add priority counts
    Object.entries(priorityCounts).forEach(([priority, count]) => {
        summaryData.push([priority, count]);
    });

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(summaryData);

    // Set column widths
    ws['!cols'] = [
        { wch: 30 }, // Column A
        { wch: 20 }  // Column B
    ];

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, ws, "Summary");
}

/**
 * Add a sheet with all events
 */
function addAllEventsSheet(workbook) {
    // Prepare header row
    const header = [
        'Name',
        'Category',
        'Direction',
        'Description',
        'Status',
        'Priority',
        'Order',
        'Notes'
    ];

    // Sort events by category and order
    const sortedEvents = [...events].sort((a, b) => {
        if (a.category !== b.category) {
            return a.category.localeCompare(b.category);
        }
        return a.order - b.order;
    });

    // Prepare data rows
    const rows = sortedEvents.map(event => [
        event.name,
        event.category,
        event.direction,
        event.description,
        event.status,
        event.priority,
        event.order,
        event.notes || ''
    ]);

    // Combine header and rows
    const data = [header, ...rows];

    // Create worksheet from data
    const ws = XLSX.utils.aoa_to_sheet(data);

    // Set column widths
    ws['!cols'] = [
        { wch: 25 },  // Name
        { wch: 25 },  // Category
        { wch: 15 },  // Direction
        { wch: 50 },  // Description
        { wch: 13 },  // Status
        { wch: 10 },  // Priority
        { wch: 8 },   // Order
        { wch: 30 }   // Notes
    ];

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, ws, "All Events");
}

/**
 * Add a sheet for a specific category
 */
function addCategorySheet(workbook, category, categoryEvents) {
    // Prepare header row
    const header = [
        'Name',
        'Direction',
        'Description',
        'Status',
        'Priority',
        'Order',
        'Notes'
    ];

    // Sort events by order
    const sortedEvents = [...categoryEvents].sort((a, b) => a.order - b.order);

    // Prepare data rows
    const rows = sortedEvents.map(event => [
        event.name,
        event.direction,
        event.description,
        event.status,
        event.priority,
        event.order,
        event.notes || ''
    ]);

    // Combine header and rows
    const data = [header, ...rows];

    // Create worksheet from data
    const ws = XLSX.utils.aoa_to_sheet(data);

    // Set column widths
    ws['!cols'] = [
        { wch: 25 },  // Name
        { wch: 15 },  // Direction
        { wch: 50 },  // Description
        { wch: 13 },  // Status
        { wch: 10 },  // Priority
        { wch: 8 },   // Order
        { wch: 30 }   // Notes
    ];

    // Create a safe sheet name (maximum 31 characters)
    const sheetName = category.length > 31 ? category.substring(0, 28) + '...' : category;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, ws, sheetName);
}

/**
 * Format date for filename
 */
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Advanced Excel export with formatting
 */
function exportToExcelAdvanced() {
    try {
        // Show loading notification
        showNotification('Preparing formatted Excel file...', 'info');

        // Organize events by category
        const eventsByCategory = events.reduce((acc, event) => {
            if (!acc[event.category]) acc[event.category] = [];
            acc[event.category].push(event);
            return acc;
        }, {});

        // Create workbook with multiple sheets
        const wb = XLSX.utils.book_new();
        wb.Props = {
            Title: "Mahjong Socket.IO Implementation Tracker",
            Author: "Socket.IO Tracker",
            CreatedDate: new Date()
        };

        // Add Summary Sheet
        addFormattedSummarySheet(wb);

        // Add All Events Sheet with formatting
        addFormattedAllEventsSheet(wb);

        // Add individual category sheets with formatting
        Object.entries(eventsByCategory).forEach(([category, categoryEvents]) => {
            addFormattedCategorySheet(wb, category, categoryEvents);
        });

        // Generate the Excel file and initiate download
        const filename = `mahjong_socket_tracker_${formatDate(new Date())}.xlsx`;
        XLSX.writeFile(wb, filename);

        // Show success notification
        showNotification('Formatted Excel file exported successfully!', 'success');
    } catch (error) {
        console.error('Error exporting to Excel:', error);
        showNotification('Error creating Excel file. See console for details.', 'error');
    }
}

/**
 * Add a formatted summary sheet
 */
function addFormattedSummarySheet(workbook) {
    // Calculate statistics
    const stats = {
        total: events.length,
        completed: events.filter(e => e.status === 'completed').length,
        inProgress: events.filter(e => e.status === 'in-progress').length,
        notStarted: events.filter(e => e.status === 'not-started').length,
        hasBugs: events.filter(e => e.status === 'has-bugs').length
    };

    const completionPercentage = (stats.completed / stats.total * 100).toFixed(1);

    // Count events by category
    const categoryCounts = events.reduce((acc, event) => {
        acc[event.category] = (acc[event.category] || 0) + 1;
        return acc;
    }, {});

    // Count events by direction
    const directionCounts = events.reduce((acc, event) => {
        acc[event.direction] = (acc[event.direction] || 0) + 1;
        return acc;
    }, {});

    // Count events by priority
    const priorityCounts = events.reduce((acc, event) => {
        acc[event.priority] = (acc[event.priority] || 0) + 1;
        return acc;
    }, {});

    // Convert to HTML table for better formatting in Excel
    const htmlTable = `
  <table>
    <tr><td colspan="2" style="font-size: 16pt; font-weight: bold; background-color: #7649fe; color: white;">Mahjong Socket.IO Implementation Tracker - Summary</td></tr>
    <tr><td>Generated on</td><td>${formatDate(new Date())}</td></tr>
    <tr><td colspan="2">&nbsp;</td></tr>
    <tr><td colspan="2" style="font-weight: bold; background-color: #edf2f7;">Overall Progress</td></tr>
    <tr><td>Total Events</td><td>${stats.total}</td></tr>
    <tr><td>Completed Events</td><td style="color: #22c55e; font-weight: bold;">${stats.completed}</td></tr>
    <tr><td>Completion Percentage</td><td style="font-weight: bold;">${completionPercentage}%</td></tr>
    <tr><td>In Progress Events</td><td style="color: #eab308; font-weight: bold;">${stats.inProgress}</td></tr>
    <tr><td>Not Started Events</td><td style="color: #6b7280; font-weight: bold;">${stats.notStarted}</td></tr>
    <tr><td>Events with Bugs</td><td style="color: #ef4444; font-weight: bold;">${stats.hasBugs}</td></tr>
    <tr><td colspan="2">&nbsp;</td></tr>
    <tr><td colspan="2" style="font-weight: bold; background-color: #edf2f7;">Events by Category</td></tr>
    ${Object.entries(categoryCounts).map(([category, count]) =>
        `<tr><td>${category}</td><td>${count}</td></tr>`
    ).join('')}
    <tr><td colspan="2">&nbsp;</td></tr>
    <tr><td colspan="2" style="font-weight: bold; background-color: #edf2f7;">Events by Direction</td></tr>
    ${Object.entries(directionCounts).map(([direction, count]) =>
        `<tr><td>${direction}</td><td>${count}</td></tr>`
    ).join('')}
    <tr><td colspan="2">&nbsp;</td></tr>
    <tr><td colspan="2" style="font-weight: bold; background-color: #edf2f7;">Events by Priority</td></tr>
    ${Object.entries(priorityCounts).map(([priority, count]) =>
        `<tr><td>${priority}</td><td style="color: ${getPriorityColor(priority)}; font-weight: bold;">${count}</td></tr>`
    ).join('')}
  </table>
  `;

    // Convert HTML to worksheet
    const ws = XLSX.utils.table_to_sheet(convertHTMLToElement(htmlTable));

    // Set column widths
    ws['!cols'] = [
        { wch: 30 }, // Column A
        { wch: 20 }  // Column B
    ];

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, ws, "Summary");
}

/**
 * Add a formatted sheet with all events
 */
function addFormattedAllEventsSheet(workbook) {
    // Sort events by category and order
    const sortedEvents = [...events].sort((a, b) => {
        if (a.category !== b.category) {
            return a.category.localeCompare(b.category);
        }
        return a.order - b.order;
    });

    // Create HTML table with formatting
    const htmlTable = `
  <table>
    <tr style="background-color: #7649fe; color: white; font-weight: bold;">
      <td>Name</td>
      <td>Category</td>
      <td>Direction</td>
      <td>Description</td>
      <td>Status</td>
      <td>Priority</td>
      <td>Order</td>
      <td>Notes</td>
    </tr>
    ${sortedEvents.map(event => `
      <tr style="background-color: ${getStatusBackgroundColor(event.status)}">
        <td>${event.name}</td>
        <td>${event.category}</td>
        <td>${event.direction}</td>
        <td>${event.description}</td>
        <td style="font-weight: bold; color: ${getStatusTextColor(event.status)}">${formatStatus(event.status)}</td>
        <td style="font-weight: bold; color: ${getPriorityColor(event.priority)}">${formatPriority(event.priority)}</td>
        <td>${event.order}</td>
        <td>${event.notes || ''}</td>
      </tr>
    `).join('')}
  </table>
  `;

    // Convert HTML to worksheet
    const ws = XLSX.utils.table_to_sheet(convertHTMLToElement(htmlTable));

    // Set column widths
    ws['!cols'] = [
        { wch: 25 },  // Name
        { wch: 25 },  // Category
        { wch: 15 },  // Direction
        { wch: 50 },  // Description
        { wch: 13 },  // Status
        { wch: 10 },  // Priority
        { wch: 8 },   // Order
        { wch: 30 }   // Notes
    ];

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, ws, "All Events");
}

/**
 * Add a formatted sheet for a specific category
 */
function addFormattedCategorySheet(workbook, category, categoryEvents) {
    // Sort events by order
    const sortedEvents = [...categoryEvents].sort((a, b) => a.order - b.order);

    // Create HTML table with formatting
    const htmlTable = `
  <table>
    <tr><td colspan="7" style="font-size: 14pt; font-weight: bold; background-color: #7649fe; color: white;">${category}</td></tr>
    <tr style="background-color: #9670ff; color: white; font-weight: bold;">
      <td>Name</td>
      <td>Direction</td>
      <td>Description</td>
      <td>Status</td>
      <td>Priority</td>
      <td>Order</td>
      <td>Notes</td>
    </tr>
    ${sortedEvents.map(event => `
      <tr style="background-color: ${getStatusBackgroundColor(event.status)}">
        <td>${event.name}</td>
        <td>${event.direction}</td>
        <td>${event.description}</td>
        <td style="font-weight: bold; color: ${getStatusTextColor(event.status)}">${formatStatus(event.status)}</td>
        <td style="font-weight: bold; color: ${getPriorityColor(event.priority)}">${formatPriority(event.priority)}</td>
        <td>${event.order}</td>
        <td>${event.notes || ''}</td>
      </tr>
    `).join('')}
  </table>
  `;

    // Convert HTML to worksheet
    const ws = XLSX.utils.table_to_sheet(convertHTMLToElement(htmlTable));

    // Set column widths
    ws['!cols'] = [
        { wch: 25 },  // Name
        { wch: 15 },  // Direction
        { wch: 50 },  // Description
        { wch: 13 },  // Status
        { wch: 10 },  // Priority
        { wch: 8 },   // Order
        { wch: 30 }   // Notes
    ];

    // Create a safe sheet name (maximum 31 characters)
    const sheetName = category.length > 31 ? category.substring(0, 28) + '...' : category;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, ws, sheetName);
}

/**
 * Helper function to convert HTML string to DOM element
 */
function convertHTMLToElement(html) {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content.firstChild;
}

/**
 * Get background color for status
 */
function getStatusBackgroundColor(status) {
    switch (status) {
        case 'completed': return '#dcfce7';
        case 'in-progress': return '#fef9c3';
        case 'has-bugs': return '#fee2e2';
        case 'not-started': return '#f9fafb';
        default: return '#ffffff';
    }
}

/**
 * Get text color for status
 */
function getStatusTextColor(status) {
    switch (status) {
        case 'completed': return '#16a34a';
        case 'in-progress': return '#ca8a04';
        case 'has-bugs': return '#dc2626';
        case 'not-started': return '#4f46e5';
        default: return '#000000';
    }
}

/**
 * Get color for priority
 */
function getPriorityColor(priority) {
    switch (priority) {
        case 'critical': return '#dc2626';
        case 'high': return '#ea580c';
        case 'medium': return '#2563eb';
        case 'low': return '#8b5cf6';
        default: return '#000000';
    }
}

/**
 * Format status for display
 */
function formatStatus(status) {
    switch (status) {
        case 'not-started': return 'Not Started';
        case 'in-progress': return 'In Progress';
        case 'completed': return 'Completed';
        case 'has-bugs': return 'Has Bugs';
        default: return status;
    }
}

/**
 * Format priority for display
 */
function formatPriority(priority) {
    switch (priority) {
        case 'critical': return 'Critical';
        case 'high': return 'High';
        case 'medium': return 'Medium';
        case 'low': return 'Low';
        default: return priority;
    }
}
// Make functions available globally for inline event handlers
window.exportToExcel = exportToExcelAdvanced;
window.handleStatusChange = handleStatusChange;
window.handlePriorityChange = handlePriorityChange;
window.openEditModal = openEditModal;
window.toggleCategoryExpanded = toggleCategoryExpanded;