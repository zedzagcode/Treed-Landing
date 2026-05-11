import { useTranslation } from 'react-i18next';
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Radio } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import handsetAssembled from "@assets/FrontViewHandset_1768510603416.png";
import internalsRef from "@assets/image_1768500922203.png";
import batteryImg from "@assets/image_1768501159324.png";

export default function ExplodedView() {
   const { t } = useTranslation();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Refined animation timeline
  const assembledOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const assembledScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.99]);
  const assembledBlur = useTransform(scrollYProgress, [0.05, 0.2], ["blur(0px)", "blur(12px)"]);

  const componentsOpacity = useTransform(scrollYProgress, [0.1, 0.25], [0, 1]);
  
  const speakerY = useTransform(scrollYProgress, [0.15, 0.85], [0, -140]);
  const nfcY = useTransform(scrollYProgress, [0.2, 0.9], [0, -70]);
  const batteryScale = useTransform(scrollYProgress, [0.15, 0.75], [1, 1.08]);
  const batteryY = useTransform(scrollYProgress, [0.15, 0.75], [0, 0]);
  const hapticY = useTransform(scrollYProgress, [0.25, 0.95], [0, 60]);
  const pcbY = useTransform(scrollYProgress, [0.3, 1], [0, 130]);
  const micY = useTransform(scrollYProgress, [0.35, 1], [0, 200]);

  const containerScale = useTransform(scrollYProgress, [0, 1], [0.98, 1.08]);

  return (
    <div ref={containerRef} className="h-[400vh] relative bg-black my-32">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          style={{ 
            opacity: useTransform(scrollYProgress, [0.1, 0.5], [0, 1]),
            scale: useTransform(scrollYProgress, [0.2, 1], [0.8, 1.2])
          }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(200,223,82,0.08),transparent_70%)] pointer-events-none"
        />

        <motion.div style={{ scale: containerScale }} className="relative w-full max-w-2xl px-4 aspect-square flex items-center justify-center scale-[0.8] md:scale-100 transition-transform">
          
          <motion.div 
            style={{ 
              opacity: assembledOpacity, 
              scale: assembledScale,
              filter: assembledBlur
            }} 
            className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <img 
              src={handsetAssembled} 
              alt="Handset Assembled" 
              className="h-[80%] w-auto object-contain drop-shadow-[0_0_80px_rgba(200,223,82,0.1)]" 
            />
          </motion.div>

          <motion.div 
            style={{ opacity: componentsOpacity }} 
            className="absolute inset-0 flex items-center justify-center z-10"
          >
            <div className="relative h-[65%] aspect-[1/2] flex flex-col items-center">
              
              <motion.div style={{ y: speakerY }} className="absolute top-[2%] z-40">
                <div className="relative">
                  <div className="w-28 h-28 bg-zinc-900/90 rounded-full border border-white/10 flex items-center justify-center overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                    <div className="w-22 h-22 rounded-full bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-zinc-400 to-black shadow-inner"></div>
                    </div>
                  </div>
                  <ComponentLabel label={t('handset.explodedView.components.audio.label')} sublabel={t('handset.explodedView.components.audio.sublabel')} side="right" isLight={isLight} />
                </div>
              </motion.div>

              <motion.div style={{ y: nfcY }} className="absolute top-[14%] z-30">
                <div className="relative">
                  <div className="w-22 h-22 rounded-3xl border border-primary/40 bg-primary/5 flex items-center justify-center backdrop-blur-md shadow-lg">
                    <div className="w-14 h-14 rounded-2xl border border-primary/20 flex items-center justify-center">
                      <Radio className="w-8 h-8 text-primary/60" />
                    </div>
                  </div>
                  <ComponentLabel label={t('handset.explodedView.components.nfc.label')} sublabel={t('handset.explodedView.components.nfc.sublabel')} side="left" isLight={isLight} />
                </div>
              </motion.div>

              <motion.div style={{ scale: batteryScale, y: batteryY }} className="absolute top-[32%] bottom-[35%] w-14 z-20">
                <div className="relative h-full w-full">
                  <div className="h-full w-full bg-zinc-800 rounded-lg border border-white/10 flex flex-col items-center justify-between py-2 shadow-2xl">
                    <div className="w-4 h-1 bg-zinc-600 rounded-t-sm"></div>
                    <div className="flex-1 w-full bg-gradient-to-b from-zinc-700 to-zinc-900 mx-1 rounded-sm relative overflow-hidden">
                      <div className="absolute inset-0 bg-primary/20 opacity-30"></div>
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[6px] font-black text-white/40 rotate-90">18650</div>
                    </div>
                  </div>
                  <ComponentLabel label={t('handset.explodedView.components.battery.label')} sublabel={t('handset.explodedView.components.battery.sublabel')} side="right" isLight={isLight} />
                </div>
              </motion.div>

              <motion.div style={{ y: hapticY }} className="absolute top-[68%] z-30">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-zinc-800 border border-white/10 shadow-2xl flex items-center justify-center backdrop-blur-xl">
                     <div className="w-6 h-6 bg-zinc-500 rounded-sm rotate-45 border border-white/10 shadow-inner"></div>
                  </div>
                  <ComponentLabel label={t('handset.explodedView.components.haptic.label')} sublabel={t('handset.explodedView.components.haptic.sublabel')} side="left" isLight={isLight} />
                </div>
              </motion.div>

              <motion.div style={{ y: pcbY }} className="absolute bottom-[10%] z-40">
                <div className="relative">
                   <div className="w-32 h-32 bg-zinc-900/95 rounded-[2.5rem] border border-primary/30 shadow-[0_30px_60px_rgba(0,0,0,0.6)] overflow-hidden p-5 backdrop-blur-2xl flex items-center justify-center">
                      <div className="relative w-full h-full bg-zinc-800 rounded-xl border border-zinc-700 p-2 overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                           <div className="w-16 h-16 bg-zinc-900 rounded-xl border border-white/10 flex items-center justify-center">
                              <div className="w-10 h-10 bg-zinc-700 rounded-md"></div>
                           </div>
                        </div>
                        <div className="absolute top-2 left-2 text-[8px] font-mono text-primary/40">ESP32-S3</div>
                      </div>
                   </div>
                   <ComponentLabel label={t('handset.explodedView.components.core.label')} sublabel={t('handset.explodedView.components.core.sublabel')} side="right" isLight={isLight} />
                </div>
              </motion.div>

              <motion.div style={{ y: micY }} className="absolute bottom-[-12%] z-50">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-zinc-900/90 border border-white/10 flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                      <motion.div 
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-3 h-3 rounded-full bg-primary/80 shadow-[0_0_10px_rgba(200,223,82,0.5)]"
                      />
                    </div>
                  </div>
                  <ComponentLabel label={t('handset.explodedView.components.mic.label')} sublabel={t('handset.explodedView.components.mic.sublabel')} side="left" isLight={isLight} />
                </div>
              </motion.div>

            </div>
          </motion.div>

        </motion.div>
        
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 container mx-auto px-6 flex flex-col md:flex-row justify-between pointer-events-none gap-8 z-50">
          <motion.div 
            style={{ 
              opacity: useTransform(scrollYProgress, [0, 0.2], [1, 0]),
              y: useTransform(scrollYProgress, [0, 0.2], [-140, -180])
            }}
            className="max-w-[280px] bg-black/40 backdrop-blur-sm p-4 rounded-3xl border border-white/5"
          >
            <h2 className="text-xl md:text-2xl font-bold mb-3">{t('handset.explodedView.heading1')}</h2>
            <p className={`text-xs md:text-sm leading-relaxed ${isLight ? 'desc-neutral' : 'text-zinc-500'}`}>{t('handset.explodedView.para1')}</p>
          </motion.div>
          <motion.div 
            style={{ 
              opacity: useTransform(scrollYProgress, [0.8, 1], [0, 1]),
              y: useTransform(scrollYProgress, [0.8, 1], [180, 140])
            }}
            className="max-w-[280px] text-right md:mt-0 mt-auto bg-black/60 backdrop-blur-md p-4 rounded-3xl border border-white/10 shadow-2xl relative"
          >
            <div className="absolute inset-0 bg-white/5 rounded-3xl -z-10 backdrop-blur-xl"></div>
            <h2 className="text-xl md:text-2xl font-bold mb-3 text-primary">{t('handset.explodedView.heading2')}</h2>
            <p className={`text-xs md:text-sm leading-relaxed ${isLight ? 'desc-neutral' : 'text-zinc-500'}`}>{t('handset.explodedView.para2')}</p>
          </motion.div>
        </div>

        <motion.div 
           style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
           className="absolute bottom-10 left-1/2 -translate-x-1/2 text-zinc-500 text-sm flex flex-col items-center gap-2"
        >
          <span className="uppercase tracking-[0.2em] font-bold text-[10px]">{t('handset.explodedView.scrollHint')}</span>
          <div className="w-1 h-12 bg-zinc-800 rounded-full overflow-hidden">
             <motion.div 
              animate={{ y: [0, 24, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-full h-1/3 bg-primary"
             />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function ComponentLabel({ label, sublabel, side, isLight }: { label: string, sublabel: string, side: 'left' | 'right', isLight: boolean }) {
  return (
    <div className={`absolute top-1/2 -translate-y-1/2 ${side === 'right' ? 'left-full ml-4 md:ml-8' : 'right-full mr-4 md:mr-8 text-right'} w-32 md:w-48 pointer-events-none`}>
      <motion.div
        initial={{ opacity: 0, x: side === 'right' ? -10 : 10 }}
        whileInView={{ opacity: 1, x: 0 }}
        className="flex flex-col gap-1"
      >
        <div className="h-px w-4 md:w-8 bg-primary/40 mb-2"></div>
        <h4 className="text-white font-bold text-[10px] md:text-sm uppercase tracking-wider leading-tight">{label}</h4>
        <p className={`text-[8px] md:text-xs ${isLight ? 'desc-neutral' : 'text-zinc-500'}`}>{sublabel}</p>
      </motion.div>
    </div>
  );
}
