
import React from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const Header: React.FC = () => {
  return (
    <header className="border-b border-border py-4 bg-pink-light">
      <div className="container max-w-5xl mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <a href="/" className="logo text-2xl font-bold text-pink-dark">
            Почитай-ка
          </a>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="hidden sm:flex items-center gap-2">
            <Icon name="BookOpen" size={16} />
            <span>О проекте</span>
          </Button>
          
          <Button className="flex items-center gap-2 shadow-md bg-pink-medium hover:bg-pink-dark">
            <Icon name="FileText" size={16} />
            <span>Новая статья</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
