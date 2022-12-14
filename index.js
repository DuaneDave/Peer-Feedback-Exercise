class TodoItem {
  constructor(description, completed, id) {
    this.description = description;
    this.completed = completed;
    this.id = id;
  }
};

class TodoArray {
  constructor() {
    this.todos = JSON.parse(localStorage.getItem('todos')) || [];
  }

  addTodo(todo) {
    this.todos.push(todo);
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }

  updateTodo(id, newTodo) {
    this.todos[id - 1] = newTodo;
    for (let i = 0; i < this.todos.length; i += 1) {
      this.todos[i].id = i + 1;
    }
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }

  deleteTodo(index) {
    if (this.todos.length === 1) {
      this.todos = [];
    } else {
      this.todos.splice(index, 1);
    }
    for (let i = 0; i < this.todos.length; i += 1) {
      this.todos[i].id = i + 1;
    }
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }

  getAllTodos() {
    return this.todos;
  }

  toggleCompleted(index) {
    this.todos[index - 1].completed = !this.todos[index - 1].completed;
    for (let i = 0; i < this.todos.length; i += 1) {
      this.todos[i].id = i + 1;
    }
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }

  clearCompleted() {
    const newArr = this.todos.filter((todo) => !todo.completed);
    this.todos = newArr;
    for (let i = 0; i < this.todos.length; i += 1) {
      this.todos[i].id = i + 1;
    }
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }
}

const form = document.querySelector('form');
const todoWrapper = document.querySelector('.todo-container');
const removeCompleted = document.querySelector('button');

const todoArray = new TodoArray();

const popUp = () => {
  const popUp = document.querySelector('#clear-completed');
  popUp.classList.add('active');

  setTimeout(() => {
    popUp.classList.remove('active');
  }, 2500);
};

const renderTodos = () => {
  todoWrapper.innerHTML = '';
  if (todoArray.getAllTodos().length === 0) {
    todoWrapper.innerHTML = '<h3 class= "alert">Todo is Empty</h3>';
  } else {
    todoArray.getAllTodos().forEach((todo, index) => {
      const todoItem = document.createElement('div');
      todoItem.classList.add('todo-item');
      const todoStatus = () => {
        const status = todo.completed ? 'checked' : '';
        return status;
      };
      todoItem.innerHTML = `
        <div data-check = ${index} class="todo border-bottom flex">
        <input data-complete = ${todo.id} class="box" ${todoStatus()} type="checkbox" />
        <input data-item = ${todo.id} class="item ${todoStatus()}" type="text" value="${todo.description}" />
        <i id="delete-btn" data-remote = ${index} class='bx bx-trash' id="delete-btn"></i>
        </div>
      `;
      todoWrapper.appendChild(todoItem);
    });
  }

  const deletBtn = document.querySelectorAll('#delete-btn');
  deletBtn.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const { remote } = e.target.dataset;
      todoArray.deleteTodo(remote);
      renderTodos();
    });
  });

  const editTodo = document.querySelectorAll('.todo-item');
  const checkedBox = document.querySelectorAll('.box');
  editTodo.forEach((todo) => {
    todo.addEventListener('keyup', (e) => {
      const { dataset, value } = e.target;
      const id = dataset.item;
      const description = value.trim();
      const completed = false;
      const newTodo = new TodoItem(description, completed, id);
      todoArray.updateTodo(id, newTodo);
      checkedBox[id - 1].checked = false;
      todo.classList.remove('checked');
    });
  });

  const todoItems = document.querySelectorAll('.item');
  const chexkbox = document.querySelectorAll('.box');
  chexkbox.forEach((checkbox) => {
    checkbox.addEventListener('click', (e) => {
      const { complete } = e.target.dataset;
      if (checkbox.checked) {
        todoArray.toggleCompleted(complete);
        todoItems[complete - 1].classList.add('checked');
      } else {
        todoArray.toggleCompleted(complete);
        todoItems[complete - 1].classList.remove('checked');
      }
    });
  });

  removeCompleted.addEventListener('click', () => {
    todoArray.clearCompleted();
    renderTodos();
    popUp();
  });
};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const todoText = document.querySelector('.input').value;
  const todo = new TodoItem(
    todoText,
    false,
    todoArray.getAllTodos().length + 1,
  );
  todoArray.addTodo(todo);
  form.reset();
  document.querySelector('.input').focus();
  renderTodos();
});

window.onload = renderTodos();

