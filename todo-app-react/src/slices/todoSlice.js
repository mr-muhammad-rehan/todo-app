import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


const baseUrl = "http://localhost:5000/todos";

const getInitialTodo = () => {
  const localTodoList = window.localStorage.getItem('todoList');
  if (localTodoList) {
    return JSON.parse(localTodoList);
  }
  window.localStorage.setItem('todoList', JSON.stringify([]));
  return [];
};

const setTodoToLocalStorage = (todoList = []) => {
  window.localStorage.setItem('todoList', JSON.stringify(todoList));
};

const addTodoToLocalStorage = (newTodo) => {
  const todoList = window.localStorage.getItem('todoList');
  if (todoList) {
    const todoListArr = JSON.parse(todoList);
    todoListArr.push({ ...newTodo });
    window.localStorage.setItem('todoList', JSON.stringify(todoListArr));
  } else {
    window.localStorage.setItem('todoList', JSON.stringify([{ ...newTodo }]));
  }
};

const updateTodoInLocalStorage = (updatedTodo) => {
  const todoList = window.localStorage.getItem('todoList');
  if (todoList) {
    const todoListArr = JSON.parse(todoList);
    const updatedTodoIndex = todoListArr.findIndex((todo) => todo.id === updatedTodo.id);
    if (updatedTodoIndex !== -1) {
      todoListArr[updatedTodoIndex] = { ...updatedTodo };
      window.localStorage.setItem('todoList', JSON.stringify(todoListArr));
    }
  }
};

const deleteTodoFromLocalStorage = (todoId) => {
  const todoList = window.localStorage.getItem('todoList');
  if (todoList) {
    const todoListArr = JSON.parse(todoList);
    const todoIndexToDelete = todoListArr.findIndex((todo) => todo.id === todoId);
    if (todoIndexToDelete !== -1) {
      todoListArr.splice(todoIndexToDelete, 1);
      window.localStorage.setItem('todoList', JSON.stringify(todoListArr));
    }
  }
};

export const apiAddTodo = createAsyncThunk(
  'todo/addTodo',
  async (newTodo, { rejectWithValue }) => {
    try {
      const response = await axios.post(baseUrl, {
        title: newTodo.title,
        status: newTodo.status,
      });
      return response.data.createdTodo;
    } catch (error) {
      return rejectWithValue('An error occurred while adding the todo.');
    }
  }
);

export const apiGetTodoItems = createAsyncThunk(
  'todo/apiGetTodoItems', async () => {
    const response = await axios.get(baseUrl);
    const data = response.data; // Extract only the data
    return data;
  }
);

export const apiDeleteTodo = createAsyncThunk(
  'todo/deleteTodo',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${baseUrl}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue('An error occurred while deleting the todo.');
    }
  }
);

export const apiUpdateTodo = createAsyncThunk(
  'todo/apiUpdateTodo',
  async (updatedTodo, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${baseUrl}`, {
        ...updatedTodo
      });
      return response.data;
    } catch (error) {
      return rejectWithValue('An error occurred while deleting the todo.');
    }
  }
);

 

const initialValue = {
  filterStatus: 'all',
  todoList: [],//getInitialTodo(),
};

export const todoSlice = createSlice({
  name: 'todo',
  initialState: initialValue,
  reducers: {
    setLocalTodoItems: (state, action) => {
      state.todoList = getInitialTodo();
    },
    addTodo: (state, action) => {
      state.todoList.push(action.payload);
      addTodoToLocalStorage(action.payload);
    },
    updateTodo: (state, action) => {
      const { id, title, status } = action.payload;
      const todoToUpdate = state.todoList.find((todo) => todo.id === id);
      if (todoToUpdate) {
        todoToUpdate.title = title;
        todoToUpdate.status = status;
        updateTodoInLocalStorage(todoToUpdate);
      }
    },
    deleteTodo: (state, action) => {
      const todoIdToDelete = action.payload;
      const updatedTodoList = state.todoList.filter((todo) => todo.id !== todoIdToDelete);
      state.todoList = updatedTodoList;
      deleteTodoFromLocalStorage(todoIdToDelete);
    },
    updateFilterStatus: (state, action) => {
      state.filterStatus = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(apiGetTodoItems.pending, (state) => {
      //manage pending case
    });
    builder.addCase(apiGetTodoItems.fulfilled, (state, action) => {
      const { todosList } = action.payload;
      state.todoList = todosList;
      setTodoToLocalStorage(todosList);
    });
    builder.addCase(apiGetTodoItems.rejected, (state) => {
    });
    builder.addCase(apiDeleteTodo.fulfilled, (state, action) => {
      const todoIdToDelete = action.payload; 
      const updatedTodoList = state.todoList.filter((todo) => todo.id !== todoIdToDelete); 
      state.todoList = [...updatedTodoList];
      deleteTodoFromLocalStorage(todoIdToDelete);
    });
    builder.addCase(apiAddTodo.fulfilled, (state, action) => { 
      state.todoList.push(action.payload);
      addTodoToLocalStorage(action.payload);
    });
    builder.addCase(apiUpdateTodo.fulfilled, (state, action) => {
      const { id, title, status } = action.payload.result; 
      const index = state.todoList.findIndex((todo) => todo.id === id);
      if (index !== -1) {
        state.todoList[index].status = status;
        state.todoList[index].title = title;
        updateTodoInLocalStorage(state.todoList[index]);
      }
    });
  }
});

export const { setLocalTodoItems, addTodo, updateTodo, deleteTodo, updateFilterStatus } = todoSlice.actions;
export default todoSlice.reducer;
