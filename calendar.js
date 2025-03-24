document.addEventListener('DOMContentLoaded', () => {
    const calendarDays = document.getElementById('calendarDays');
    const currentMonthElement = document.getElementById('currentMonth');
    const prevMonthButton = document.getElementById('prevMonth');
    const nextMonthButton = document.getElementById('nextMonth');

    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    // Initialize calendar
    renderCalendar();

    // Event listeners for month navigation
    prevMonthButton.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
    });

    nextMonthButton.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
    });

    function renderCalendar() {
        // Update month display
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        currentMonthElement.textContent = `${monthNames[currentMonth]} ${currentYear}`;

        // Clear previous calendar
        calendarDays.innerHTML = '';

        // Get first day of month and total days
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const totalDays = lastDay.getDate();
        const startingDay = firstDay.getDay();

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'day other-month';
            calendarDays.appendChild(emptyDay);
        }

        // Add days of the month
        for (let day = 1; day <= totalDays; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'day';
            dayElement.textContent = day;

            // Add today class if it's the current day
            if (day === currentDate.getDate() && 
                currentMonth === currentDate.getMonth() && 
                currentYear === currentDate.getFullYear()) {
                dayElement.classList.add('today');
            }

            // Check if the day has tasks
            const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const tasks = JSON.parse(localStorage.getItem(`tasks_${dateString}`) || '[]');
            if (tasks.length > 0) {
                dayElement.classList.add('has-tasks');
            }

            // Add click event to navigate to tasks page
            dayElement.addEventListener('click', () => {
                window.location.href = `tasks.html?date=${dateString}`;
            });

            calendarDays.appendChild(dayElement);
        }

        // Add empty cells for remaining days
        const remainingDays = 42 - (startingDay + totalDays); // 42 = 6 rows * 7 days
        for (let i = 0; i < remainingDays; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'day other-month';
            calendarDays.appendChild(emptyDay);
        }
    }
}); 