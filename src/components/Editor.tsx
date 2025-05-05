
import React, { useState, useRef, useEffect } from 'react';
import EditorToolbar from './EditorToolbar';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

interface EditorProps {
  initialContent?: string;
}

const Editor: React.FC<EditorProps> = ({ initialContent = '' }) => {
  const [title, setTitle] = useState('');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  // Загрузить сохраненный контент при первом рендере
  useEffect(() => {
    const savedTitle = localStorage.getItem('почитай-ка-title');
    const savedContent = localStorage.getItem('почитай-ка-content');
    const savedTime = localStorage.getItem('почитай-ка-saved-time');
    
    if (savedTitle) setTitle(savedTitle);
    if (editorRef.current && savedContent) {
      editorRef.current.innerHTML = savedContent;
    } else if (editorRef.current && initialContent) {
      editorRef.current.innerHTML = initialContent;
    }
    
    if (savedTime) {
      setLastSaved(new Date(savedTime));
    }
  }, [initialContent]);

  // Функция сохранения контента
  const saveContent = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      localStorage.setItem('почитай-ка-title', title);
      localStorage.setItem('почитай-ка-content', content);
      const now = new Date();
      localStorage.setItem('почитай-ка-saved-time', now.toISOString());
      setLastSaved(now);
      toast({
        title: "Сохранено",
        description: "Ваш документ успешно сохранен"
      });
    }
  };

  // Функции для работы с форматированием текста
  const handleFormatText = (format: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    
    if (format === 'h1' || format === 'h2' || format === 'quote') {
      const formatTag = format === 'quote' ? 'blockquote' : format;
      document.execCommand('formatBlock', false, `<${formatTag}>`);
    } else {
      document.execCommand(format, false);
    }
  };

  const handleAddLink = (url: string) => {
    document.execCommand('createLink', false, url);
  };

  const handleAddImage = (imageData: string | File) => {
    if (typeof imageData === 'string') {
      document.execCommand('insertHTML', false, `<img src="${imageData}" alt="Изображение" />`);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === 'string') {
          document.execCommand('insertHTML', false, `<img src="${e.target.result}" alt="Изображение" />`);
        }
      };
      reader.readAsDataURL(imageData);
    }
  };

  const handleAddVideo = (videoUrl: string) => {
    let embedUrl = videoUrl;
    
    // Преобразуем YouTube URL в embed URL
    if (videoUrl.includes('youtube.com/watch?v=')) {
      const videoId = videoUrl.split('v=')[1].split('&')[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (videoUrl.includes('youtu.be/')) {
      const videoId = videoUrl.split('youtu.be/')[1];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }
    
    const iframe = `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;max-width:100%;">
      <iframe 
        style="position:absolute;top:0;left:0;width:100%;height:100%;" 
        src="${embedUrl}" 
        frameborder="0" 
        allowfullscreen>
      </iframe>
    </div>`;
    
    document.execCommand('insertHTML', false, iframe);
  };

  const handleChangeFontSize = (size: number) => {
    document.execCommand('fontSize', false, '7');
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const fontElements = document.getElementsByTagName('font');
    for (let i = 0; i < fontElements.length; i++) {
      if (fontElements[i].size === '7') {
        fontElements[i].removeAttribute('size');
        fontElements[i].style.fontSize = `${size}px`;
      }
    }
  };

  const handleChangeTextColor = (color: string) => {
    document.execCommand('foreColor', false, color);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + 
      ', ' + date.toLocaleDateString();
  };

  return (
    <div className="flex flex-col items-center px-4 py-8 max-w-3xl mx-auto">
      <div className="w-full mb-8">
        <input
          type="text"
          placeholder="Заголовок..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-4xl font-bold border-none outline-none bg-transparent text-foreground placeholder:text-muted-foreground px-0"
        />
      </div>
      
      <EditorToolbar
        onFormatText={handleFormatText}
        onAddLink={handleAddLink}
        onAddImage={handleAddImage}
        onAddVideo={handleAddVideo}
        onChangeFontSize={handleChangeFontSize}
        onChangeTextColor={handleChangeTextColor}
      />
      
      <div className="w-full mt-4">
        <div
          ref={editorRef}
          contentEditable
          className="editor-content prose prose-pink max-w-none focus:outline-none"
          placeholder="Начните писать..."
        />
      </div>
      
      <div className="w-full flex justify-between items-center mt-8 text-sm text-muted-foreground">
        <div>
          {lastSaved && (
            <span>Последнее сохранение: {formatDate(lastSaved)}</span>
          )}
        </div>
        <Button onClick={saveContent} className="flex items-center gap-2">
          <Save size={16} />
          Сохранить
        </Button>
      </div>
    </div>
  );
};

export default Editor;
