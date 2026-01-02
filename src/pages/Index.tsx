import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

const images = [
  {
    id: 1,
    url: 'https://cdn.poehali.dev/projects/85121e15-6b0a-484d-a79c-12f39ac7ab67/files/9e9f58b3-d0ef-4ab7-96d2-18d9b39c535d.jpg',
    title: 'Момент нежности',
    description: 'Кинематографичный портрет пары'
  },
  {
    id: 2,
    url: 'https://cdn.poehali.dev/projects/85121e15-6b0a-484d-a79c-12f39ac7ab67/files/59b3e2df-fc87-4ba0-b640-ce68b211a61b.jpg',
    title: 'Элегантность',
    description: 'Драматический портрет в стиле нуар'
  },
  {
    id: 3,
    url: 'https://cdn.poehali.dev/projects/85121e15-6b0a-484d-a79c-12f39ac7ab67/files/6ca731be-6e50-4567-af35-52000ad1b38a.jpg',
    title: 'Утренний кофе',
    description: 'Интимный момент за чашкой кофе'
  }
];

export default function Index() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      handleNext();
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex, isPlaying]);

  const handleNext = () => {
    setDirection('next');
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setDirection('prev');
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleDownload = async () => {
    const currentImage = images[currentIndex];
    try {
      const response = await fetch(currentImage.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${currentImage.title}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Фотография загружена');
    } catch (error) {
      toast.error('Ошибка при загрузке');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-[#f5f5f5] mb-3 tracking-tight">
            Галерея
          </h1>
          <p className="text-[#999] text-sm md:text-base font-light">
            Кинематографичные моменты в черно-белом стиле
          </p>
        </header>

        <div className="relative aspect-[9/16] md:aspect-video max-w-4xl mx-auto bg-black rounded-lg overflow-hidden shadow-2xl">
          {images.map((image, idx) => (
            <div
              key={image.id}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                idx === currentIndex
                  ? 'opacity-100 scale-100'
                  : direction === 'next'
                  ? idx === (currentIndex - 1 + images.length) % images.length
                    ? 'opacity-0 scale-95 -translate-x-8'
                    : 'opacity-0 scale-95 translate-x-8'
                  : idx === (currentIndex + 1) % images.length
                  ? 'opacity-0 scale-95 translate-x-8'
                  : 'opacity-0 scale-95 -translate-x-8'
              }`}
            >
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">
                  {image.title}
                </h2>
                <p className="text-sm md:text-base text-gray-300 font-light">
                  {image.description}
                </p>
              </div>
            </div>
          ))}

          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-[#d4af37] text-white hover:text-black transition-all duration-300 rounded-full p-3 backdrop-blur-sm"
            aria-label="Предыдущее фото"
          >
            <Icon name="ChevronLeft" size={24} />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-[#d4af37] text-white hover:text-black transition-all duration-300 rounded-full p-3 backdrop-blur-sm"
            aria-label="Следующее фото"
          >
            <Icon name="ChevronRight" size={24} />
          </button>

          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="bg-black/50 hover:bg-[#d4af37] text-white hover:text-black transition-all duration-300 rounded-full p-3 backdrop-blur-sm"
              aria-label={isPlaying ? 'Пауза' : 'Воспроизвести'}
            >
              <Icon name={isPlaying ? 'Pause' : 'Play'} size={20} />
            </button>
            <button
              onClick={handleDownload}
              className="bg-black/50 hover:bg-[#d4af37] text-white hover:text-black transition-all duration-300 rounded-full p-3 backdrop-blur-sm"
              aria-label="Скачать фото"
            >
              <Icon name="Download" size={20} />
            </button>
          </div>
        </div>

        <div className="flex justify-center items-center gap-3 mt-8">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > currentIndex ? 'next' : 'prev');
                setCurrentIndex(idx);
              }}
              className={`transition-all duration-300 rounded-full ${
                idx === currentIndex
                  ? 'w-12 h-3 bg-[#d4af37]'
                  : 'w-3 h-3 bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Перейти к фото ${idx + 1}`}
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3 md:gap-4 mt-8 max-w-4xl mx-auto">
          {images.map((image, idx) => (
            <button
              key={image.id}
              onClick={() => {
                setDirection(idx > currentIndex ? 'next' : 'prev');
                setCurrentIndex(idx);
              }}
              className={`relative aspect-square rounded-lg overflow-hidden transition-all duration-300 ${
                idx === currentIndex
                  ? 'ring-2 ring-[#d4af37] scale-105'
                  : 'opacity-60 hover:opacity-100 hover:scale-105'
              }`}
            >
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-full object-cover"
              />
              {idx === currentIndex && (
                <div className="absolute inset-0 bg-[#d4af37]/20" />
              )}
            </button>
          ))}
        </div>

        <footer className="text-center mt-12 md:mt-16">
          <p className="text-[#666] text-xs md:text-sm font-light">
            {currentIndex + 1} / {images.length}
          </p>
        </footer>
      </div>
    </div>
  );
}
