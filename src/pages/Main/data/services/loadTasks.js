import { db } from 'src/index';

/**
 * Функция для получения всего списка задач с сервера.
 * @param {function} setTasks - callback-функция, которая обновляет состояние списка задач.
 * @return {Array} - возвращает массив объектов (задач).
 */
export const loadTasks = (setTasks) => {
    db.on('value', (elem) => setTasks(elem.val()));
}
