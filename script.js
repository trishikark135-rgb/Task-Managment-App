// Get HTML elements
const addTaskBtn = document.getElementById("addTaskBtn");
const taskModal = document.getElementById("taskModal");
const closeModal = document.getElementById("closeModal");
const taskForm = document.getElementById("taskForm");

const taskId = document.getElementById("taskId");
const taskTitle = document.getElementById("taskTitle");
const taskDescription = document.getElementById("taskDescription");
const taskStatus = document.getElementById("taskStatus");
const taskPriority = document.getElementById("taskPriority");
const taskDate = document.getElementById("taskDate");

const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");
const filterStatus = document.getElementById("filterStatus");

const totalTasks = document.getElementById("totalTasks");
const todoTasks = document.getElementById("todoTasks");
const progressTasks = document.getElementById("progressTasks");
const completedTasks = document.getElementById("completedTasks");


// Load tasks from Local Storage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];


// Open Add Task Modal
addTaskBtn.addEventListener("click", () => {

    taskForm.reset();

    taskId.value = "";

    document.getElementById("modalTitle").textContent = "Add New Task";

    taskModal.style.display = "flex";
});


// Close Modal
closeModal.addEventListener("click", () => {
    taskModal.style.display = "none";
});


// Close modal when clicking outside
window.addEventListener("click", (event) => {

    if (event.target === taskModal) {
        taskModal.style.display = "none";
    }

});


// Add or Edit Task
taskForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const title = taskTitle.value.trim();
    const description = taskDescription.value.trim();
    const status = taskStatus.value;
    const priority = taskPriority.value;
    const date = taskDate.value;

    if (title === "") {
        alert("Please enter a task title.");
        return;
    }


    // Edit existing task
    if (taskId.value) {

        const index = tasks.findIndex(
            task => task.id == taskId.value
        );

        if (index !== -1) {

            tasks[index].title = title;
            tasks[index].description = description;
            tasks[index].status = status;
            tasks[index].priority = priority;
            tasks[index].date = date;

        }

    }

    // Add new task
    else {

        const newTask = {

            id: Date.now(),

            title: title,

            description: description,

            status: status,

            priority: priority,

            date: date

        };

        tasks.push(newTask);
    }


    // Save tasks
    saveTasks();

    // Close modal
    taskModal.style.display = "none";

    // Display tasks
    displayTasks();

});


// Save tasks to Local Storage
function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}


// Display Tasks
function displayTasks() {

    taskList.innerHTML = "";


    let filteredTasks = tasks.filter(task => {

        const searchText =
            searchInput.value.toLowerCase();

        const matchesSearch =
            task.title.toLowerCase().includes(searchText) ||
            task.description.toLowerCase().includes(searchText);


        const matchesFilter =
            filterStatus.value === "all" ||
            task.status === filterStatus.value;


        return matchesSearch && matchesFilter;

    });


    // No tasks
    if (filteredTasks.length === 0) {

        taskList.innerHTML = `
            <div class="task-card">
                <h3>No tasks found</h3>
                <p>Add a new task to get started.</p>
            </div>
        `;

        updateStatistics();

        return;
    }


    // Create task cards
    filteredTasks.forEach(task => {

        const taskCard = document.createElement("div");

        taskCard.className = "task-card";


        const statusText = {

            todo: "To Do",

            progress: "In Progress",

            completed: "Completed"

        };


        taskCard.innerHTML = `

            <h3>${task.title}</h3>

            <p>
                ${task.description || "No description"}
            </p>

            <div class="task-info">

                <span class="badge">
                    Status: ${statusText[task.status]}
                </span>

                <span class="badge">
                    Priority: ${task.priority}
                </span>

                ${
                    task.date
                    ? `<span class="badge">
                        Due: ${task.date}
                       </span>`
                    : ""
                }

            </div>


            <div class="task-actions">

                <button
                    class="edit-btn"
                    onclick="editTask(${task.id})"
                >
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteTask(${task.id})"
                >
                    Delete
                </button>

            </div>

        `;


        taskList.appendChild(taskCard);

    });


    updateStatistics();

}


// Edit Task
function editTask(id) {

    const task = tasks.find(
        task => task.id === id
    );

    if (!task) return;


    taskId.value = task.id;

    taskTitle.value = task.title;

    taskDescription.value = task.description;

    taskStatus.value = task.status;

    taskPriority.value = task.priority;

    taskDate.value = task.date;


    document.getElementById(
        "modalTitle"
    ).textContent = "Edit Task";


    taskModal.style.display = "flex";

}


// Delete Task
function deleteTask(id) {

    const confirmDelete =
        confirm("Are you sure you want to delete this task?");


    if (!confirmDelete) return;


    tasks = tasks.filter(
        task => task.id !== id
    );


    saveTasks();

    displayTasks();

}


// Update Statistics
function updateStatistics() {

    totalTasks.textContent =
        tasks.length;


    todoTasks.textContent =
        tasks.filter(
            task => task.status === "todo"
        ).length;


    progressTasks.textContent =
        tasks.filter(
            task => task.status === "progress"
        ).length;


    completedTasks.textContent =
        tasks.filter(
            task => task.status === "completed"
        ).length;

}


// Search
searchInput.addEventListener(
    "input",
    displayTasks
);


// Filter
filterStatus.addEventListener(
    "change",
    displayTasks
);


// Display tasks when page loads
displayTasks();