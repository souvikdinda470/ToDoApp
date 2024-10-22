let arrtask = [];

// Load tasks from local storage on page load
window.addEventListener('DOMContentLoaded', () => {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    if (tasks) {
        arrtask = tasks;
        tasks.forEach(task => {
            addTaskToDOM(task.text, task.timestamp);
        });
        updateTimestamps();
        setInterval(updateTimestamps, 60000); // Update timestamps every minute
    }
});

let inputtask = document.getElementById('i1');
let addtaskbtn = document.getElementById('btn');
let outdiv = document.getElementById('outputdiv');

addtaskbtn.addEventListener('click', () => {
    addTask();
});

inputtask.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

function addTask() {
    if (inputtask.value.trim() !== '') {
        const timestamp = Date.now();
        addTaskToDOM(inputtask.value.trim(), timestamp);
        arrtask.push({ text: inputtask.value.trim(), timestamp: timestamp });
        saveTasksToLocalStorage();
        inputtask.value = '';
    } else {
        alert("Add some text for task....");
    }
}

function addTaskToDOM(taskText, timestamp) {
    let tempdiv = document.createElement('div');
    let span = document.createElement('span');
    span.innerText = taskText;

    let timeSpan = document.createElement('span');
    timeSpan.classList.add('timestamp');
    timeSpan.setAttribute('data-timestamp', timestamp);
    timeSpan.style.marginLeft = '10px';

    let checkbtn = document.createElement('button');
    checkbtn.innerHTML = "&check;";

    let crossbtn = document.createElement('button');
    crossbtn.innerHTML = "&cross;";

    let editbtn = document.createElement('button');
    editbtn.innerHTML = "Edit";

    tempdiv.append(span, timeSpan, checkbtn, crossbtn, editbtn);
    outdiv.append(tempdiv);

    checkbtn.addEventListener('click', () => {
        if (span.style.textDecoration !== 'line-through') {
            span.style.textDecoration = 'line-through';
        } else {
            span.style.textDecoration = 'none';
        }
    });

    crossbtn.addEventListener('click', (event) => {
        const taskIndex = arrtask.findIndex(task => task.text === taskText && task.timestamp === timestamp);
        if (taskIndex !== -1) {
            arrtask.splice(taskIndex, 1);
            saveTasksToLocalStorage();
        }
        event.target.parentElement.remove();
    }); 

    editbtn.addEventListener('click', () => {
        const newTaskText = prompt("Enter new task:", taskText);
        if (newTaskText !== null && newTaskText.trim() !== '') {
            span.innerText = newTaskText.trim();
            const taskIndex = arrtask.findIndex(task => task.text === taskText && task.timestamp === timestamp);
            if (taskIndex !== -1) {
                arrtask[taskIndex].text = newTaskText.trim();
                saveTasksToLocalStorage();
            }
        }
    });

    updateTimestamp(timeSpan);
}

function saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(arrtask));
}

function updateTimestamps() {
    const timeSpans = document.querySelectorAll('.timestamp');
    timeSpans.forEach(timeSpan => {
        updateTimestamp(timeSpan);
    });
}

function updateTimestamp(timeSpan) {
    const timestamp = parseInt(timeSpan.getAttribute('data-timestamp'), 10);
    const timePassed = Date.now() - timestamp;

    const seconds = Math.floor(timePassed / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (years > 0) {
        timeSpan.innerText = `${years} year${years > 1 ? 's' : ''} ago`;
    } else if (months > 0) {
        timeSpan.innerText = `${months} month${months > 1 ? 's' : ''} ago`;
    } else if (days > 0) {
        timeSpan.innerText = `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
        timeSpan.innerText = `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
        timeSpan.innerText = `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
        timeSpan.innerText = `${seconds} second${seconds > 1 ? 's' : ''} ago`;
    }
}
