document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const prioritySelect = document.getElementById('priority');
    const addTaskButton = document.getElementById('add-task-button');
    const taskList = document.getElementById('task-list');
    const darkModeToggle = document.getElementById('dark-mode-toggle');

    loadTasks();
    updateDarkMode();

    addTaskButton.addEventListener('click', addTask);
    darkModeToggle.addEventListener('click', toggleDarkMode);

    function addTask() {
        const taskText = taskInput.value.trim();
        const priority = prioritySelect.value;

        if (!priority) {
            alert('Please choose a priority for the task.');
            return;
        }

        if (taskText !== "") {
            const task = {
                text: taskText,
                priority: priority,
                completed: false
            };
            saveTask(task);
            renderTask(task);
            taskInput.value = '';
            prioritySelect.value = '';
        }
    }

    function renderTask(task) {
        const taskItem = document.createElement('li');
        taskItem.textContent = task.text;
        taskItem.classList.add(task.priority);
        if (task.completed) {
            taskItem.classList.add('completed');
        }

        const completeButton = document.createElement('button');
        completeButton.textContent = 'Complete';
        completeButton.classList.add('complete');
        completeButton.addEventListener('click', () => {
            task.completed = !task.completed;
            saveTasks();
            taskItem.classList.toggle('completed');
        });

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('edit');
        editButton.addEventListener('click', () => {
            const newText = prompt('Edit Task', task.text);
            if (newText !== null) {
                task.text = newText;
                saveTasks();
                taskItem.firstChild.textContent = task.text;
            }
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete');
        deleteButton.addEventListener('click', () => {
            taskList.removeChild(taskItem);
            removeTask(task);
        });

        taskItem.appendChild(completeButton);
        taskItem.appendChild(editButton);
        taskItem.appendChild(deleteButton);
        taskList.appendChild(taskItem);
    }

    function saveTask(task) {
        const tasks = getTasks();
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function saveTasks() {
        const tasks = Array.from(taskList.children).map(taskItem => {
            const task = {
                text: taskItem.firstChild.textContent,
                priority: taskItem.classList[0],
                completed: taskItem.classList.contains('completed')
            };
            return task;
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function getTasks() {
        return JSON.parse(localStorage.getItem('tasks')) || [];
    }

    function loadTasks() {
        const tasks = getTasks();
        tasks.forEach(renderTask);
    }

    function removeTask(taskToRemove) {
        const tasks = getTasks().filter(task => task.text !== taskToRemove.text);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        darkModeToggle.innerHTML = document.body.classList.contains('dark-mode') ? 'Toggle Dark Mode Off <span class="icon">☀️</span>' : 'Toggle Dark Mode On <span class="icon">🌙</span>';
        localStorage.setItem('dark-mode', document.body.classList.contains('dark-mode'));
    }

    function updateDarkMode() {
        if (localStorage.getItem('dark-mode') === 'true') {
            document.body.classList.add('dark-mode');
            darkModeToggle.innerHTML = 'Toggle Dark Mode Off <span class="icon">☀️</span>';
        } else {
            darkModeToggle.innerHTML = 'Toggle Dark Mode On <span class="icon">🌙</span>';
        }
    }
});
