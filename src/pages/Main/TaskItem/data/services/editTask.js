import { db } from 'src/index';

/**
 * Функция для добавления новой задачи и обновления общего списка задач.
 * @param {object} editedTask - отредактированная задача (объект с полями id, title, text, files, date, isComplited).
 * @param {function} reloadTasks - callback-функция для обновления общего списка задач.
 */
export const editTask = (editedTask, taskId, reloadTasks) => {
    db.child(taskId).update(editedTask);
    reloadTasks();
}
