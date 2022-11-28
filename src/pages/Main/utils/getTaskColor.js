import dayjs from 'dayjs';

/**
 * Функция, сравнивающая текущую дату с датой выполненя задачи.
 * @param {string} date время в виде строки, например "2022-11-21"
 * @return {string} возвращает цвет задачи, который применяется в стилях (говорит о том, просрочена дата выполнения или нет)
 */

export const getTaskColor = (date) => {
    if (date === '') {
        return 'white';
    }

    if (dayjs().format('YYYY-MM-DD') > date) {
        return 'red';
    }

    if (dayjs().format('YYYY-MM-DD') === date) {
        return 'yellow';
    }

    return 'lime';
}