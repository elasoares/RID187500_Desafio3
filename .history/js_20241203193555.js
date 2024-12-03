const createTaskListItem = (tarefa) => {
    const lista = document.getElementById("todo-list");

    const toDo = document.createElement('li');
    toDo.className = `todo-item ${tarefa.checado ? 'completed' : ''}`;
    toDo.id = tarefa.id;

    // Criar o conteúdo da tarefa
    const taskDetails = document.createElement('span');
    taskDetails.className = 'task-details';
    taskDetails.innerHTML = `
        <span class="task-text ${tarefa.checado ? 'completed-text' : ''}">${tarefa.descricao}</span>
        <span class="task-label">${tarefa.etiqueta}</span>
        <span class="task-date">Criado em: ${tarefa.data}</span>

    `;


    if (!tarefa.checado) {
        const completeButton = document.createElement('button');
        completeButton.textContent = 'Concluir';
        completeButton.className = 'complete-task-btn';
        completeButton.onclick = () => markTaskAsCompleted(tarefa.id);

        toDo.appendChild(taskDetails);
        toDo.appendChild(completeButton);
    } else {
        const completedIcon = document.createElement('span');
        completedIcon.textContent = '✔';
        completedIcon.className = 'task-completed-icon';

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

    setTaskInLocalStorage(updatedTasks);

  
    const taskElement = document.getElementById(taskId);
    if (taskElement) {
        taskElement.remove();
    }
    const tarefa = updatedTasks.find((task) => task.id === taskId);
    createTaskListItem(tarefa);

    renderTaskProgressData(updatedTasks);
};

const getTasksFromLocalStorage = () => {
    const localTasks = JSON.parse(window.localStorage.getItem('tasks'));
    return localTasks ? localTasks : [];
};

const setTaskInLocalStorage = (tarefas) => {
    window.localStorage.setItem('tasks', JSON.stringify(tarefas));
};

const renderTaskProgressData = (tasks) => {
    const tasksProgress = document.getElementById('tasks-progress') || document.createElement('span');
    tasksProgress.id = 'tasks-progress';

    const doneTasks = tasks.filter(({ checado }) => checado).length;
    const totalTasks = tasks.length;

    tasksProgress.textContent = `${doneTasks} tarefa(s) concluída(s)`;
    document.getElementById('todo-footer').appendChild(tasksProgress);
};

const createTask = (event) => {
    event.preventDefault();

    const descricao = event.target.elements.descricao.value;
    const etiqueta = event.target.elements.etiqueta.value;
    const id = new Date().getTime(); 
    const data = new Date().toLocaleDateString();
    const checado = false;

    const newTask = { id, descricao, etiqueta, data, checado };

    const tarefas = getTasksFromLocalStorage();
    const updatedTasks = [...tarefas, newTask];
    setTaskInLocalStorage(updatedTasks);

    createTaskListItem(newTask);
    event.target.reset(); // Limpar o formulário
    renderTaskProgressData(updatedTasks);
};

window.onload = () => {
    const form = document.getElementById('create-todo-form');
    form.addEventListener('submit', createTask);

    const tarefas = getTasksFromLocalStorage();
    tarefas.forEach((tarefa) => createTaskListItem(tarefa));
    renderTaskProgressData(tarefas);
};
