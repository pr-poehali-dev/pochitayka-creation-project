
document.addEventListener('DOMContentLoaded', function() {
  // Основные элементы редактора
  const editor = document.getElementById('pk_editor');
  const title = document.querySelector('.pk_title');
  const author = document.querySelector('.pk_author');
  
  // Панели инструментов
  const textSizePanel = document.getElementById('text-size-panel');
  const textColorPanel = document.getElementById('text-color-panel');
  const linkPanel = document.getElementById('link-panel');
  const imagePanel = document.getElementById('image-panel');
  const videoPanel = document.getElementById('video-panel');
  
  // Кнопки форматирования
  const formattingButtons = document.querySelectorAll('.pk_editor_toolbar [data-command]');
  const textSizeBtn = document.getElementById('text-size-btn');
  const textColorBtn = document.getElementById('text-color-btn');
  const linkBtn = document.getElementById('link-btn');
  const imageBtn = document.getElementById('image-btn');
  const videoBtn = document.getElementById('video-btn');
  
  // Кнопки загрузки и вставки
  const insertLinkBtn = document.getElementById('insert-link');
  const insertImageUrlBtn = document.getElementById('insert-image-url');
  const insertVideoUrlBtn = document.getElementById('insert-video-url');
  
  // Ползунок размера текста
  const sizeSlider = document.getElementById('size-slider');
  const sizePreview = document.getElementById('size-preview');
  
  // Сохранение и публикация
  const saveBtn = document.getElementById('save-btn');
  const publishBtn = document.getElementById('publish-btn');
  
  // Переменные для хранения текущего выделения
  let currentSelection = null;
  let currentRange = null;
  
  // Загружаем сохраненный контент
  loadContent();
  
  // =======================================================
  // Основные функции форматирования
  // =======================================================
  
  // Обработка кнопок форматирования
  formattingButtons.forEach(button => {
    button.addEventListener('click', function() {
      const command = this.dataset.command;
      
      if (command === 'h1' || command === 'h2' || command === 'blockquote') {
        document.execCommand('formatBlock', false, `<${command}>`);
      } else {
        document.execCommand(command, false);
      }
      
      editor.focus();
    });
  });
  
  // Функция для сохранения текущего выделения
  function saveSelection() {
    if (window.getSelection) {
      const sel = window.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
        currentSelection = sel;
        currentRange = sel.getRangeAt(0);
      }
    }
  }
  
  // Функция для восстановления выделения
  function restoreSelection() {
    if (currentSelection && currentRange) {
      if (window.getSelection) {
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(currentRange);
      }
    }
  }
  
  // Обработчик для выделения текста
  editor.addEventListener('mouseup', saveSelection);
  editor.addEventListener('keyup', saveSelection);
  
  // =======================================================
  // Обработка панелей
  // =======================================================
  
  // Функция для закрытия всех панелей
  function closeAllPanels() {
    textSizePanel.classList.remove('active');
    textColorPanel.classList.remove('active');
    linkPanel.classList.remove('active');
    imagePanel.classList.remove('active');
    videoPanel.classList.remove('active');
  }
  
  // Добавляем обработчики для открытия/закрытия панелей
  textSizeBtn.addEventListener('click', function() {
    closeAllPanels();
    textSizePanel.classList.add('active');
  });
  
  textColorBtn.addEventListener('click', function() {
    closeAllPanels();
    textColorPanel.classList.add('active');
  });
  
  linkBtn.addEventListener('click', function() {
    closeAllPanels();
    linkPanel.classList.add('active');
    document.getElementById('link-url').focus();
  });
  
  imageBtn.addEventListener('click', function() {
    closeAllPanels();
    imagePanel.classList.add('active');
  });
  
  videoBtn.addEventListener('click', function() {
    closeAllPanels();
    videoPanel.classList.add('active');
  });
  
  // Обработчики для закрытия панелей
  document.querySelectorAll('.close-panel').forEach(button => {
    button.addEventListener('click', closeAllPanels);
  });
  
  // Обработка клика вне панелей для их закрытия
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.pk_panel') && 
        !e.target.closest('.pk_editor_toolbar')) {
      closeAllPanels();
    }
  });
  
  // =======================================================
  // Обработка вкладок
  // =======================================================
  
  // Переключение вкладок
  document.querySelectorAll('.tab-btn').forEach(tab => {
    tab.addEventListener('click', function() {
      // Находим все вкладки и контент в текущей панели
      const tabsContainer = this.closest('.tabs');
      const tabContent = tabsContainer.parentElement.querySelectorAll('.tab-content');
      
      // Удаляем активный класс у всех вкладок
      tabsContainer.querySelectorAll('.tab-btn').forEach(t => {
        t.classList.remove('active');
      });
      
      // Удаляем активный класс у всего контента
      tabContent.forEach(content => {
        content.classList.remove('active');
      });
      
      // Активируем текущую вкладку
      this.classList.add('active');
      
      // Активируем соответствующий контент
      const targetTab = this.getAttribute('data-tab');
      document.getElementById(targetTab).classList.add('active');
    });
  });
  
  // =======================================================
  // Размер текста
  // =======================================================
  
  // Обновление предпросмотра размера текста
  sizeSlider.addEventListener('input', function() {
    const size = this.value;
    sizePreview.textContent = size + 'px';
    sizePreview.style.fontSize = size + 'px';
  });
  
  // Применение размера текста при отпускании ползунка
  sizeSlider.addEventListener('change', function() {
    const size = this.value;
    
    restoreSelection();
    
    // Используем fontSize для установки размера
    document.execCommand('fontSize', false, '7');
    
    // Находим все элементы с установленным размером и заменяем на точный размер
    const fontElements = document.getElementsByTagName('font');
    for (let i = 0; i < fontElements.length; i++) {
      if (fontElements[i].size === '7') {
        fontElements[i].removeAttribute('size');
        fontElements[i].style.fontSize = size + 'px';
      }
    }
    
    editor.focus();
    closeAllPanels();
  });
  
  // =======================================================
  // Цвет текста
  // =======================================================
  
  // Применение цвета текста
  document.querySelectorAll('.color-btn').forEach(button => {
    button.addEventListener('click', function() {
      const color = this.getAttribute('data-color');
      
      restoreSelection();
      document.execCommand('foreColor', false, color);
      
      editor.focus();
      closeAllPanels();
    });
  });
  
  // =======================================================
  // Ссылки
  // =======================================================
  
  // Добавление ссылки
  insertLinkBtn.addEventListener('click', function() {
    const url = document.getElementById('link-url').value.trim();
    
    if (url) {
      restoreSelection();
      document.execCommand('createLink', false, url);
      
      // Если текст не выделен, вставляем URL как текст ссылки
      if (currentSelection && currentSelection.toString().trim() === '') {
        const linkText = url.replace(/https?:\/\//i, '');
        document.execCommand('insertText', false, linkText);
      }
      
      // Очищаем поле ввода
      document.getElementById('link-url').value = '';
    }
    
    editor.focus();
    closeAllPanels();
  });
  
  // Обработка нажатия Enter в поле URL
  document.getElementById('link-url').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      insertLinkBtn.click();
    }
  });
  
  // =======================================================
  // Изображения
  // =======================================================
  
  // Загрузка изображения с компьютера
  document.getElementById('image-upload').addEventListener('change', function(e) {
    const file = this.files[0];
    if (!file) return;
    
    // Создаем предпросмотр
    const preview = document.getElementById('image-preview');
    preview.innerHTML = '';
    
    const reader = new FileReader();
    reader.onload = function(event) {
      // Создаем изображение для предпросмотра
      const img = document.createElement('img');
      img.src = event.target.result;
      preview.appendChild(img);
      
      // Добавляем кнопку для вставки
      const insertBtn = document.createElement('button');
      insertBtn.textContent = 'Вставить изображение';
      insertBtn.addEventListener('click', function() {
        insertImageFromFile(event.target.result);
      });
      preview.appendChild(insertBtn);
    };
    
    reader.readAsDataURL(file);
  });
  
  // Вставка изображения по URL
  insertImageUrlBtn.addEventListener('click', function() {
    const url = document.getElementById('image-url').value.trim();
    if (url) {
      insertImageFromUrl(url);
      document.getElementById('image-url').value = '';
    }
  });
  
  // Функция для вставки изображения из файла
  function insertImageFromFile(dataUrl) {
    restoreSelection();
    const img = `<img src="${dataUrl}" alt="Изображение">`;
    document.execCommand('insertHTML', false, img);
    
    editor.focus();
    closeAllPanels();
  }
  
  // Функция для вставки изображения по URL
  function insertImageFromUrl(url) {
    restoreSelection();
    const img = `<img src="${url}" alt="Изображение">`;
    document.execCommand('insertHTML', false, img);
    
    editor.focus();
    closeAllPanels();
  }
  
  // =======================================================
  // Видео
  // =======================================================
  
  // Загрузка видео с компьютера
  document.getElementById('video-upload').addEventListener('change', function(e) {
    const file = this.files[0];
    if (!file) return;
    
    // Создаем предпросмотр
    const preview = document.getElementById('video-preview');
    preview.innerHTML = '';
    
    const reader = new FileReader();
    reader.onload = function(event) {
      // Создаем видео для предпросмотра
      const video = document.createElement('video');
      video.controls = true;
      video.src = event.target.result;
      preview.appendChild(video);
      
      // Добавляем кнопку для вставки
      const insertBtn = document.createElement('button');
      insertBtn.textContent = 'Вставить видео';
      insertBtn.addEventListener('click', function() {
        insertVideoFromFile(event.target.result, file.type);
      });
      preview.appendChild(insertBtn);
    };
    
    reader.readAsDataURL(file);
  });
  
  // Вставка видео по URL
  insertVideoUrlBtn.addEventListener('click', function() {
    const url = document.getElementById('video-url').value.trim();
    if (url) {
      insertVideoFromUrl(url);
      document.getElementById('video-url').value = '';
    }
  });
  
  // Функция для вставки видео из файла
  function insertVideoFromFile(dataUrl, type) {
    restoreSelection();
    const video = `
      <div class="video-container">
        <video controls>
          <source src="${dataUrl}" type="${type}">
          Ваш браузер не поддерживает видео.
        </video>
      </div>
    `;
    document.execCommand('insertHTML', false, video);
    
    editor.focus();
    closeAllPanels();
  }
  
  // Функция для вставки видео по URL
  function insertVideoFromUrl(url) {
    restoreSelection();
    
    let embedUrl = url;
    
    // Преобразование YouTube URL в embed URL
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1].split('&')[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1].split('?')[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }
    
    const iframe = `
      <div class="video-container">
        <iframe src="${embedUrl}" frameborder="0" allowfullscreen></iframe>
      </div>
    `;
    document.execCommand('insertHTML', false, iframe);
    
    editor.focus();
    closeAllPanels();
  }
  
  // =======================================================
  // Сохранение и загрузка контента
  // =======================================================
  
  // Сохранение контента
  function saveContent() {
    const content = {
      title: title.innerHTML,
      author: author.innerHTML,
      content: editor.innerHTML,
      lastSaved: new Date().toISOString()
    };
    
    localStorage.setItem('pochitayka-content', JSON.stringify(content));
    
    // Обновляем дату последнего сохранения
    const timeElement = document.querySelector('time');
    const date = new Date();
    timeElement.textContent = formatDate(date);
    timeElement.setAttribute('datetime', date.toISOString());
    
    // Показываем уведомление
    showNotification('Сохранено!');
  }
  
  // Загрузка сохраненного контента
  function loadContent() {
    const savedContent = localStorage.getItem('pochitayka-content');
    
    if (savedContent) {
      try {
        const content = JSON.parse(savedContent);
        
        title.innerHTML = content.title || '';
        author.innerHTML = content.author || '';
        editor.innerHTML = content.content || '<p><br></p>';
        
        // Устанавливаем время последнего сохранения
        if (content.lastSaved) {
          const timeElement = document.querySelector('time');
          const date = new Date(content.lastSaved);
          timeElement.textContent = formatDate(date);
          timeElement.setAttribute('datetime', content.lastSaved);
        }
      } catch (e) {
        console.error('Ошибка при загрузке сохраненного контента:', e);
      }
    }
  }
  
  // Добавляем обработчики для сохранения и публикации
  saveBtn.addEventListener('click', saveContent);
  
  publishBtn.addEventListener('click', function() {
    saveContent();
    showNotification('Публикация успешна!');
  });
  
  // Автосохранение каждые 30 секунд
  setInterval(saveContent, 30000);
  
  // =======================================================
  // Вспомогательные функции
  // =======================================================
  
  // Форматирование даты
  function formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${day}.${month}.${year}, ${hours}:${minutes}`;
  }
  
  // Функция для отображения уведомлений
  function showNotification(message) {
    // Удаляем существующие уведомления
    const existingNotifications = document.querySelectorAll('.pk_notification');
    existingNotifications.forEach(notif => {
      document.body.removeChild(notif);
    });
    
    // Создаем новое уведомление
    const notification = document.createElement('div');
    notification.className = 'pk_notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Анимируем появление
    setTimeout(() => {
      notification.classList.add('active');
    }, 10);
    
    // Автоматически скрываем через 3 секунды
    setTimeout(() => {
      notification.classList.remove('active');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }
  
  // Горячие клавиши
  document.addEventListener('keydown', function(e) {
    // Ctrl+B: Жирный
    if (e.ctrlKey && e.key === 'b') {
      e.preventDefault();
      document.execCommand('bold', false);
    } 
    // Ctrl+I: Курсив
    else if (e.ctrlKey && e.key === 'i') {
      e.preventDefault();
      document.execCommand('italic', false);
    } 
    // Ctrl+U: Подчеркнутый
    else if (e.ctrlKey && e.key === 'u') {
      e.preventDefault();
      document.execCommand('underline', false);
    } 
    // Ctrl+K: Ссылка
    else if (e.ctrlKey && e.key === 'k') {
      e.preventDefault();
      closeAllPanels();
      linkPanel.classList.add('active');
      document.getElementById('link-url').focus();
    }
    // Ctrl+S: Сохранить
    else if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      saveContent();
    }
  });
});
