import { db } from 'src/index';

/**
 * Функция для отправки новой задачи на сервер и обновления общего списка задач.
 * @param {object} newTask - созданная задача - объект с полями title, text, files, date, isComplited.
 * @param {function} reloadTasks - callback-функция для обновления общего списка задач.
 */
export const addTask = (newTask, reloadTasks) => {
    db.push(newTask);
    reloadTasks();
}