// Загрузка DOM перед выполнением скрипта
document.addEventListener('DOMContentLoaded', () => {
    const notesList = document.getElementById('notes-list');
    const noteInput = document.getElementById('note-input');
    const addNoteBtn = document.getElementById('add-note');
    const offlineStatus = document.getElementById('offline-status');

    // Загрузка заметок из localStorage
    let notes = JSON.parse(localStorage.getItem('notes')) || [];

    // Проверка онлайн-статуса
    function updateOnlineStatus() {
        offlineStatus.classList.toggle('offline-hidden', navigator.onLine);
    }

    // Обработчики для онлайн/офлайн
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus(); // Проверить сразу при загрузке

    // Отображение заметок
    function renderNotes() {
        notesList.innerHTML = notes.map((note, index) => `
            <div class="note-item">
                <div class="note-text">${note.text}</div>
                <button class="delete-btn" data-index="${index}">Удалить</button>
            </div>
        `).join('');

        // Назначение обработчиков удаления
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.dataset.index;
                notes.splice(index, 1);
                saveNotes();
                renderNotes();
            });
        });
    }

    // Добавление заметки
    addNoteBtn.addEventListener('click', () => {
        const text = noteInput.value.trim();
        if (text) {
            notes.push({ text, date: new Date() });
            noteInput.value = '';
            saveNotes();
            renderNotes();
        }
    });

    // Сохранение в localStorage
    function saveNotes() {
        localStorage.setItem('notes', JSON.stringify(notes));
    }

    // В app.js замените функцию renderNotes
function renderNotes() {
    notesList.innerHTML = notes.map((note, index) => `
        <div class="note-item">
            <div class="note-text" data-index="${index}">${note.text}</div>
            <button class="delete-btn" data-index="${index}">Удалить</button>
        </div>
    `).join('');

    // Обработчики клика по тексту заметки
    document.querySelectorAll('.note-text').forEach(textElement => {
        textElement.addEventListener('click', startEditNote);
    });

    // Обработчики удаления
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', deleteNote);
    });
}

// Функция начала редактирования
function startEditNote(e) {
    if(e.target.classList.contains('edit-input')) return;
    
    const textElement = e.target;
    const index = textElement.dataset.index;
    const originalText = notes[index].text;

    // Создаем поле ввода
    const input = document.createElement('textarea');
    input.className = 'edit-input';
    input.value = originalText;
    
    // Заменяем текст на поле ввода
    textElement.replaceWith(input);
    input.focus();

    // Обработчик сохранения
    const saveHandler = () => {
        const newText = input.value.trim();
        if(newText && newText !== originalText) {
            notes[index].text = newText;
            saveNotes();
            }
            renderNotes();
        };

        // Сохраняем при потере фокуса или нажатии Enter
        input.addEventListener('blur', saveHandler);
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                saveHandler();
            }
        });
    }

    // Обновите функцию deleteNote
    function deleteNote(e) {
        e.stopPropagation(); // Предотвращаем запуск редактирования
        const index = e.target.dataset.index;
        notes.splice(index, 1);
        saveNotes();
        renderNotes();
    }

    // Регистрация Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(() => console.log('SW registered'))
            .catch(err => console.log('SW error:', err));
    }

    renderNotes(); // Первоначальная загрузка
});