/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Mail, Phone, MapPin, Calendar, ExternalLink, 
  Award, Scissors, Video, Book, Send, 
  MessageSquare, X, Sparkles, Loader2 
} from "lucide-react";
import { askChatbot } from "./services/geminiService";

const SectionHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="mb-12">
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="font-display text-4xl md:text-5xl tracking-tighter mb-4"
    >
      {title}
    </motion.h2>
    {subtitle && (
      <motion.p 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="text-gray-500 font-medium"
      >
        ( {subtitle} )
      </motion.p>
    )}
  </div>
);

const SkillCard = ({ title, icon: Icon, items, colorClass }: { title: string, icon: any, items: string[], colorClass: string }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className={`${colorClass} p-8 rounded-3xl flex flex-col justify-between min-h-[320px] transition-all border border-black/5 shadow-sm`}
  >
    <div>
      <div className="bg-white/50 w-12 h-12 rounded-xl flex items-center justify-center mb-6 border border-black/5">
        <Icon className="w-6 h-6 text-black" />
      </div>
      <h3 className="font-display text-xl mb-4 uppercase tracking-tight">{title}</h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="text-sm font-medium leading-relaxed opacity-80">{item}</li>
        ))}
      </ul>
    </div>
    <div className="mt-6 flex justify-end">
      <div className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center">
        <span className="text-[10px] font-bold">→</span>
      </div>
    </div>
  </motion.div>
);

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: '안녕하세요! 이수빈 패션 기술자의 포트폴리오 비서입니다. 궁금한 점이 있으신가요?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const response = await askChatbot(userMessage, history);
    setMessages(prev => [...prev, { role: 'model', text: response || '죄송합니다. 오류가 발생했습니다.' }]);
    setIsLoading(false);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-[60] w-16 h-16 bg-black text-white rounded-full flex items-center justify-center shadow-2xl transition-shadow hover:shadow-black/20"
      >
        <MessageSquare className="w-6 h-6" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-28 right-8 z-[60] w-[90vw] md:w-[400px] h-[600px] bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-black/5 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-black/5 flex justify-between items-center bg-black text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-purple flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h3 className="font-display text-lg tracking-tight">AI Assistant</h3>
                  <p className="text-[10px] uppercase font-bold tracking-widest opacity-60">beesoob Portfolio</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#F9F9F9]">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`
                    max-w-[80%] p-4 rounded-2xl text-sm font-medium leading-relaxed
                    ${m.role === 'user' 
                      ? 'bg-black text-white rounded-tr-none' 
                      : 'bg-white text-black border border-black/5 shadow-sm rounded-tl-none'}
                  `}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-black/5 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-black/5 bg-white">
              <div className="flex gap-3">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="무엇이든 물어보세요..."
                  className="flex-1 bg-[#F9F9F9] border border-black/5 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:border-black/20 transition-colors"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors shadow-lg"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-4 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {['최근 경력은?', '보유 기술', '연락처'].map((hint) => (
                  <button 
                    key={hint}
                    onClick={() => {
                      setInput(hint);
                      // Automatic send is better for UX here but let's just prefill for now
                    }}
                    className="whitespace-nowrap text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 border border-black/5 rounded-full hover:bg-black hover:text-white transition-colors"
                  >
                    {hint}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default function App() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen selection:bg-black selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-6 py-6 flex justify-between items-center mix-blend-difference text-white md:px-12">
        <div className="font-display text-2xl tracking-tighter cursor-pointer">비숩</div>
        <div className="flex gap-8 text-xs font-medium uppercase tracking-widest">
          <a href="#profile" className="hover:opacity-50 transition-opacity">Profile</a>
          <a href="#skills" className="hover:opacity-50 transition-opacity">Skills</a>
          <a href="#experience" className="hover:opacity-50 transition-opacity">Experience</a>
          <a href="#contact" className="hover:opacity-50 transition-opacity">Contact</a>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-24 md:px-12 md:py-32">
        {/* Hero Section */}
        <section className="mb-32">
          <div className="flex flex-col lg:flex-row gap-12 items-end mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "circOut" }}
              className="flex-1"
            >
              <h1 className="font-display text-7xl md:text-[140px] leading-[0.85] tracking-tighter mb-8">
                beesoob
              </h1>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="w-full lg:w-1/2 aspect-video lg:aspect-[16/7] rounded-[40px] overflow-hidden border border-black/5"
            >
              <img 
                src="https://raw.githubusercontent.com/suebin91-blip/beesoob/f8b2db2acea67dbc52c403953fbc6827ab941036/IMG_8915.JPG" 
                alt="beesoob visual" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col md:flex-row gap-12 items-start"
          >
            <div className="max-w-xl">
              <p className="text-2xl md:text-3xl font-medium leading-tight mb-8">
                전통과 현대 의상을 아우르는 <span className="text-gray-400">패션 기술자</span>이자 <br />
                세상을 담는 <a 
                  href="https://www.youtube.com/@beesoob" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-black hover:bg-gray-100 px-1 rounded transition-all cursor-pointer border-b-2 border-transparent hover:border-black"
                >영상 크리에이터</a>입니다.
              </p>
              <div className="flex flex-wrap gap-4">
                <span className="px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-full">Technical Fashion</span>
                <motion.a 
                  href="https://www.youtube.com/@beesoob"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -5, rotate: -1 }}
                  whileTap={{ scale: 0.9 }}
                  className="px-4 py-2 border border-black text-xs font-bold uppercase tracking-widest rounded-full flex items-center gap-2 bg-white hover:bg-black hover:text-white transition-all duration-300 shadow-sm hover:shadow-xl cursor-alias"
                >
                  Content Creation <ExternalLink className="w-3 h-3" />
                </motion.a>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-sm font-medium border-l border-black/10 pl-6 md:pl-12">
              <div className="flex gap-3">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>1991. 05. 02</span>
              </div>
              <div className="flex gap-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <span>beesoob_@naver.com</span>
              </div>
              <div className="flex gap-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>010-6347-6548</span>
              </div>
              <div className="flex gap-3">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>서울시 도봉구</span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Skills Grid */}
        <section id="skills" className="mb-48">
          <SectionHeader title="Skills & Education" subtitle="01" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <SkillCard 
              title="Fashion Technical" 
              icon={Scissors}
              colorClass="bg-brand-purple"
              items={["한복기능사 (2024)", "양복기능사 (2020)", "양장기능사 (2020)", "세탁기능사 (2020)"]}
            />
            <SkillCard 
              title="Academic Background" 
              icon={Book}
              colorClass="bg-brand-green"
              items={["한국의상과 수료 (중부남부기술교육원)", "패션디자인과 수료 (중부기술교육원)"]}
            />
            <SkillCard 
              title="Content & Education" 
              icon={Video}
              colorClass="bg-brand-salmon"
              items={["인형연극놀이지도사 1급", "연극놀이지도사 양성과정", "바리스타 2급"]}
            />
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="mb-48">
          <SectionHeader title="Experience" subtitle="02" />
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-24"
          >
            {/* Experience Item 1 */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-12 group">
              <div className="relative overflow-hidden rounded-3xl aspect-[4/3] bg-brand-blue">
                <img 
                  src="https://raw.githubusercontent.com/suebin91-blip/beesoob/f8b2db2acea67dbc52c403953fbc6827ab941036/IMG_8915.JPG" 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  alt="Do bong Creator"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-8 left-8">
                  <span className="text-xs font-bold uppercase tracking-widest bg-white/80 backdrop-blur px-3 py-1 rounded-full border border-black/5">Creative</span>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <div className="mb-4 opacity-50 text-sm font-bold uppercase tracking-widest">2022.03 - 2022.12</div>
                <h3 className="text-4xl font-display mb-4">제2기 도봉영상크리에이터</h3>
                <p className="text-gray-500 font-medium mb-6">도봉구청 주관 지역 콘텐츠 기획 및 영상 제작 활동을 통해 지역 사회의 이야기를 시각적으로 담아냈습니다.</p>
                <div className="flex gap-2">
                  <span className="bg-white border border-black/10 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter">Production</span>
                  <span className="bg-white border border-black/10 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter">Planning</span>
                </div>
              </div>
            </motion.div>

            {/* Experience Item 2 */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-12 flex-row-reverse group">
              <div className="flex flex-col justify-center order-2 md:order-1">
                <div className="mb-4 opacity-50 text-sm font-bold uppercase tracking-widest">2023.01 - 2023.06</div>
                <h3 className="text-4xl font-display mb-4">학마을/김수영문학도서관</h3>
                <p className="text-gray-500 font-medium mb-6">도서 정리 및 소셜 미디어(SNS) 채널 관리를 담당하며 독자와의 소통 창구를 강화하고 도서관 행사를 보조했습니다.</p>
                 <div className="flex gap-2">
                  <span className="bg-white border border-black/10 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter">SNS Management</span>
                  <span className="bg-white border border-black/10 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter">Event Support</span>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-3xl aspect-[4/3] bg-brand-purple order-1 md:order-2">
                <video 
                  src="https://raw.githubusercontent.com/suebin91-blip/beesoob/743529564c549919a9b6fb1a47ed36ab0cb36055/260423_%EA%B0%95%EB%B6%81%EC%B2%AD%EB%85%84%EC%84%BC%ED%84%B0(1).mp4" 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-8 left-8">
                  <span className="text-xs font-bold uppercase tracking-widest bg-white/80 backdrop-blur px-3 py-1 rounded-full border border-black/5">Management</span>
                </div>
              </div>
            </motion.div>

             {/* Experience Item 3 */}
             <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-12 group">
              <div className="relative overflow-hidden rounded-3xl aspect-[4/3] bg-brand-green">
                <div className="absolute inset-0 flex items-center justify-center">
                   <ExternalLink className="w-16 h-16 opacity-20" />
                </div>
                <div className="absolute top-8 left-8">
                  <span className="text-xs font-bold uppercase tracking-widest bg-white/80 backdrop-blur px-3 py-1 rounded-full border border-black/5">Media</span>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <div className="mb-4 opacity-50 text-sm font-bold uppercase tracking-widest">2016.04 - 2016.08</div>
                <h3 className="text-4xl font-display mb-4">(주)헤럴드 인턴사원</h3>
                <p className="text-gray-500 font-medium mb-6">온라인 기사 편집 및 배포 업무를 수행하며 디지털 미디어 환경에서의 콘텐츠 유통 과정을 경험했습니다.</p>
                <div className="flex gap-2">
                  <span className="bg-white border border-black/10 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter">Editing</span>
                  <span className="bg-white border border-black/10 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter">Distribution</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Philosophy Section */}
        <section className="mb-48 py-24 border-y border-black/10 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl"
          >
            <h2 className="font-display text-5xl md:text-7xl tracking-tighter mb-8 leading-[0.95] uppercase">
              Merging Tradition <br /> With Modernity
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 font-medium leading-relaxed italic">
              "전통 복식부터 현대 양장까지, 모든 옷에는 이야기가 담겨 있습니다. 저는 그 이야기를 옷으로 만들고 영상으로 기록합니다."
            </p>
          </motion.div>
        </section>

        {/* Contact Footer */}
        <footer id="contact" className="py-24 bg-white rounded-[40px] border border-black/5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <Award className="w-[400px] h-[400px] -rotate-12" />
          </div>
          
          <div className="relative z-10 px-12">
            <div className="flex flex-col md:flex-row justify-between items-end gap-24">
              <div className="max-w-2xl">
                <h2 className="font-display text-5xl md:text-8xl tracking-tight leading-[0.8] uppercase mb-12">
                  We'd love to <br /> hear from you —
                </h2>
                <div className="space-y-4">
                  <a href="mailto:beesoob_@naver.com" className="block text-4xl md:text-6xl font-display hover:text-gray-400 transition-colors underline decoration-1 underline-offset-8">
                    beesoob_@naver.com
                  </a>
                  <p className="text-xl font-medium pt-4 underline underline-offset-4 decoration-black/20 decoration-2">
                    010-6347-6548
                  </p>
                </div>
              </div>

              <div className="w-full md:w-80">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-8">Quick Links</p>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-black/5 pb-2">
                    <span className="text-sm font-medium">Location</span>
                    <span className="text-sm font-bold uppercase">Seoul, KR</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-black/5 pb-2">
                    <span className="text-sm font-medium">Availability</span>
                    <span className="text-sm font-bold uppercase">Open for Project</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-black/5 pb-2">
                    <span className="text-sm font-medium">Specialty</span>
                    <span className="text-sm font-bold uppercase tracking-tight">Fashion Tech</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-32 pt-12 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-30">© 2024 Lee Subin Portfolio. All Rights Reserved.</p>
              <div className="flex gap-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-30">Traditional</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-30">•</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-30">Modern</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-30">•</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-30">Visual</span>
              </div>
            </div>
          </div>
        </footer>
        <ChatBot />
      </main>
    </div>
  );
}
