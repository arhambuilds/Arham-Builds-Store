import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Contact({ showFormOnMobile = false, isFullPage = false }: { showFormOnMobile?: boolean, isFullPage?: boolean }) {
  return (
    <section id={isFullPage ? undefined : "contact"} className="bg-secondary">
      <div className={cn("section-container relative z-10", isFullPage ? "pt-2 md:pt-4" : "!pt-8 md:!pt-12")}>
        <div className="relative mb-8 lg:mb-12">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-3xl md:text-5xl font-extrabold text-heading">
              Contact With Me
            </h2>
            <div className="w-44 md:w-64 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent rounded-full mt-1.5 mb-1" />
            <p className="text-body/60 text-sm md:text-base font-semibold tracking-wide">
              Let's discuss your next big project
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-8 lg:gap-12 items-start">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-6 lg:p-8 lg:pb-12 rounded-3xl bg-secondary card-shadow space-y-8 lg:space-y-10"
          >
            <div className="rounded-2xl overflow-hidden aspect-[16/10]">
              <img
                src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgV4_PzmTUKmZfLipz0IZOO5cMvwqNvfX1zIQrv19tqdMzCd3qNRmbcqgLzeY-nfdCl-Y_3KbaToX3lLgamK1wbKH9We_0RdavOm4Ci24K6cVz0RorQK95k8aGSdh2lRMz0pyCdoVzKYFgN0cQQwerenIipHrNAYHDa2h61HIejBn07XpGX3SxOHnj9JA/s320/Arham-Adib-Logo.jpg"
                alt="Contact representation"
                className="w-full h-full object-cover transition-all duration-500"
              />
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl lg:text-3xl font-extrabold text-heading">Arham Adib</h3>
                <p className="text-body/70 text-sm lg:text-base">Chief Product Officer at Arham Stores</p>
              </div>
              
              <p className="text-body leading-relaxed max-w-sm text-sm lg:text-base">
                I am available for freelance work. Connect with me via and call in to my account.
              </p>
              
              <div className="space-y-4">
                <a href="tel:+919296386448" className="flex items-center gap-4 text-body hover:text-primary transition-colors group">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-lg bg-secondary card-shadow group-hover:text-primary transition-all">
                    <Phone size={18} className="lg:size-5" />
                  </div>
                  <span className="font-semibold text-sm lg:text-base">+91 9296 386 448</span>
                </a>
                <a href="mailto:bussiness@arhamadib.in" className="flex items-center gap-4 text-body hover:text-primary transition-colors group text-xs sm:text-base">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-lg bg-secondary card-shadow group-hover:text-primary transition-all shrink-0">
                    <Mail size={18} className="lg:size-5" />
                  </div>
                  <span className="font-semibold truncate">bussiness@arhamadib.in</span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={cn(
              "p-8 md:p-12 lg:p-16 rounded-[2.5rem] bg-white border border-primary/5 shadow-2xl shadow-primary/5",
              !showFormOnMobile && "hidden lg:block"
            )}
          >
            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              <div className="grid md:grid-cols-2 gap-6 lg:gap-10">
                <InputField label="FIRST NAME" type="text" placeholder="John" />
                <InputField label="LAST NAME" type="text" placeholder="Doe" />
              </div>
              <div className="grid md:grid-cols-2 gap-6 lg:gap-10">
                <InputField label="EMAIL" type="email" placeholder="john@example.com" />
                <InputField label="PHONE" type="tel" placeholder="+1..." />
              </div>
              <InputField label="SUBJECT" type="text" placeholder="How can I help?" />
              
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-body/40 ml-1">
                  MESSAGE
                </label>
                <textarea
                  rows={4}
                  placeholder="Tell me about your project..."
                  className="w-full bg-secondary/30 rounded-2xl p-5 md:p-6 outline-none focus:border-primary/30 border border-transparent transition-all text-heading resize-none text-sm md:text-base placeholder:text-body/20 font-medium"
                />
              </div>
              
              <div className="pt-4">
                <button className="w-full bg-heading text-white py-6 rounded-2xl text-[11px] font-black tracking-[0.25em] uppercase flex items-center justify-center gap-4 hover:bg-primary transition-all shadow-xl shadow-heading/10 active:scale-[0.98]">
                  SEND INQUIRY
                  <Send size={18} className="rotate-12" />
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function InputField({ label, type, placeholder }: { label: string; type: string; placeholder?: string }) {
  return (
    <div className="space-y-4">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-body/40 ml-1">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full bg-secondary/30 rounded-2xl px-6 outline-none focus:border-primary/30 border border-transparent transition-all text-heading h-16 text-sm md:text-base placeholder:text-body/20 font-medium"
      />
    </div>
  );
}
