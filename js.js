
const getTasksFromLocalStorage = () => {
    const localTasks = JSON.parse(window.localStorage.getItem('tasks'));
    return localTasks ? localTasks : [];
}


const setTaskInLocalStorage = (tarefas) => {
    window.localStorage.setItem('tasks', JSON.stringify(tarefas));
}


const removerDoneTask = () => {
    const tarefas = getTasksFromLocalStorage();
    const tasksToRemove = tarefas.filter(({checado}) => checado).map(({id}) => id);
    const updatedTasks = tarefas.filter(({checado}) => !checado);
    setTaskInLocalStorage(updatedTasks);
    
    tasksToRemove.forEach((taskId) => {
        const taskElement = document.getElementById(taskId);
        if (taskElement) {
            document.getElementById('todo-list').removeChild(taskElement);
        }
    });
}


const removeTask = (taskId) => {
    const tarefas = getTasksFromLocalStorage();
    const updatedTasks = tarefas.filter(({id}) => parseInt(id) !== parseInt(taskId));
    setTaskInLocalStorage(updatedTasks);
    const taskElement = document.getElementById(taskId);
    if (taskElement) {
        document.getElementById("todo-list").removeChild(taskElement);
    }
}


const createTaskListItem = (tarefa, checkbox) => {
    const lista = document.getElementById("todo-list");
    const toDo = document.createElement('li');
    const removerTaskButton = document.createElement('button');

    removerTaskButton.textContent = 'X';
    removerTaskButton.ariaLabel = 'Remover tarefa';
    removerTaskButton.onclick = () => removeTask(tarefa.id);

    toDo.id = tarefa.id;
    toDo.appendChild(checkbox);
    toDo.appendChild(removerTaskButton);
    lista.appendChild(toDo);
    return toDo;
}

const onCheckboxClick = (event) => {
    const [id] = event.target.id.split('-');
    const tarefas = getTasksFromLocalStorage();
    const updatedTasks = tarefas.map((tarefa) => {
        return parseInt(tarefa.id) === parseInt(id) 
            ? { ...tarefa, checado: event.target.checked } 
            : tarefa;
    });
    setTaskInLocalStorage(updatedTasks);
}


const getCheckBoxInput = ({id, descricao, checado}) => {
    const checkbox = document.createElement('input');
    const label = document.createElement('label');
    const wrapper = document.createElement('div');
    const checkboxId = `${id}-checkbox`;

    checkbox.type = 'checkbox';
    checkbox.id = checkboxId;
    checkbox.checked = checado || false;
    checkbox.addEventListener('change', onCheckboxClick);

    label.textContent = descricao;
    label.htmlFor = checkboxId;

    wrapper.className = 'checkbox-label-container';
    wrapper.appendChild(checkbox);
    wrapper.appendChild(label);
    return wrapper;
}


const getNewTaskId = () => {
    const tarefas = getTasksFromLocalStorage();
    const lastId = tarefas.length ? tarefas[tarefas.length - 1].id : 0;
    return lastId + 1;
}


const getNewTaskData = (evento) => {
    const descricao = evento.target.elements.descricao.value;
    const id = getNewTaskId();
    return { descricao, id, checado: false };
}


const createTask = (evento) => {
    evento.preventDefault();
    const newTaskData = getNewTaskData(evento);

    const checkbox = getCheckBoxInput(newTaskData);
    createTaskListItem(newTaskData, checkbox);

    const tarefas = getTasksFromLocalStorage();
    const updatedTasks = [...tarefas, newTaskData];
    setTaskInLocalStorage(updatedTasks);

    evento.target.reset();  
}


window.onload = function() {
    const form = document.getElementById('create-todo-form');
    form.addEventListener('submit', createTask);

    const tarefas = getTasksFromLocalStorage();
    tarefas.forEach((tarefa) => {
        const checkbox = getCheckBoxInput(tarefa);
        createTaskListItem(tarefa, checkbox);
    });
}
