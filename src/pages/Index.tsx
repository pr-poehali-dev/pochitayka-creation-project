
import React from 'react';
import Header from '@/components/Header';
import Editor from '@/components/Editor';
import Footer from '@/components/Footer';

const Index: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow py-8">
        <Editor />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
