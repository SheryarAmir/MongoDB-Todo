const btn = document.querySelector("#btn");
const input = document.querySelector("#input");
const main = document.querySelector(".main");
const button = document.querySelector(".getTodo");

btn.addEventListener("click", () => {
  const value = input.value;
  fetch("http://localhost:3000/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ value }),
  })
    .then((response) => response.json())
    .then((todo) => {
      CreateTodo(todo);
      input.value = "";
    })
    .catch((error) => {
      console.log(`There is an error: ${error}`);
    });
});

function CreateTodo(todo) {
  const todoItem = document.createElement("p");
  const DeleteButton = document.createElement("button");
  const UpdateButton = document.createElement("button");
  const ToggleButton = document.createElement("button");

  todoItem.textContent = todo.value;
  DeleteButton.innerText = "X";
  ToggleButton.innerText = "Complete";
  UpdateButton.innerText = "Edit";

  main.appendChild(todoItem);
  main.appendChild(DeleteButton);
  main.appendChild(UpdateButton);
  main.appendChild(ToggleButton);

  DeleteButton.onclick = () => DeleteFunction(todo._id);
  UpdateButton.onclick = () => EditFunction(todo._id);
  ToggleButton.onclick = () => ToggleFunction(todo._id, todoItem);
}

button.addEventListener("click", render());

function DeleteFunction(id) {
  fetch(`http://localhost:3000/todos/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.message);
      render();
    })
    .catch((error) => {
      console.log(`There is an error: ${error}`);
    });
}

function ToggleFunction(id, todoItem) {
  fetch(`http://localhost:3000/todos/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  })
    .then((response) => response.json())
    .then((todo) => {
      console.log(todo.isComplete);
      if (todo.isComplete) {
        todoItem.style.textDecoration = "line-through";
      } else {
        todoItem.style.textDecoration = "none";
      }
      render();
    })
    .catch((error) => {
      console.log(`There is an error: ${error}`);
    });
}

function EditFunction(id) {
  const value = prompt("enter new value");

  fetch(`http://localhost:3000/todos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ value }),
  })
    .then((response) => response.json())
    .then((todo) => {
      console.log(todo);
      render();
    })
    .catch((error) => {
      console.log(`There is an error: ${error}`);
    });
}

async function render() {
  fetch("http://localhost:3000/todos")
    .then((response) => response.json())
    .then((todos) => {
      console.log(input.value);
      main.innerHTML = "";

      todos.forEach((todo) => {
        const todoItem = document.createElement("p");
        const DeleteButton = document.createElement("button");
        const UpdateButton = document.createElement("button");
        const ToggleButton = document.createElement("button");

        todoItem.textContent = todo.value;
        DeleteButton.innerText = "X";
        ToggleButton.innerText = "Complete";
        UpdateButton.innerText = "Edit";

        if (todo.isComplete) {
          todoItem.style.textDecoration = "line-through";
        }

        main.appendChild(todoItem);
        main.appendChild(DeleteButton);
        main.appendChild(UpdateButton);
        main.appendChild(ToggleButton);

        DeleteButton.onclick = () => DeleteFunction(todo._id);
        UpdateButton.onclick = () => EditFunction(todo._id);
        ToggleButton.onclick = () => ToggleFunction(todo._id, todoItem);
      });
    })
    .catch((error) => {
      console.log(`There is an error fetching data from the backend: ${error}`);
    });
}
