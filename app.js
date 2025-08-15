console.log('Content Ideas To-Do List Loaded');
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
        });
        
        taskList.appendChild(listItem);
    }

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        if (tasks) {
            tasks.forEach(task => {
                createTaskElement(task.text, task.completed);
            });
        }
    }

    

    
});