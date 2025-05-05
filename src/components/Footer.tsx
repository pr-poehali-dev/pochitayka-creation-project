
import React from 'react';
import Icon from '@/components/ui/icon';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border py-8 bg-pink-light mt-auto">
      <div className="container max-w-5xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="logo text-xl font-bold text-pink-dark mb-2">
              Почитай-ка
            </p>
            <p className="text-sm text-muted-foreground">
              Минималистичный редактор для ваших публикаций
            </p>
          </div>
          
          <div className="flex gap-4">
            <a href="#" className="text-pink-dark hover:text-pink-medium transition-colors">
              <Icon name="Github" size={24} />
            </a>
            <a href="#" className="text-pink-dark hover:text-pink-medium transition-colors">
              <Icon name="Mail" size={24} />
            </a>
            <a href="#" className="text-pink-dark hover:text-pink-medium transition-colors">
              <Icon name="Twitter" size={24} />
            </a>
          </div>
        </div>
        
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Почитай-ка. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
