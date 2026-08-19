import React from 'react';
import Header from '../landing/Header';
import Footer from '../landing/Footer';

export default function PageLayout({ children, onLoginClick, onRegisterClick }) {
  return (
    <div className="min-h-screen flex flex-col bg-surface-base font-sans text-content-primary">
      <Header onLoginClick={onLoginClick} onRegisterClick={onRegisterClick} />
      <main className="flex-grow pt-24 pb-12 px-4 container mx-auto max-w-4xl">
        {children}
      </main>
      <Footer />
    </div>
  );
}
