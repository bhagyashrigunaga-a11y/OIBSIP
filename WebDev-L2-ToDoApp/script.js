const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");

const pendingTasks = document.getElementById("pendingTasks");
const completedTasks = document.getElementById("completedTasks");

const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");

const errorMessage = document.getElementById("errorMessage");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];


function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


function addTask() {
    const text = taskInput.value.trim();

    if (text === "") {
        errorMessage.textContent = "Please enter a task.";
        return;
    }

    errorMessage.textContent = "";

    const task = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toLocaleString()
    };

    tasks.push(task);

    saveTasks();
    taskInput.value = "";

    displayTasks();
}


function displayTasks() {
    pendingTasks.innerHTML = "";
    completedTasks.innerHTML = "";

    const pending = tasks.filter(task => !task.completed);
    const completed = tasks.filter(task => task.completed);

    pendingCount.textContent = `${pending.length} pending`;
    completedCount.textContent = `${completed.length} completed`;

    if (pending.length === 0) {
        pendingTasks.innerHTML =
            '<p class="empty-message">No pending tasks.</p>';
    }

    if (completed.length === 0) {
        completedTasks.innerHTML =
            '<p class="empty-message">No completed tasks.</p>';
    }

    pending.forEach(task => {
        pendingTasks.appendChild(createTaskElement(task));
    });

    completed.forEach(task => {
        completedTasks.appendChild(createTaskElement(task));
    });
}


function createTaskElement(task) {
    const taskItem = document.createElement("div");
    taskItem.className = task.completed
        ? "task-item completed"
        : "task-item";

    const taskInfo = document.createElement("div");
    taskInfo.className = "task-info";

    const taskText = document.createElement("span");
    taskText.className = "task-text";
    taskText.textContent = task.text;

    const taskTime = document.createElement("small");
    taskTime.className = "task-time";
    taskTime.textContent = `Added: ${task.createdAt}`;

    taskInfo.appendChild(taskText);
    taskInfo.appendChild(taskTime);

    const actions = document.createElement("div");
    actions.className = "task-actions";

    if (!task.completed) {
        const completeBtn = document.createElement("button");
        completeBtn.className = "complete-btn";
        completeBtn.textContent = "Complete";

        completeBtn.addEventListener("click", () => {
            task.completed = true;
            saveTasks();
            displayTasks();
        });

        actions.appendChild(completeBtn);
    }

    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn";
    editBtn.textContent = "Edit";

    editBtn.addEventListener("click", () => {
        const newText = prompt("Edit your task:", task.text);

        if (newText !== null && newText.trim() !== "") {
            task.text = newText.trim();
            saveTasks();
            displayTasks();
        }
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";

    deleteBtn.addEventListener("click", () => {
        tasks = tasks.filter(item => item.id !== task.id);
        saveTasks();
        displayTasks();
    });

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    taskItem.appendChild(taskInfo);
    taskItem.appendChild(actions);

    return taskItem;
}


addTaskBtn.addEventListener("click", addTask);


taskInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        addTask();
    }
});


displayTasks();