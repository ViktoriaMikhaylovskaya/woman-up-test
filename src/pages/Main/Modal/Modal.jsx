import { useState } from 'react';
import { storageRef } from 'src/index';
import { addTask } from '../data/services/addTask';
import Loader from '../Loading/Loader';

/**
 * Компонент Modal
 * @prop {function} reloadTasks callback-функция для обновления списка задач.
 * @prop {function} setIsShowModal callback-функция для обновления состояния показа модального окна.
 * @returns {React.ReactElement} Компонент Modal
 */

function Modal({ reloadTasks, setIsShowModal }) {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);

    /**
     * Функция для отправки введеных данных в форме на сервер, после чего на страницу добавляется новая задача.
     * @param {FormEvent<HTMLFormElement>} evt - событие, которое происходит при отправке формы.
     */
    const handleSubmit = async (evt) => {
        evt.preventDefault();
        setIsLoading(true);

        const files = [];

        for (let i = 0; i < selectedFiles.length; i++) {
            await storageRef.child(`${selectedFiles[i].name}`).put(selectedFiles[i]).then((snapshot) => { });
            const url = await storageRef.child(`${selectedFiles[i].name}`).getDownloadURL().then(function (url) {
                return url;
            })
            files.push({url, name: selectedFiles[i].name});
        }

        addTask(
            {...Object.fromEntries(new FormData(evt.target)), files: files.length === 0 ? '' : files},
            reloadTasks
        );
        setIsShowModal(false);
        setIsLoading(false);
    }

    /**
     * Функция для закрытия модального окна.
     */
    const onClickCloseModal = () => { 
        setIsShowModal(false);
    }

    return (
        <div className='modal'>
            {isLoading ? <Loader /> :
                <form className='modal__new-task new-task' onSubmit={handleSubmit}>
                    <h2 className='new-task__main-title'>New task</h2>

                    <input className="new-task__title"
                        name='title'
                        placeholder='Введите заголовок'
                        defaultValue=''
                        maxLength={30}
                        minLength={1}
                        required
                    />
                    <textarea className="new-task__text"
                        name='text'
                        defaultValue=''
                        maxLength={500}
                    >
                    </textarea>
                    <input className="new-task__date"
                        name='date'
                        type="date"
                        defaultValue=''
                    />

                    <div className="new-task__files">
                        {selectedFiles.map(({ name }, i) => (
                            <div key={name} className="new-task__edit-file file">
                                <p className="file__name">
                                    - {name}
                                </p>
                                <button
                                    onClick={() => setSelectedFiles(selectedFiles.filter((el) => el.name !== selectedFiles[i].name))}
                                    type="button"
                                >
                                    delete
                                </button>
                            </div>
                        ))}
                        <label htmlFor='new-file' className='task__edit-download'>Загрузить</label>
                        <input className='new-task__files-input'
                            name='files'
                            id='new-file'
                            type="file"
                            onChange={(e) => {
                                if (e.target.files.length > 0) {
                                    setSelectedFiles([...e.target.files]);
                                }
                            }}
                            multiple
                        />
                    </div>

                    <div className="new-task__buttons">
                        <button type='submit' disabled={isLoading}>ADD</button>
                        <button onClick={onClickCloseModal} type='button' disabled={isLoading}>EXIT</button>
                    </div>
                </form>
            }
        </div>
    )
}

export default Modal;
