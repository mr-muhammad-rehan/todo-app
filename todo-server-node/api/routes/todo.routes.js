const express = require('express');
const route = express.Router();

//middleware
const checkAuth = require('../middleware/check-auth');
//controller
const TodosController = require('../controller/todos.controller.js');

route.get('/', checkAuth, TodosController.get_all);
route.post('/', checkAuth, TodosController.create_new_todo);
route.put('/', checkAuth, TodosController.update_todo);
route.delete('/:id', checkAuth, TodosController.delete_todo);
route.get('/get-all', checkAuth, TodosController.get_all_tods);


module.exports = route;