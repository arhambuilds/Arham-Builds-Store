import { motion } from 'motion/react';
import { MessageCircle } from 'lucide-react';
import { cn } from '../lib/utils';

const LIGHT_ROW1 = [
  'https://ik.imagekit.io/3kka2lnk8/Review_1L.png?updatedAt=1772358764722',
  'https://ik.imagekit.io/3kka2lnk8/Review_2L.png?updatedAt=1772358764725',
  'https://ik.imagekit.io/3kka2lnk8/Review_3L.png?updatedAt=1772358764733',
  'https://ik.imagekit.io/3kka2lnk8/Review_4L.png?updatedAt=1772358764737',
];

const LIGHT_ROW2 = [
  'https://ik.imagekit.io/3kka2lnk8/Review_4L.png?updatedAt=1772358764737',
  'https://ik.imagekit.io/3kka2lnk8/Review_3L.png?updatedAt=1772358764733',
  'https://ik.imagekit.io/3kka2lnk8/Review_2L.png?updatedAt=1772358764725',
  'https://ik.imagekit.io/3kka2lnk8/Review_1L.png?updatedAt=1772358764722',
];

export default function Testimonials() {
  const duplicatedLight1 = [...LIGHT_ROW1, ...LIGHT_ROW1, ...LIGHT_ROW1];
  const duplicatedLight2 = [...LIGHT_ROW2, ...LIGHT_ROW2, ...LIGHT_ROW2];

  return (
    <section id="testimonials" className="bg-secondary overflow-hidden relative">
      <div className="section-container !pb-2 md:!pb-4 relative">
        <div className="relative mb-12 md:mb-16">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-3xl md:text-5xl font-extrabold text-heading">
              Client Feedback
            </h2>
            <div className="w-44 md:w-64 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent rounded-full mt-1.5 mb-1" />
            <p className="text-body/60 text-sm md:text-base font-semibold tracking-wide max-w-2xl mx-auto flex items-center gap-2 justify-center">
              <MessageCircle size={16} className="text-primary" />
              Trusted by tens of happy customers worldwide
            </p>
          </div>
        </div>

        <div className="space-y-6 md:space-y-10 relative z-10 -mx-4 md:mx-0">
          {/* Row 1: Slides Left */}
          <div className="group flex overflow-hidden py-2 select-none">
            <div className="flex gap-4 md:gap-8 animate-marquee-left group-hover:[animation-play-state:paused]">
              {duplicatedLight1.map((src, i) => (
                <div 
                  key={`row1-light-${i}`} 
                  className="flex-shrink-0 w-[280px] md:w-[450px] aspect-[16/9] rounded-2xl md:rounded-[2.5rem] overflow-hidden border border-primary/5 shadow-xl bg-white transition-transform duration-500 hover:scale-[1.02]"
                >
                  <img 
                    src={src} 
                    alt={`Review ${i}`} 
                    className="w-full h-full object-contain p-4 md:p-8 pointer-events-none"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Row 2: Slides Right */}
          <div className="group flex overflow-hidden py-2 select-none">
            <div className="flex gap-4 md:gap-8 animate-marquee-right group-hover:[animation-play-state:paused]">
              {duplicatedLight2.map((src, i) => (
                <div 
                  key={`row2-light-${i}`} 
                  className="flex-shrink-0 w-[280px] md:w-[450px] aspect-[16/9] rounded-2xl md:rounded-[2.5rem] overflow-hidden border border-primary/5 shadow-xl bg-white transition-transform duration-500 hover:scale-[1.02]"
                >
                  <img 
                    src={src} 
                    alt={`Review ${i}`} 
                    className="w-full h-full object-contain p-4 md:p-8 pointer-events-none"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gradient Overlays for Fade Effect */}
        <div className="absolute inset-y-0 left-0 w-20 md:w-64 bg-gradient-to-r from-secondary to-transparent z-20 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-20 md:w-64 bg-gradient-to-l from-secondary to-transparent z-20 pointer-events-none"></div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / 3)); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(calc(-100% / 3)); }
          100% { transform: translateX(0); }
        }
        .animate-marquee-left {
          animation: marquee-left 60s linear infinite;
        }
        .animate-marquee-right {
          animation: marquee-right 65s linear infinite;
        }
      `}} />
    </section>
  );
}
