import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setLocalTodoItems, apiGetTodoItems } from '../slices/todoSlice';
import styles from '../styles/modules/app.module.scss';
import TodoItem from './TodoItem';

const container = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};
const child = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

function AppContent() {
  const dispatch = useDispatch();
  const todoList = useSelector((state) => state.todo.todoList);
  const filterStatus = useSelector((state) => state.todo.filterStatus);
  const [filteredTodoList, setFilteredTodoList] = useState([]);

  useEffect(() => {
    dispatch(apiGetTodoItems());
  }, []);

  const updateFilter = () => {
    const filterList = todoList.filter((item) => filterStatus === 'all' || item.status.toUpperCase() === filterStatus.toUpperCase());
    setFilteredTodoList(filterList);
  }

  useEffect(() => {
    updateFilter();
  }, [todoList, filterStatus]);

  return (
    <div>
      {filteredTodoList.length > 0 ? (
        filteredTodoList.map((todo) => (
          <motion.div key={todo.id} variants={child}>
            <TodoItem key={todo.id} todo={todo} />
          </motion.div>
        ))
      ) : (
        <motion.p variants={child} className={styles.emptyText}>
          No Todos
        </motion.p>
      )}
    </div>
    // <motion.div
    //   className={styles.content__wrapper}
    //   variants={container}
    //   initial="hidden"
    //   animate="visible"
    // >
    //   <AnimatePresence>
    //     {filteredTodoList.length > 0 ? (
    //       filteredTodoList.map((todo) => (
    //         <motion.div key={todo.id} variants={child}>
    //           <TodoItem key={todo.id} todo={todo} />
    //         </motion.div>
    //       ))
    //     ) : (
    //       <motion.p variants={child} className={styles.emptyText}>
    //          No Todos 
    //       </motion.p>
    //     )}
    //   </AnimatePresence>
    // </motion.div>
  );
}

export default AppContent;
