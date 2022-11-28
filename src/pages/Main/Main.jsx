import { useEffect, useState } from 'react';
import { loadTasks } from './data/services/loadTasks';
import Modal from './Modal/Modal';
import TaskItem from './TaskItem/TaskItem';

/**
 * Компонент Main
 * @type {React.FC}
 * @returns {React.ReactElement} Компонент Main (главная страница)
 */

function Main() {
    const [tasks, setTasks] = useState([]);
    const [isShowModal, setIsShowModal] = useState(false);

    /**
     * Функция для обновления списка задач.
     * @example вызывает функцию loadTasks, где в качестве параметра передает callback для обновления состояния списка задач.
     */
    const reloadTasks = () => {
        loadTasks(setTasks);
    };

    /**
     * Функция для показа модального окна.
     */
    const onClickOpenModal = () => {
        setIsShowModal(true);
    }

    isShowModal ? document.body.style.overflowY = 'hidden' : document.body.style.overflowY = 'scroll';

    useEffect(() => {
        loadTasks(setTasks);
    }, [])

    return (
        <div className="main-container">
            <header className='header'>
                <h1 className="header__title">TODO-list</h1>
                <button onClick={onClickOpenModal}>+ Add task</button>
            </header>
            <div className="tasks">
                <ul className="tasks__list">
                    {tasks
                        ? Object.entries(tasks).map(([id, task]) => {
                        return <li key={id}>
                            <TaskItem taskId={id} task={task} reloadTasks={reloadTasks} />
                        </li>
                        })
                        : <li><h2>Create your first task!</h2></li>
                    }
                </ul>
            </div>

            {isShowModal
               && (<Modal reloadTasks={reloadTasks} isShowModal={isShowModal} setIsShowModal={setIsShowModal} />)
            }
        </div>
    )
}

export default Main;
