import { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import About from './About';

export default function AboutPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-secondary min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 md:pt-32 pb-20 relative overflow-hidden">
        <About isFullPage={true} showBackLink={true} />
      </main>
      <Footer />
    </div>
  );
}
