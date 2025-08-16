document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const emptyMessage = document.querySelector('.empty-message');

    let draggedItem = null;

    loadTasks();

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            createTaskElement(taskText);
            taskInput.value = '';
            saveTasks();
            updateEmptyMessage();
        }
    }

    function createTaskElement(text, isCompleted = false) {
        const listItem = document.createElement('li');
        listItem.classList.add('task-item');
        listItem.setAttribute('draggable', 'true');

        if (isCompleted) {
            listItem.classList.add('completed');
        }

        const taskTextSpan = document.createElement('span');
        taskTextSpan.classList.add('task-text');
        taskTextSpan.textContent = text;

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('task-buttons');

        const checkBtn = document.createElement('button');
        checkBtn.innerHTML = '<i class="fas fa-check-circle"></i>';
        checkBtn.classList.add('task-btn', 'check-btn');
        checkBtn.title = 'Yapıldı olarak işaretle';

        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteBtn.classList.add('task-btn', 'delete-btn');
        deleteBtn.title = 'Sil';

        buttonContainer.appendChild(checkBtn);
        buttonContainer.appendChild(deleteBtn);

        listItem.appendChild(taskTextSpan);
        listItem.appendChild(buttonContainer);

        checkBtn.addEventListener('click', () => {
            listItem.classList.toggle('completed');
            saveTasks();
        });

        deleteBtn.addEventListener('click', () => {
            listItem.remove();
            saveTasks();
            updateEmptyMessage();
        });

        listItem.addEventListener('dragstart', (e) => {
            draggedItem = listItem;
            setTimeout(() => {
                listItem.classList.add('dragging');
            }, 0);
            e.dataTransfer.effectAllowed = 'move';
        });

        listItem.addEventListener('dragend', () => {
            draggedItem.classList.remove('dragging');
            draggedItem = null;
            saveTasks();
        });
        
        taskList.appendChild(listItem);
    }

    taskList.addEventListener('dragover', (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(taskList, e.clientY);
        const draggable = document.querySelector('.dragging');
        if (afterElement == null) {
            taskList.appendChild(draggable);
        } else {
            taskList.insertBefore(draggable, afterElement);
        }
    });

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.task-item:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: -Infinity }).element;
    }

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    function saveTasks() {
        const tasks = [];
        document.querySelectorAll('.task-item').forEach(item => {
            tasks.push({
                text: item.querySelector('.task-text').textContent,
                completed: item.classList.contains('completed')
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        if (tasks) {
            tasks.forEach(task => {
                createTaskElement(task.text, task.completed);
            });
        }
        updateEmptyMessage();
    }
    
    function updateEmptyMessage() {
        if (taskList.children.length === 0) {
            emptyMessage.classList.remove('hidden');
        } else {
            emptyMessage.classList.add('hidden');
        }
    }
});