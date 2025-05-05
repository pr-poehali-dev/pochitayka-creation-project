
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Bold, 
  Italic, 
  Underline, 
  Heading1, 
  Heading2, 
  Quote, 
  Link, 
  Image as ImageIcon, 
  Video, 
  Type,
  Palette
} from 'lucide-react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditorToolbarProps {
  onFormatText: (format: string) => void;
  onAddLink: (url: string) => void;
  onAddImage: (imageData: string | File) => void;
  onAddVideo: (videoUrl: string) => void;
  onChangeFontSize: (size: number) => void;
  onChangeTextColor: (color: string) => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  onFormatText,
  onAddLink,
  onAddImage,
  onAddVideo,
  onChangeFontSize,
  onChangeTextColor
}) => {
  const [linkUrl, setLinkUrl] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState('');
  const [videoUrl, setVideoUrl] = React.useState('');
  const [fontSize, setFontSize] = React.useState(18);
  const imageFileRef = React.useRef<HTMLInputElement>(null);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onAddImage(files[0]);
    }
  };

  const handleFontSizeChange = (value: number[]) => {
    const newSize = value[0];
    setFontSize(newSize);
    onChangeFontSize(newSize);
  };

  return (
    <div className="editor-toolbar p-2 flex flex-wrap gap-1 justify-center">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => onFormatText('bold')}
        title="Жирный"
      >
        <Bold size={18} />
      </Button>
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => onFormatText('italic')}
        title="Курсив"
      >
        <Italic size={18} />
      </Button>
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => onFormatText('underline')}
        title="Подчеркнутый"
      >
        <Underline size={18} />
      </Button>
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => onFormatText('h1')}
        title="Заголовок"
      >
        <Heading1 size={18} />
      </Button>
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => onFormatText('h2')}
        title="Подзаголовок"
      >
        <Heading2 size={18} />
      </Button>
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => onFormatText('quote')}
        title="Цитата"
      >
        <Quote size={18} />
      </Button>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" title="Ссылка">
            <Link size={18} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <h4 className="font-medium">Добавить ссылку</h4>
            <div className="flex gap-2">
              <Input
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
              />
              <Button 
                onClick={() => {
                  if (linkUrl) {
                    onAddLink(linkUrl);
                    setLinkUrl('');
                  }
                }}
              >
                Добавить
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" title="Изображение">
            <ImageIcon size={18} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <Tabs defaultValue="url">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="url">По ссылке</TabsTrigger>
              <TabsTrigger value="upload">Загрузить</TabsTrigger>
            </TabsList>
            <TabsContent value="url" className="grid gap-4">
              <h4 className="font-medium mt-2">Добавить изображение по ссылке</h4>
              <div className="flex gap-2">
                <Input
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
                <Button 
                  onClick={() => {
                    if (imageUrl) {
                      onAddImage(imageUrl);
                      setImageUrl('');
                    }
                  }}
                >
                  Добавить
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="upload" className="grid gap-4">
              <h4 className="font-medium mt-2">Загрузить изображение</h4>
              <div className="flex flex-col gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  ref={imageFileRef}
                  onChange={handleImageFileChange}
                />
              </div>
            </TabsContent>
          </Tabs>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" title="Видео">
            <Video size={18} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <h4 className="font-medium">Добавить видео</h4>
            <div className="flex gap-2">
              <Input
                placeholder="https://youtube.com/watch?v=..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
              <Button 
                onClick={() => {
                  if (videoUrl) {
                    onAddVideo(videoUrl);
                    setVideoUrl('');
                  }
                }}
              >
                Добавить
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" title="Размер текста">
            <Type size={18} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <h4 className="font-medium">Размер текста</h4>
            <div className="flex items-center gap-2">
              <span className="text-sm">12px</span>
              <Slider 
                defaultValue={[18]} 
                max={48} 
                min={12} 
                step={1}
                value={[fontSize]}
                onValueChange={handleFontSizeChange}
                className="flex-1" 
              />
              <span className="text-sm">48px</span>
            </div>
            <div className="text-center">
              <span style={{ fontSize: `${fontSize}px` }}>
                {fontSize}px
              </span>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" title="Цвет текста">
            <Palette size={18} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <h4 className="font-medium">Цвет текста</h4>
            <Select onValueChange={onChangeTextColor}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите цвет" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inherit">По умолчанию</SelectItem>
                <SelectItem value="#000000">Черный</SelectItem>
                <SelectItem value="#333333">Темно-серый</SelectItem>
                <SelectItem value="#666666">Серый</SelectItem>
                <SelectItem value="#EC4899">Розовый</SelectItem>
                <SelectItem value="#BE185D">Малиновый</SelectItem>
                <SelectItem value="#DC2626">Красный</SelectItem>
                <SelectItem value="#EA580C">Оранжевый</SelectItem>
                <SelectItem value="#D97706">Янтарный</SelectItem>
                <SelectItem value="#65A30D">Зеленый</SelectItem>
                <SelectItem value="#0891B2">Голубой</SelectItem>
                <SelectItem value="#2563EB">Синий</SelectItem>
                <SelectItem value="#7C3AED">Фиолетовый</SelectItem>
              </SelectContent>
            </Select>
            <div className="grid grid-cols-5 gap-2">
              {['#000000', '#333333', '#666666', '#EC4899', '#BE185D', 
                '#DC2626', '#EA580C', '#D97706', '#65A30D', '#0891B2', 
                '#2563EB', '#7C3AED'].map((color) => (
                <div 
                  key={color}
                  className="w-8 h-8 rounded-full cursor-pointer border"
                  style={{ backgroundColor: color }}
                  onClick={() => onChangeTextColor(color)}
                />
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default EditorToolbar;
