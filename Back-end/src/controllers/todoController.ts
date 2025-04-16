import { Request, Response } from "express";
import { Todo } from "../models/Todo";

enum HttpStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500
}

interface TodoParams {
  id: string;
}

interface CreateTodoBody {
  value: string;
}

interface UpdateTodoBody {
  value: string;
}

// Create a new todo
export async function createTodo(request: Request<{}, {}, CreateTodoBody>, response: Response) {
  try {
    const { value } = request.body;
    const todo = new Todo({ value });
    await todo.save();
    return response.status(HttpStatus.CREATED).json(todo);
  } catch (error) {
    return response.status(HttpStatus.BAD_REQUEST).json({ error: "Failed to create todo" });
  }
}

// Get all todos
export async function getAllTodos(_request: Request, response: Response) {
  try {
    const todos = await Todo.find();
    console.log({todos});
    return response.json(todos);
  } catch (error) {
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Failed to fetch todos" });
  }
}

// Update a todo
export async function updateTodo(request: Request<TodoParams, {}, UpdateTodoBody>, response: Response) {
  try {
    const { id } = request.params;
    const { value } = request.body;
    const todo = await Todo.findByIdAndUpdate(id, { value }, { new: true });
    
    if (!todo) {
      return response.status(HttpStatus.NOT_FOUND).json({ error: "Todo not found" });
    }
    
    return response.json(todo);
  } catch (error) {
    return response.status(HttpStatus.BAD_REQUEST).json({ error: "Failed to update todo" });
  }
}

// Delete a todo
export async function deleteTodo(request: Request<TodoParams>, response: Response) {
  try {
    const { id } = request.params;
    
    const todo = await Todo.findByIdAndDelete(id);
    
    if (!todo) {
      return response.status(HttpStatus.NOT_FOUND).json({ error: "Todo not found" });
    }
    return response.json({ message: "Todo deleted successfully" });
  } catch (error) {
    return response.status(HttpStatus.BAD_REQUEST).json({ error: "Failed to delete todo" });
  }
}

// Mark todo as complete
export async function completeTodo(request: Request<TodoParams>, response: Response) {
  try {
    const { id } = request.params;
    const todo = await Todo.findById(id);

    // console.log(request)

    
    if (!todo) {
      return response.status(HttpStatus.NOT_FOUND).json({ error: "Todo not found" });
    }

    todo.isComplete = !todo.isComplete;
    await todo.save();

    return response.json(todo);
  } catch (error) {
    return response.status(HttpStatus.BAD_REQUEST).json({ error: "Failed to update todo" });
  }
}