const createTaskListItem = (tarefa) => {
    const lista = document.getElementById("todo-list");

    const toDo = document.createElement("li");
    toDo.className = `todo-item ${tarefa.checado ? "completed" : ""}`;
    toDo.id = tarefa.id;

    const taskDetails = document.createElement("span");
    taskDetails.className = "task-details";
    taskDetails.innerHTML = `
        <span class="task-text ${tarefa.checado ? "completed-text" : ""}">${tarefa.descricao}</span>
        <div class="container-task-label">
            <span class="task-label">${tarefa.etiqueta}</span>
            <span class="task-date">Criado em: ${tarefa.data}</span>
        </div>
    `;

    if (!tarefa.checado) {
        const completeButton = document.createElement("button");
        completeButton.textContent = "Concluir";
        completeButton.className = "complete-task-btn";
        completeButton.onclick = () => markTaskAsCompleted(tarefa.id);

        toDo.appendChild(taskDetails);
        toDo.appendChild(completeButton);
    } else {
        const completedIcon = document.createElement("span");
        completedIcon.textContent = "✔";
        completedIcon.className = "task-completed-icon";

        toDo.appendChild(taskDetails);
        toDo.appendChild(completedIcon);
    }

    lista.appendChild(toDo);
};

const markTaskAsCompleted = (taskId) => {
    const tarefas = getTasksFromLocalStorage();
    const updatedTasks = tarefas.map((task) => {
        if (task.id === taskId) {
            task.checado = true;
        }
        return task;
    });

    setTasksInLocalStorage(updatedTasks);

    const taskElement = document.getElementById(taskId);
    if (taskElement) {
        taskElement.remove();
    }
    const tarefa = updatedTasks.find((task) => task.id === taskId);
    createTaskListItem(tarefa);

    renderTaskProgressData(updatedTasks);
};

const getTasksFromLocalStorage = () => {
    const localTasks = JSON.parse(window.localStorage.getItem("tasks"));
    return localTasks ? localTasks : [];
};

const setTasksInLocalStorage = (tarefas) => {
    window.localStorage.setItem("tasks", JSON.stringify(tarefas));
};

const renderTaskProgressData = (tasks) => {
    let tasksProgress = document.getElementById("tasks-progress");
    if (!tasksProgress) {
        tasksProgress = document.createElement("span");
        tasksProgress.id = "tasks-progress";
        document.getElementById("todo-footer").appendChild(tasksProgress);
    }

    const doneTasks = tasks.filter(({ checado }) => checado).length;
    const totalTasks = tasks.length;

    tasksProgress.textContent = `${doneTasks} tarefa concluída`;
};

const createTask = (event) => {
    event.preventDefault();

    const descricao = event.target.elements.descricao.value.trim();
    const etiqueta = event.target.elements.etiqueta.value.trim();

    if (!descricao || !etiqueta) {
        alert("Por favor, preencha todos os campos antes de adicionar uma tarefa.");
        return;
    }

    const id = new Date().getTime();
    const data = new Date().toLocaleDateString();
    const checado = false;

    const newTask = { id, descricao, etiqueta, data, checado };

    const tarefas = getTasksFromLocalStorage();
    const updatedTasks = [...tarefas, newTask];
    setTasksInLocalStorage(updatedTasks);

    createTaskListItem(newTask);
    event.target.reset();
    renderTaskProgressData(updatedTasks);
};

window.onload = () => {
    const form = document.getElementById("create-todo-form");
    form.addEventListener("submit", createTask);

    const tarefas = getTasksFromLocalStorage();
    tarefas.forEach((tarefa) => createTaskListItem(tarefa));
    renderTaskProgressData(tarefas);
};
