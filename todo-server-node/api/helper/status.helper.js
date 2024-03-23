const TodoStatus = require('../contracts/todoStatusEnum');

// Return 'INCOMPLETED' if currentStatus is undefined or empty
module.exports = statusValidator = (currentStatus) => {
    if (!currentStatus || currentStatus.trim() === '') {
        return TodoStatus.INCOMPLETE;
    }

    return Object.keys(TodoStatus).find((status) => status === currentStatus) || TodoStatus.INCOMPLETE;
}
