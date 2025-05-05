
document.addEventListener('DOMContentLoaded', function() {
  // Получаем ссылки на основные элементы
  const editor = document.getElementById('_pk_editor');
  const title = document.querySelector('.pk_title');
  const author = document.querySelector('.pk_author');
  const tooltip = document.getElementById('_pk_tooltip');
  const mediaPanel = document.getElementById('_pk_media');
  
  let currentSelection = null;
  let currentRange = null;
  
  // Загружаем сохраненный контент при загрузке страницы
  loadContent();
  
  // Отслеживаем выделение текста
  document.addEventListener('selectionchange', updateSelection);
  
  // Обработчики кнопок форматирования
  document.getElementById('_bold_button').addEventListener('click', () => formatText('bold'));
  document.getElementById('_italic_button').addEventListener('click', () => formatText('italic'));
  document.getElementById('_underline_button').addEventListener('click', () => formatText('underline'));
  document.getElementById('_header_button').addEventListener('click', () => formatText('h1'));
  document.getElementById('_subheader_button').addEventListener('click', () => formatText('h2'));
  document.getElementById('_quote_button').addEventListener('click', () => formatText('blockquote'));
  
  // Обработчики для работы со ссылками
  document.getElementById('_link_button').addEventListener('click', showLinkPrompt);
  document.querySelector('#link_prompt .prompt_submit').addEventListener('click', addLink);
  
  // Обработчики для размера и цвета текста
  document.getElementById('_text_size_button').addEventListener('click', showTextSizePrompt);
  const sizeSlider = document.querySelector('.size_slider');
  sizeSlider.addEventListener('input', updateSizePreview);
  
  document.getElementById('_text_color_button').addEventListener('click', showTextColorPrompt);
  const colorButtons = document.querySelectorAll('.color_btn');
  colorButtons.forEach(btn => {
    btn.addEventListener('click', () => changeTextColor(btn.dataset.color));
  });
  
  // Обработчики для медиа-контента
  document.getElementById('_image_button').addEventListener('click', showImagePrompt);
  document.getElementById('_video_button').addEventListener('click', showVideoPrompt);
  
  // Обработчики для переключения вкладок
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const tabContainer = this.closest('.media_tabs');
      const tabContents = tabContainer.parentElement.querySelectorAll('.tab_content');
      
      // Удаляем активный класс со всех вкладок и контента
      tabContainer.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      
      // Активируем выбранную вкладку и соответствующий контент
      this.classList.add('active');
      const tabId = this.dataset.tab + '_tab';
      document.getElementById(tabId)?.classList.add('active');
    });
  });
  
  // Обработчики для загрузки файлов
  const fileInputs = document.querySelectorAll('.file_input');
  fileInputs.forEach(input => {
    input.addEventListener('change', handleFileSelect);
  });
  
  // Обработчики кнопок закрытия
  const closeButtons = document.querySelectorAll('.close');
  closeButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      this.closest('.prompt').classList.remove('active');
      hideToolbars();
    });
  });
  
  // Кнопки сохранения и публикации
  document.getElementById('_save_button').addEventListener('click', saveContent);
  document.getElementById('_publish_button').addEventListener('click', publishContent);
  
  // Обработчики для добавления медиа по ссылке
  document.querySelectorAll('.media_submit').forEach((btn, index) => {
    btn.addEventListener('click', function() {
      const input = this.previousElementSibling;
      if (index === 0) { // Изображение
        addImageFromUrl(input.value);
      } else { // Видео
        addVideoFromUrl(input.value);
      }
      input.value = '';
      hideToolbars();
    });
  });
  
  // Горячие клавиши
  editor.addEventListener('keydown', handleKeyDown);
  
  // Функция обновления выбора текста
  function updateSelection() {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      currentSelection = selection;
      currentRange = selection.getRangeAt(0);
      
      // Показываем панель инструментов при выделении текста
      if (!selection.isCollapsed && 
          (editor.contains(selection.anchorNode) || editor.contains(selection.focusNode))) {
        const rangeRect = currentRange.getBoundingClientRect();
        const editorRect = editor.getBoundingClientRect();
        
        // Позиционируем панель над выделенным текстом
        tooltip.style.top = (rangeRect.top - tooltip.offsetHeight - 10) + 'px';
        tooltip.style.left = (rangeRect.left + (rangeRect.width / 2) - (tooltip.offsetWidth / 2)) + 'px';
        tooltip.classList.add('active');
        
        // Позиционируем панель медиа слева от выделения
        mediaPanel.style.top = rangeRect.top + 'px';
        mediaPanel.style.left = (editorRect.left - mediaPanel.offsetWidth - 10) + 'px';
        mediaPanel.classList.add('active');
      } else {
        hideToolbars();
      }
    }
  }
  
  // Скрыть панели инструментов
  function hideToolbars() {
    tooltip.classList.remove('active');
    mediaPanel.classList.remove('active');
    document.querySelectorAll('.prompt').forEach(p => p.classList.remove('active'));
  }
  
  // Форматирование текста
  function formatText(format) {
    if (!currentSelection) return;
    
    // Восстанавливаем выделение
    restoreSelection();
    
    if (format === 'h1' || format === 'h2' || format === 'blockquote') {
      document.execCommand('formatBlock', false, `<${format}>`);
    } else {
      document.execCommand(format, false);
    }
    
    hideToolbars();
  }
  
  // Показать промпт для ссылки
  function showLinkPrompt() {
    document.querySelectorAll('.prompt').forEach(p => p.classList.remove('active'));
    document.getElementById('link_prompt').classList.add('active');
    document.querySelector('#link_prompt .prompt_input').focus();
  }
  
  // Добавить ссылку
  function addLink() {
    const url = document.querySelector('#link_prompt .prompt_input').value.trim();
    if (url) {
      restoreSelection();
      document.execCommand('createLink', false, url);
    }
    document.querySelector('#link_prompt .prompt_input').value = '';
    hideToolbars();
  }
  
  // Показать промпт для размера текста
  function showTextSizePrompt() {
    document.querySelectorAll('.prompt').forEach(p => p.classList.remove('active'));
    document.getElementById('text_size_prompt').classList.add('active');
    
    // Если в выделении есть текст с размером, установим ползунок
    if (currentSelection) {
      const size = getFontSizeFromSelection();
      if (size) {
        document.querySelector('.size_slider').value = size;
        updateSizePreview();
      }
    }
  }
  
  // Обновить предпросмотр размера текста
  function updateSizePreview() {
    const size = document.querySelector('.size_slider').value;
    document.querySelector('.size_preview').textContent = `${size}px`;
    document.querySelector('.size_preview').style.fontSize = `${size}px`;
    
    // Применяем размер к тексту
    restoreSelection();
    changeTextSize(size);
  }
  
  // Изменить размер текста
  function changeTextSize(size) {
    if (!currentSelection) return;
    
    // Используем fontSize для смены размера
    document.execCommand('fontSize', false, '7');
    
    // Заменяем размер на точный
    const fontElements = document.getElementsByTagName('font');
    for (let i = 0; i < fontElements.length; i++) {
      if (fontElements[i].size === '7') {
        fontElements[i].removeAttribute('size');
        fontElements[i].style.fontSize = `${size}px`;
      }
    }
  }
  
  // Получить размер шрифта из выделения
  function getFontSizeFromSelection() {
    if (!currentSelection) return null;
    
    const node = currentSelection.anchorNode;
    if (node.nodeType === 3) { // Текстовый узел
      const parentStyle = window.getComputedStyle(node.parentNode);
      const fontSize = parseInt(parentStyle.fontSize);
      return fontSize;
    }
    return 16; // По умолчанию
  }
  
  // Показать промпт для цвета текста
  function showTextColorPrompt() {
    document.querySelectorAll('.prompt').forEach(p => p.classList.remove('active'));
    document.getElementById('text_color_prompt').classList.add('active');
  }
  
  // Изменить цвет текста
  function changeTextColor(color) {
    if (!currentSelection) return;
    
    restoreSelection();
    document.execCommand('foreColor', false, color);
    hideToolbars();
  }
  
  // Показать промпт для изображения
  function showImagePrompt() {
    document.querySelectorAll('.prompt').forEach(p => p.classList.remove('active'));
    document.getElementById('image_prompt').classList.add('active');
    document.querySelector('#url_tab .media_input').focus();
  }
  
  // Показать промпт для видео
  function showVideoPrompt() {
    document.querySelectorAll('.prompt').forEach(p => p.classList.remove('active'));
    document.getElementById('video_prompt').classList.add('active');
    document.querySelector('#video_url_tab .media_input').focus();
  }
  
  // Обработка выбора файла
  function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const previewContainer = event.target.nextElementSibling;
    previewContainer.innerHTML = '';
    
    const isVideo = file.type.startsWith('video/');
    
    if (isVideo) {
      // Предпросмотр видео
      const video = document.createElement('video');
      video.controls = true;
      video.src = URL.createObjectURL(file);
      previewContainer.appendChild(video);
      
      // Кнопка для вставки видео
      const insertBtn = document.createElement('button');
      insertBtn.textContent = 'Вставить видео';
      insertBtn.className = 'media_submit';
      insertBtn.addEventListener('click', () => {
        addVideoFromFile(file);
        hideToolbars();
        event.target.value = '';
        previewContainer.innerHTML = '';
      });
      previewContainer.appendChild(insertBtn);
    } else {
      // Предпросмотр изображения
      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);
      previewContainer.appendChild(img);
      
      // Кнопка для вставки изображения
      const insertBtn = document.createElement('button');
      insertBtn.textContent = 'Вставить изображение';
      insertBtn.className = 'media_submit';
      insertBtn.addEventListener('click', () => {
        addImageFromFile(file);
        hideToolbars();
        event.target.value = '';
        previewContainer.innerHTML = '';
      });
      previewContainer.appendChild(insertBtn);
    }
  }
  
  // Добавить изображение из файла
  function addImageFromFile(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      restoreSelection();
      const img = `<img src="${e.target.result}" alt="Загруженное изображение">`;
      document.execCommand('insertHTML', false, img);
    };
    reader.readAsDataURL(file);
  }
  
  // Добавить изображение по URL
  function addImageFromUrl(url) {
    if (!url) return;
    
    restoreSelection();
    const img = `<img src="${url}" alt="Изображение">`;
    document.execCommand('insertHTML', false, img);
  }
  
  // Добавить видео из файла
  function addVideoFromFile(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      restoreSelection();
      const video = `
        <div class="video-container">
          <video controls>
            <source src="${e.target.result}" type="${file.type}">
            Ваш браузер не поддерживает видео.
          </video>
        </div>
      `;
      document.execCommand('insertHTML', false, video);
    };
    reader.readAsDataURL(file);
  }
  
  // Добавить видео по URL
  function addVideoFromUrl(url) {
    if (!url) return;
    
    let embedUrl = url;
    
    // Конвертировать YouTube URL в embed URL
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1].split('&')[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }
    
    restoreSelection();
    const iframe = `
      <div class="video-container">
        <iframe src="${embedUrl}" frameborder="0" allowfullscreen></iframe>
      </div>
    `;
    document.execCommand('insertHTML', false, iframe);
  }
  
  // Восстановить выделение
  function restoreSelection() {
    if (currentSelection && currentRange) {
      currentSelection.removeAllRanges();
      currentSelection.addRange(currentRange);
    }
  }
  
  // Обработка горячих клавиш
  function handleKeyDown(e) {
    // Ctrl+B: Жирный
    if (e.ctrlKey && e.key === 'b') {
      e.preventDefault();
      formatText('bold');
    }
    // Ctrl+I: Курсив
    else if (e.ctrlKey && e.key === 'i') {
      e.preventDefault();
      formatText('italic');
    }
    // Ctrl+U: Подчеркнутый
    else if (e.ctrlKey && e.key === 'u') {
      e.preventDefault();
      formatText('underline');
    }
    // Ctrl+K: Ссылка
    else if (e.ctrlKey && e.key === 'k') {
      e.preventDefault();
      showLinkPrompt();
    }
    // Ctrl+S: Сохранить
    else if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      saveContent();
    }
  }
  
  // Сохранение контента
  function saveContent() {
    const content = {
      title: title.innerHTML,
      author: author.innerHTML,
      content: editor.innerHTML,
      lastSaved: new Date().toISOString()
    };
    
    localStorage.setItem('pochitayka-content', JSON.stringify(content));
    
    // Показать уведомление о сохранении
    showNotification('Сохранено!');
  }
  
  // Загрузка контента
  function loadContent() {
    const savedContent = localStorage.getItem('pochitayka-content');
    if (savedContent) {
      try {
        const content = JSON.parse(savedContent);
        title.innerHTML = content.title || '';
        author.innerHTML = content.author || '';
        editor.innerHTML = content.content || '<p><br></p>';
        
        // Установить время последнего сохранения
        if (content.lastSaved) {
          const time = document.querySelector('time');
          const date = new Date(content.lastSaved);
          time.textContent = formatDate(date);
          time.setAttribute('datetime', content.lastSaved);
        }
      } catch (e) {
        console.error('Ошибка при загрузке сохраненного контента:', e);
      }
    }
  }
  
  // Публикация контента
  function publishContent() {
    // Здесь можно добавить логику публикации
    // Пока просто сохраняем и показываем уведомление
    saveContent();
    showNotification('Опубликовано!');
  }
  
  // Показать уведомление
  function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.background = 'var(--primary-color)';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '4px';
    notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s';
    
    document.body.appendChild(notification);
    
    // Анимация появления и исчезновения
    setTimeout(() => {
      notification.style.opacity = '1';
    }, 10);
    
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }
  
  // Форматирование даты
  function formatDate(date) {
    const months = [
      'Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня',
      'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'
    ];
    
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${day} ${month} ${year}, ${hours}:${minutes}`;
  }
});
