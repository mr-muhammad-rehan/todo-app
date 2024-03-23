const Todo = require("../models/todo.model");
const statusValidator = require('../helper/status.helper');
const fns = require('date-fns')
const mongoose = require("mongoose");

exports.get_all = (req, res, next) => {
    Todo.find()
        .exec()
        .then((docs) => {
            const response = {
                count: docs.length,
                todosList: docs.map((doc) => {
                    return {
                        id: doc._id,
                        title: doc.title,
                        status: doc.status,
                        time: fns.format((doc.updatedAt), 'p, MM/dd/yyyy'),
                    }
                })
            }
            res.status(200).json(response);
        })
        .catch((err) => {
            // console.log(err);
            res.status(500).json({ error: err });
        })
};

exports.create_new_todo = (req, res, next) => {
    const request = new Todo({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        status: statusValidator(req.body.status),
    });

    request.save()
        .then((result) => {
            res.status(201).json({
                message: "Todo created successfully",
                createdTodo: {
                    id: result._id,
                    title: result.title,
                    status: result.status,
                    time: fns.format((result.updatedAt), 'p, MM/dd/yyyy')
                },
            })
        })
        .catch((err) => {
            // console.log(err);
            res.status(500).json({
                error: err,
            });
        });
};

exports.update_todo = (req, res, next) => {
    const { id, title, status } = req.body;

    const updatedTodo = {
        title: title,
        status: status,
    }

    console.log(updatedTodo);

    Todo.findOneAndUpdate({ _id: id }, { $set: updatedTodo }, { new: true })
        .exec()
        .then((result) => {
            console.log(result);
            const updatedDoc = {
                id: result._id,
                title: result.title,
                status: result.status,
                time: fns.format((result.updatedAt), 'p, MM/dd/yyyy')
            }
            res.status(200).json({ result: updatedDoc, message: "Todo updated" });
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
};

exports.delete_todo = (req, res, next) => {
    const id = req.params.id;

    Todo.findByIdAndRemove(id)
        .exec()
        .then((result) => {
            if (result) {
                res.status(204).end(); // 204 No Content for successful deletion
            } else {
                res.status(404).json({
                    message: "Todo not found",
                });
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err,
            });
        });
};
 
exports.get_all_tods = async (req, res)=>  {
    
   let response = await  Todo.find().exec();
    return response;
}