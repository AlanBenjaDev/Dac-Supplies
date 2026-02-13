"use client";
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'next/image';
import { ArrowRight, Zap } from "lucide-react";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { Navigation, Pagination, Mousewheel, Keyboard, Autoplay } from 'swiper/modules';

export default function Hero() {
  const slides = [
    { 
      src: "/proteinas.jpg", 
      title: "POTENCIÁ TU", 
      highlight: "RENDIMIENTO", 
      desc: "Suplementos de grado profesional para atletas exigentes." 
    },
    { 
      src: "/Gemini_Generated_Image_jwejjjwejjjwejjj.jpg", 
      title: "BIENESTAR &", 
      highlight: "VITALIDAD", 
      desc: "Vitaminas y minerales diseñados para tu equilibrio diario." 
    },
    { 
      src: "/Gemini_Generated_Image_us9rjnus9rjnus9r.jpg", 
      title: "RECUPERACIÓN", 
      highlight: "MAXIMA", 
      desc: "Aminoácidos de absorción rápida para post-entrenos intensos." 
    },
  ];

  return (
    <section className="bg-white py-6"> 
      <div className="max-w-7xl mx-auto px-4">
        <Swiper
          navigation={true}
          pagination={{ clickable: true, dynamicBullets: true }}
          loop={true}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          modules={[Navigation, Pagination, Mousewheel, Keyboard, Autoplay]}
          className="mySwiper rounded-sm overflow-hidden"
          style={{
            "--swiper-navigation-color": "#000", 
            "--swiper-pagination-color": "#000",
            "--swiper-navigation-size": "20px",
          }}
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index} className="relative group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
              
              <Image
                src={slide.src}
                alt={slide.title}
                width={1920}
                height={800}
                className="w-full h-[400px] md:h-[550px] object-cover transition-transform duration-[10s] group-hover:scale-110"
                priority={index === 0}
              />
              
              {/* Contenido del Slide */}
              <div className="absolute inset-0 z-20 flex flex-col justify-center px-8 md:px-20 max-w-3xl">
                <div className="flex items-center gap-2 mb-4 animate-fade-in">
                  <div className="h-[1px] w-8 bg-white/50" />
                  <span className="text-white text-[10px] font-bold uppercase tracking-[0.4em]">
                    DAC Suplementos
                  </span>
                </div>
                
                <h2 className="text-4xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter mb-4">
                  {slide.title} <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-500 italic font-light">
                    {slide.highlight}
                  </span>
                </h2>
                
                <p className="text-gray-300 text-sm md:text-lg mb-8 max-w-md font-medium leading-relaxed">
                  {slide.desc}
                </p>

                <div className="flex items-center gap-4">
                  <button className="bg-white text-black px-8 py-4 text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-black hover:text-white transition-all duration-300 shadow-2xl">
                    Ver Catálogo <ArrowRight size={14} />
                  </button>
                  <div className="hidden md:flex items-center gap-2 text-white/60 text-[10px] font-bold uppercase tracking-widest">
                    <Zap size={14} className="text-yellow-400 fill-yellow-400" /> 
                    Envío Express CABA
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
