const model = {
    todoList:[],
    checkedAll: false,
    currentEditingTask: []
}

const saveTodos = () => {
    const str = JSON.stringify(model.todoList);
    localStorage.setItem('todoList', str);
}

const getTodos = () => {
    const str = localStorage.getItem('todoList');
    model.todoList = JSON.parse(str);
    if (!model.todoList) {
        model.todoList = [];
    } 
}

const getListContainer = () => {
    return document.querySelector('.list-container');
};

const createTaskNode = (value, checked, id) => {
    const li = document.createElement('li');
    li.id = id;

    const span = document.createElement('span');
    span.innerHTML = value;
    if (checked) {
        span.className = 'checked';
    }
    span.classList.add('showInitialInput')
    span.classList.add('hideInitialInput')
    

    const checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.checked = checked;
    checkbox.className = 'checkbox';

    const pencil = document.createElement('div');
    pencil.classList.add('editPencil');
    // pencil.classList.add('hidePencil');
    pencil.innerHTML = '&#9998;'

    const deleteDiv = document.createElement('div');
    deleteDiv.classList.add('deleteIcon');
    // deleteDiv.classList.add('hideDelete');
    deleteDiv.innerHTML = '&#10005;';

    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.classList.add('editInput');
    // editInput.classList.add('hideInput');

    const markDiv = document.createElement('div');
    markDiv.className = 'saveMark';
    markDiv.innerHTML = '&#10003;';
    // markDiv.className = 'hide';


    li.append(checkbox);
    li.append(span);
    li.append(editInput);
    li.append(pencil);
    li.append(deleteDiv);
    li.append(markDiv);

    return li;
}

const updateView = () =>{
    const listContainer = getListContainer();
    const {todoList} = model;

    listContainer.innerHTML = '';
    
    const lists = (list) => {
        const taskList = createTaskNode(list.value, list.checked, list.id);
        listContainer.append(taskList);
    }

    todoList.forEach(lists);
}

const addNewTaskHandler = () => {
    const textInput = document.querySelector('.text-input');
    const {value} = textInput;

    const newTask = {
        checked: false,
        value,
        id: new Date().toISOString()
    }

    model.todoList.push(newTask);
    textInput.value = ''; //Once the task added, leave the input field blank
   
    countTaskToggler();
    saveTodos();
    updateView();
}

const clearAllHandler = () => {
    model.todoList = [];
    countTaskToggler();
    saveTodos();
    updateView();
}


const countTaskToggler = () => {
    const countingNumber = document.querySelector('.countingNumber');
    countingNumber.textContent = model.todoList.length;
};


const enterKeyToggler = (e) => {
    if (e.key === 'Enter') {
        addNewTaskHandler();
    }
}

const completedTaskToggler = () => {
    getTodos();
    const completedTask = [];
    for (let i = 0; i < model.todoList.length; i ++) {
        if (model.todoList[i].checked === true) {
                const completedTaskList = {...model.todoList[i]}; 
                completedTask.push(completedTaskList);
        }    
    } 
    model.todoList = completedTask;
    updateView();
}

const activeTaskToggler = () => {
    getTodos();
    const activeTask = [];
    for (let i = 0; i < model.todoList.length; i ++) {
        if (model.todoList[i].checked === false) {
                const activeTaskList = {...model.todoList[i]}; 
                activeTask.push(activeTaskList);
        }    
    } 
    model.todoList = activeTask;
    updateView();
}

const allTaskToggler = () => {
    getTodos();
    updateView();
}

const statusCheckToggler = () => {
    const statusAll = document.querySelector('.statusAll');
    const statusActive = document.querySelector('.statusActive');
    const statusCompleted = document.querySelector('.statusCompleted');

    statusCompleted.addEventListener('click', completedTaskToggler);
    statusActive.addEventListener('click', activeTaskToggler);
    statusAll.addEventListener('click', allTaskToggler);    
}

const selectAllIconToggler =  () => {
    model.checkedAll = model.checkedAll ? false : true;
    const selectAllTask = [];
    for (let i = 0; i < model.todoList.length; i ++) {
        task = model.todoList[i]
        if (model.checkedAll) {
            task = {...model.todoList[i], checked: true};
        } else {
            task = {...model.todoList[i], checked: false};
        }
        selectAllTask.push(task);
    }

    model.todoList = selectAllTask;
    updateView();
}


const taskCheckedToggler = (id) => {
    const checkedOrNot = (task) => {
        if (task.id === id) {
            return {
                ...task,
                checked:!task.checked
            }
        } else {
            return task;
        }
    }
    const taskList = model.todoList.map(checkedOrNot);

    model.todoList = taskList;
    saveTodos();
    updateView();
}

const deleteTask = (id) => {
    const leftedTask = model.todoList.filter((task) => {
        return task.id !== id;
    });

    model.todoList = leftedTask;

    countTaskToggler();
    saveTodos();
    updateView();
}

const pencilEditToggler = (id) => {
    const initialInput = document.querySelector('.showInitialInput')
    const editInput = document.querySelector('.editInput');
    const saveMark = document.querySelector('.saveMark');
    const deleteIcon = document.querySelector('.deleteIcon');
    const editPencil = document.querySelector('.editPencil');


    model.todoList.filter(() => {
        for ( let j = 0 ; j < model.todoList.length; j ++){
            if (model.todoList[j].id === id) {
                initialInput.style.display = 'none';
                editPencil.style.display = 'none';
                deleteIcon.style.display = 'none';
                editInput.style.display = 'block';
                saveMark.style.display = 'block';
                
                const {value} = editInput;
                model.currentEditingTask.id = model.todoList[j].id;
                const newTask = {
                        checked: false,
                        value,
                        id: new Date().toISOString()
                    }
                
                model.currentEditingTask.push(newTask);
        }
        

            saveMark.addEventListener('click', () =>{
                model.currentEditingTask.value = editInput.value;
                for (let i = 0; i < model.todoList.length; i ++) {
                    if (model.todoList[i].id === model.currentEditingTask.id){
                        model.todoList[i].value = model.currentEditingTask.value;
                        
                        saveTodos();
                        initialInput.value = model.todoList[i].value;   
                    }
                }
                updateView();
            })
        }
    })
}


const listContainerHandler = (e) => {
    const {target} = e;
    // console.log({target});
    if (target.className === 'checkbox') {
        const li = target.parentNode;
        const taskId = li.id;
        taskCheckedToggler(taskId);
    } else if (target.className === 'deleteIcon'){
        const li = target.parentNode;
        const taskId = li.id
        deleteTask(taskId);
    } else if (target.className === 'editPencil'){
        const li = target.parentNode;
        const taskId = li.id;
        console.log('pencilEditToggler');
        pencilEditToggler(taskId);
    }
 }



const loadEvent = () => {
    getTodos();
    const addButton = document.querySelector('#addButton');
    const clearAll = document.querySelector('#clearButton');
    const textInput = document.querySelector('.text-input');
    const selectAllIcon = document.querySelector('.select-all-icon');
    const listContainer = getListContainer();

    addButton.addEventListener('click', addNewTaskHandler);
    clearAll.addEventListener('click', clearAllHandler);
    textInput.addEventListener('keyup', enterKeyToggler);
    listContainer.addEventListener('click', listContainerHandler);
    selectAllIcon.addEventListener('click', selectAllIconToggler);
    
    countTaskToggler();
    statusCheckToggler();
    updateView();
};


loadEvent();