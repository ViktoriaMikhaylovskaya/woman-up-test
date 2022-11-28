import { db } from 'src/index';

/**
 * Функция для удаления задачи и обновления общего списка задач.
 * @param {number} id - идентификатор задачи.
 * @param {function} reloadTasks calback-функция для обновления общего списка задач.
 */
export const deleteTask = (taskId, reloadTasks) => {
    db.child(taskId).remove();
    reloadTasks();
}
