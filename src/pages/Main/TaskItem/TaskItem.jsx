import { useState } from 'react';
import { getTaskColor } from '../utils/getTaskColor';
import { deleteTask } from './data/services/deleteTask';
import { editTask } from './data/services/editTask';
import { storageRef } from 'src/index';
import Loader from '../Loading/Loader';
import dayjs from 'dayjs';

/**
 * Компонент TaskItem
 * @prop {string} taskId - идентификатор задачи.
 * @prop {object} task - задача.
 * @prop {function} reloadTasks - callback-функция для обновления списка задач.
 * @type {React.FC}
 * @returns {React.ReactElement} Компонент TaskItem (карточка задачи)
 */

function TaskItem({ taskId, task, reloadTasks }) {
    const [isEdit, setIsEsit] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([...task.files]);
    const [isChecked, setIsChecked] = useState(task.isCompleted);
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Функция-переключатель статуса задачи.
     * @exapmle При клике на чекбокс, статус задачи меняется на "Выполнена", меняются стили и она становится серой.
     */
    const handleClickCompleted = () => {
        setIsChecked(!isChecked)
        editTask({ ...task, isCompleted: !isChecked }, taskId, reloadTasks);
    };

    /**
     * Функция удаления задачи по клику.
     * @example При клике на кнопку "delete" передает идентификатор задачи и cb-функцию для обновления списка задач.
     */
    const handleClickDelete = () => {
        deleteTask(taskId, reloadTasks);
    }

    /**
     * Функция-переключатель состояния редактирования задачи.
     */
    const handleClickEdit = () => {
        setIsEsit(!isEdit);
    }

    /**
     * Функция для отправки введеных данных в форме на сервер, после чего на страницу добавляется новая задача.
     * @param {FormEvent<HTMLFormElement>} evt - событие, которое происходит при отправке формы.
     */
    const handleSubmit = async (evt) => {
        evt.preventDefault();
        let files = [];
        setIsLoading(true);

        if (selectedFiles.length !== 0) {
            for (let i = 0; i < selectedFiles.length; i++) {
                if (!selectedFiles[i].url) {
                    await storageRef.child(`${selectedFiles[i].name}`).put(selectedFiles[i]).then((snapshot) => { });
                    const url = await storageRef.child(`${selectedFiles[i].name}`).getDownloadURL().then(function (url) {
                        return url;
                    })
                    files.push({ url, name: selectedFiles[i].name });
                } else { 
                    files.push({ url: selectedFiles[i].url, name: selectedFiles[i].name });
                }
            }
        }
            
        editTask(
            { ...task, ...Object.fromEntries(new FormData(evt.target)), files: files.length === 0 ? '' : files },
            taskId,
            reloadTasks
        );
        setIsEsit(!isEdit);
        setIsLoading(false);
    }

    return (
        <>
            {!isEdit
                ? <article className="tasks__item task" style={{ borderColor: isChecked ? 'white' : getTaskColor(task.date), opacity: isChecked ? 0.5 : 1 }}>
                    <div className='task__header'>
                        <input type="checkbox" checked={isChecked} onChange={handleClickCompleted}></input>
                        <h2 className="task__title">{task.title}</h2>
                    </div>
                    <p className="task__text">{task.text}</p>
                    <p className="task__date">{task.date && dayjs(task.date).format('DD.MM.YYYY')}</p>
                    <div className="task__files">
                        {task.files && task.files.length > 0
                            ? task.files.map((file) => <p key={file.url} className="file__name">- {file.name}</p>)
                            : <p>Прикреплённые файлы отстутствуют.</p>
                        }
                    </div>
                    <div className="task__buttons">
                        <button onClick={handleClickEdit}>edit</button>
                        <button onClick={handleClickDelete}>delete</button>
                    </div>
                </article>
                : <article className="tasks__item task">
                    <form className='task__form' onSubmit={handleSubmit}>
                        {isLoading && <Loader />}
                        <input className="task__edit-title"
                            placeholder='Введите заголовок'
                            defaultValue={task.title}
                            maxLength={30}
                            minLength={1}
                            name="title"
                            required
                        />
                        <textarea className="task__edit-text"
                            defaultValue={task.text}
                            maxLength={500}
                            name="text"
                        >
                        </textarea>
                        <input className="task__edit-date"
                            type="date"
                            defaultValue={task.date}
                            name="date"
                        />
                        <div className="task__files">
                            {selectedFiles && selectedFiles.length > 0
                                && selectedFiles.map(({name}, i) => (
                                    <div key={name + i} className="task__edit-file file">
                                        <p className="file__name">
                                            - {name}
                                        </p>
                                        <button
                                            onClick={() => setSelectedFiles(selectedFiles.filter((el) => el.name !== name))}
                                        >
                                            delete
                                        </button>
                                    </div>
                                ))
                            }
                            <label htmlFor='file' className='task__edit-download'>Загрузить</label>
                            <input className='task__files-input'
                                id='file'
                                type="file"
                                onChange={(e) => {
                                    if (e.target.files.length > 0) {
                                        setSelectedFiles([...selectedFiles, ...e.target.files]);
                                    }
                                }}
                                multiple
                                name='files'
                            />
                        </div>
                        <div className="task__buttons">
                            <button disabled={isLoading}>save</button>
                            <button onClick={handleClickEdit} type='button' disabled={isLoading}>cancel</button>
                        </div>
                    </form>
                </article>
            }
        </>
    )
}

export default TaskItem;