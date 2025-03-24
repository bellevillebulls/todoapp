document.addEventListener('DOMContentLoaded', () => {
    const taskContainer = document.getElementById('taskContainer');
    const addTaskButton = document.getElementById('addTask');
    const backButton = document.getElementById('backButton');
    const dateDisplay = document.getElementById('dateDisplay');
    const dateHeading = document.querySelector('h1');

    // Get date from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const date = urlParams.get('date');
    
    // Set date display in both places
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    dateHeading.textContent = formattedDate;
    dateDisplay.textContent = formattedDate;

    // Add back button functionality
    backButton.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    // Load tasks from localStorage for specific date
    let tasks = JSON.parse(localStorage.getItem(`tasks_${date}`)) || [];

    // Render existing tasks
    renderTasks();

    // Add new task
    addTaskButton.addEventListener('click', () => {
        const newTask = {
            id: Date.now(),
            title: '',
            description: ''
        };
        tasks.push(newTask);
        saveTasks();
        renderTasks();
    });

    function createTaskElement(task) {
        const taskCard = document.createElement('div');
        taskCard.className = 'task-card';
        taskCard.innerHTML = `
            <div class="input-container">
                <textarea class="task-content" placeholder="What's the Job?">${task.title}</textarea>
            </div>
            <button class="mic-button large" title="Click to speak">🎤</button>
            <button class="card-delete-button">×</button>
        `;

        // Add auto-save functionality for content
        const contentInput = taskCard.querySelector('.task-content');
        contentInput.addEventListener('input', () => {
            task.title = contentInput.value;
            saveTasks();
        });

        // Setup speech recognition for large mic button
        const largeMicButton = taskCard.querySelector('.mic-button.large');
        largeMicButton.addEventListener('click', () => {
            if ('webkitSpeechRecognition' in window) {
                const recognition = new webkitSpeechRecognition();
                recognition.lang = 'en-US';
                recognition.continuous = false;
                recognition.interimResults = false;
                recognition.onresult = (event) => {
                    contentInput.value = event.results[0][0].transcript;
                    contentInput.dispatchEvent(new Event('input'));
                };
                largeMicButton.classList.add('recording');
                largeMicButton.innerHTML = '⏺';
                recognition.start();
                recognition.onend = () => {
                    setTimeout(() => {
                        largeMicButton.classList.remove('recording');
                        largeMicButton.innerHTML = '🎤';
                    }, 5000); // Wait 5 seconds after speech ends
                };
            } else {
                alert('Speech recognition is not supported in your browser. Please use Chrome or Safari.');
            }
        });

        // Add touch feedback for mobile
        largeMicButton.addEventListener('touchstart', () => {
            largeMicButton.style.transform = 'scale(0.95)';
        });

        largeMicButton.addEventListener('touchend', () => {
            largeMicButton.style.transform = 'scale(1)';
        });

        // Prevent default touch behavior
        largeMicButton.addEventListener('touchmove', (e) => {
            e.preventDefault();
        }, { passive: false });

        // Add delete functionality
        const deleteButton = taskCard.querySelector('.card-delete-button');
        deleteButton.addEventListener('click', () => {
            tasks = tasks.filter(t => t.id !== task.id);
            saveTasks();
            renderTasks();
        });

        return taskCard;
    }

    function renderTasks() {
        taskContainer.innerHTML = '';
        tasks.forEach(task => {
            taskContainer.appendChild(createTaskElement(task));
        });
    }

    function saveTasks() {
        localStorage.setItem(`tasks_${date}`, JSON.stringify(tasks));
    }
}); 