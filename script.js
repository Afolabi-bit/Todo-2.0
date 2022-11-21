// ****** DECLARATIONS ********
const body = document.getElementById('body');
const toggleBtn = document.querySelectorAll('.theme-toggle');

// Form Elements
const form = document.getElementById('form');
const input = document.getElementById('todoInput');
const description = document.getElementById('description');
const checkboxVal = document.getElementById('reminder');
const calendarVal = document.getElementById('deadline');  

// Elements to hold the todo metric count 
const ongoingCount = document.getElementById('ongoing-count');
const completedCount = document.getElementById('completed-count');

// SVGs
const completedSVG = document.querySelector('.card.completed svg.desktop circle');
const ongoingSVG = document.querySelector('.card.ongoing svg.desktop circle');
const mobileCompletedSVG = document.querySelector('.card.completed svg.mobile circle')
const mobileOngoingSVG = document.querySelector('.card.ongoing svg.mobile circle')

// Todo List
const todoList = document.getElementById('todo-list');
let todos = document.querySelectorAll('.todo');

//Nav Buttons and Nav element
const nav = document.getElementById('navbar');
const completedBtn = document.getElementById('completed-btn');
const ongoingBtn = document.getElementById('ongoing-btn');
const allBtn = document.getElementById('all-btn');

// Hamburger Menu Button
const menuBtn = document.getElementById('hamburger');

// Section under/beside navbar
const todoInfo = document.getElementById('todo-info');

// ******* END OF DECLARATIONS *******






// ******** Event Listeners ********
todoList.addEventListener('click', deleteAndCheck);
completedBtn.addEventListener('click', filter);
ongoingBtn.addEventListener('click', filter);
allBtn.addEventListener('click', filter);

// ******** END OF Event Listeners *********







// ******** HELPER FUNCTIONS *********

// Updates the metrics

function updateMetric(){
    const todos = document.querySelectorAll('.todo').length;
    const total = document.getElementById('total');

    if (todos == 0)
    {
        total.classList.add('empty');
        total.innerHTML = 'What are you doing today?'


        // Set SVGs to full circle
        ongoingSVG.style.strokeDashoffset = 0;
        completedSVG.style.strokeDashoffset = 0;
        mobileCompletedSVG.style.strokeDashoffset = 0;
        mobileOngoingSVG.style.strokeDashoffset = 0;
        
        // Set the counts to Zero
        completedCount.innerHTML = '0%';
        ongoingCount.innerHTML = '0%';
    }
    else if (todos == 1)
    {
        total.classList.remove('empty');
        total.innerHTML = todos + ' Total Task';

        calculatePercentage();
    }
    else
    {
        total.classList.remove('empty');
        total.innerHTML = todos + ' Total Tasks';

        calculatePercentage();
    }
}

// Calculate SVG percentages
function calculatePercentage()
{
    const todos = document.querySelectorAll('.todo').length;
    const completedTasks = document.querySelectorAll('.todo-list .completed').length;

    
    // Percentage of completed tasks round up
    let completedPercent = completedTasks / todos * 100;
    completedSVG.style.strokeDashoffset = (todos - completedTasks) / todos * 310;
    mobileCompletedSVG.style.strokeDashoffset = (todos - completedTasks) / todos * 249;
    
    // Percentage of ongoing tasks round down
    let ongoingPercent = (todos - completedTasks) / todos * 100;
    ongoingSVG.style.strokeDashoffset = completedTasks / todos * 310;
    mobileOngoingSVG.style.strokeDashoffset = completedTasks / todos * 249;
    
    if (todos != 0){
        completedCount.innerHTML = `${Math.ceil(completedPercent)}%`;
        ongoingCount.innerHTML = `${Math.floor(ongoingPercent)}%`;
    }
}

// Mark a task completed
function deleteAndCheck(e){
    let btn = e.target;
    let parent = btn.parentElement;

    if (btn.classList.contains('check-btn'))
    {
        parent.classList.toggle('completed');
        updateMetric();
    }
    else if (btn.classList.contains('delete'))
    {
        parent.classList.add('animate');
        parent.addEventListener('transitionend', ()=> {
            parent.remove();
            updateMetric();
        })
    }
    else
    {
        return
    }
}


// Filters todos based on progress status
function filter(e){
    let child = e.target.childNodes[3].innerHTML;

    todos = document.querySelectorAll('.todo')
    
    todos.forEach(todo =>{
        switch(child) {
            case 'My tasks':
                todo.style.display = 'flex';
                break;
            case 'Scheduled':
                if(!todo.classList.contains('completed'))
                    todo.style.display = 'flex';
                else
                    todo.style.display = 'none';
                break;
            case 'Completed':
                if(todo.classList.contains('completed'))
                    todo.style.display = 'flex';
                else
                    todo.style.display = 'none';
                break;
        }
    })

}


// Get the element after the dragged element
function afterDraggedElement(y){
    const todos = [...document.querySelectorAll('.todo:not(.dragging)')];
    //console.log(y, todos);

    return todos.reduce((position, todo) => {
        const box = todo.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > position.offset)
            return { offset: offset, element: todo};
        else
            return position;
        
    }, { offset: Number.NEGATIVE_INFINITY }).element
}


// ***** END OF HELPER FUNCTIONS *******




// ******* FEATURES AND TODO CREATION *****

// Set default deadline to today
calendarVal.valueAsDate = new Date();


// Theme Functionality
toggleBtn.forEach(btn => {
    btn.addEventListener('click', ()=>{
        body.classList.toggle('light-mode');
    })
})


// FORM Events and Todo creation
updateMetric();
form.addEventListener('submit', createTodo);

// Create todo on form submit
function createTodo(e){
    e.preventDefault();

    if (input.value == '' || input.value.trim() == '')
        return
    
    // Creation of HTML elements
    const div = document.createElement('div');
    const todoDeets = document.createElement('div');
    const dateCheck = document.createElement('div');
    const task = document.createElement('p');
    const descriptionText = document.createElement('p');
    const date = document.createElement('p');
    const clock = document.createElement('i');
    const deleteBtn = document.createElement('button');
    const checkBtn = document.createElement('button');

    // Assigning classNames
    div.classList.add('todo');
    div.setAttribute('draggable', 'true');
    todoDeets.classList.add('todo-deets')
    task.classList.add('task');
    descriptionText.classList.add('description');
    task.setAttribute('contenteditable', '');
    descriptionText.setAttribute('contenteditable', '');
    dateCheck.classList.add('date-check')
    date.classList.add('date');
    clock.className = 'fas fa-stopwatch';
    checkBtn.classList.add('check-btn');
    deleteBtn.classList.add('delete');


    // Add Input to the P element
    date.textContent = calendarVal.value;
    task.textContent = input.value;
    descriptionText.textContent = description.value;

    // Add Icon to buttons
    checkBtn.innerHTML = '<i class="fas fa-check"></i>';
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';

    // Append innner elements to the todo 
    todoDeets.appendChild(task);
    if (description.value.length > 0)
        todoDeets.appendChild(descriptionText);
    todoDeets.appendChild(dateCheck);
    dateCheck.appendChild(date);

    if (checkboxVal.checked)
        dateCheck.appendChild(clock);
    
    div.appendChild(todoDeets)
    div.appendChild(checkBtn);
    div.appendChild(deleteBtn);

    // Add the todo to the list
    todoList.appendChild(div);
    input.value = '';
    description.value = '';
    checkboxVal.checked = false;

    updateMetric();
    todos = document.querySelectorAll('.todo');
}

// Drag and Drop functionality
todoList.addEventListener('dragstart', (e)=>{
    let todo = e.target;

    todo.classList.add('dragging');
})

todoList.addEventListener('dragend', (e)=>{
    let todo = e.target;

    todo.classList.remove('dragging');
})

todoList.addEventListener('dragover', (e)=>{
    e.preventDefault();
    
    const dragged = document.querySelector('.dragging');
    const afterElement = afterDraggedElement(e.clientY)

    if (afterElement == null)
        todoList.appendChild(dragged);
    else
        todoList.insertBefore(dragged, afterElement);
})

// Toggling
menuBtn.addEventListener('click', () => {
    nav.classList.toggle('toggle')
})

todoInfo.addEventListener('click', ()=> {
    if (nav.classList.contains('toggle'))
        nav.classList.remove('toggle');
})