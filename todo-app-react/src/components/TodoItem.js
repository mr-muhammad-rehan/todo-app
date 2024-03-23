import { format } from 'date-fns';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import React, { useEffect, useState } from 'react';
import { MdDelete, MdEdit } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { deleteTodo, apiDeleteTodo, updateTodo, apiUpdateTodo } from '../slices/todoSlice';
import styles from '../styles/modules/todoItem.module.scss';
import { getClasses } from '../utils/getClasses';
import CheckButton from './CheckButton';
import TodoModal from './TodoModal';

const child = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

function TodoItem({ todo }) {
  const dispatch = useDispatch();
  const [checked, setChecked] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  useEffect(() => {
    setChecked(todo.status.toLowerCase() === 'complete');
  }, [todo.status]);

  const handleCheck = () => {
    setChecked(!checked);
    // dispatch(
    //   updateTodo({ ...todo, status: checked ? 'Incomplete' : 'Complete' })
    // );
    dispatch(
      apiUpdateTodo({ ...todo, status: checked ? 'Incomplete' : 'Complete' })
    );
  };

  const handleDelete = () => {
    // dispatch(deleteTodo(todo.id));
    dispatch(apiDeleteTodo(todo.id));
    toast.success('Todo Deleted Successfully');
  };

  const handleUpdate = () => {
    setUpdateModalOpen(true);
  };

  return (
    <>
      <motion.div className={styles.item} variants={child}>
        <div className={styles.todoDetails}>
          <CheckButton checked={checked} handleCheck={handleCheck} />
          <div className={styles.texts}>
            <p
              className={getClasses([
                styles.todoText,
                todo.status.toLowerCase() === 'complete' && styles['todoText--completed'],
              ])}
            >
              {todo.title}
            </p>
            <p className={styles.time}>
              {format(new Date(todo.time), 'p, MM/dd/yyyy')}
            </p>
          </div>
        </div>
        <div className={styles.todoActions}>
          <div
            className={styles.icon}
            onClick={handleDelete}
            tabIndex={0}
            role="button"
          >
            <MdDelete />
          </div>
          <div
            className={styles.icon}
            onClick={handleUpdate}
            tabIndex={0}
            role="button" >
            <MdEdit />
          </div>
        </div>
      </motion.div>
      {updateModalOpen && <TodoModal type="update" modalOpen={updateModalOpen} setModalOpen={setUpdateModalOpen} todo={todo} />
      }
    </>
  );
}

export default TodoItem;
