'use client';

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, Loader2, Maximize2, Minimize2, Sparkles, Database } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/lib/supabase";

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export function AssistantChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: "Merhaba! Ben Loft 777 asistanıyım. Şantiyedeki verilerle ilgili benden her şeyi sorabilirsiniz. Nasıl yardımcı olabilirim?" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const chatRef = useRef<HTMLDivElement>(null);
    const bubbleRef = useRef<HTMLButtonElement>(null);

    // Magnetic Effect for Bubble
    useEffect(() => {
        const bubble = bubbleRef.current;
        if (!bubble) return;

        const onMouseMove = (e: MouseEvent) => {
            const rect = bubble.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const distance = Math.sqrt(x * x + y * y);

            if (distance < 100) {
                gsap.to(bubble, {
                    x: x * 0.3,
                    y: y * 0.3,
                    duration: 0.4,
                    ease: "power2.out"
                });
            } else {
                gsap.to(bubble, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.3)" });
            }
        };

        window.addEventListener("mousemove", onMouseMove);
        return () => window.removeEventListener("mousemove", onMouseMove);
    }, []);

    const fetchContextData = async () => {
        try {
            // 1. Son 5 Genel Fatura
            const { data: generalInvoices } = await supabase.from('general_invoices').select('grand_total, supplier, invoice_date').order('invoice_date', { ascending: false }).limit(5);

            // 2. Son 5 İrsaliye
            const { data: waybills } = await supabase.from('waybills').select('waybill_no, supplier, date').order('date', { ascending: false }).limit(5);

            // 3. Toplam Harcamalar (Basit Toplam)
            const { data: totals } = await supabase.from('general_invoices').select('grand_total');
            const totalSpend = totals?.reduce((sum, doc) => sum + (doc.grand_total || 0), 0) || 0;

            return JSON.stringify({
                total_expenditure_detected: totalSpend + " TL",
                recent_general_invoices: generalInvoices,
                recent_waybills_detected: waybills,
                project_name: "Loft 777",
                active_manager: "Sertan Aydın",
                system_status: "All systems operational",
                last_update: new Date().toLocaleString('tr-TR')
            });
        } catch (e) {
            return "Veri alınamadı, genel asistan olarak yanıt ver.";
        }
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        if (!apiKey) {
            setTimeout(() => {
                setMessages(prev => [...prev, { role: 'assistant', content: "API anahtarı bulunamadı. Lütfen .env.local dosyasına NEXT_PUBLIC_GEMINI_API_KEY ekleyin." }]);
                setIsLoading(false);
            }, 1000);
            return;
        }

        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const context = await fetchContextData();

            const prompt = `Sen Loft 777 İnşaat Projesi'nin akıllı asistanısın. 
      Kullanıcıya profesyonel ve saygılı bir dille hitap et. "Abi" veya benzeri hitaplar kullanma.
      
      Şu anki proje verileri (context): ${context}
      
      Kullanıcı sorusu: ${userMessage}
      
      Eğer verilerde cevabı yoksa nazikçe "Şu an bu veriye ulaşamıyorum ama kayıtları kontrol edebilirim" de.
      Yanıtlarını kısa, öz ve anlaşılır tut. Profesyonel ama samimi bir dil kullan.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            setMessages(prev => [...prev, { role: 'assistant', content: text }]);
        } catch (error) {
            console.error("Chatbot Error:", error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Üzgünüm, şu an cevap veremiyorum. Lütfen tekrar deneyin." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4">
            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20, filter: "blur(10px)" }}
                        animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.9, y: 20, filter: "blur(10px)" }}
                        className="w-[380px] h-[550px] mb-4 origin-bottom-right"
                    >
                        <Card className="w-full h-full flex flex-col overflow-hidden border-white/20 shadow-2xl glass-card rounded-[2.5rem]">
                            {/* Header */}
                            <div className="p-6 bg-slate-900 text-white flex items-center justify-between relative overflow-hidden">
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className="p-3 bg-blue-500/20 rounded-2xl">
                                        <Bot className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-sm tracking-widest uppercase">AI ASİSTAN</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                            <span className="text-[10px] font-bold text-slate-400">ÇEVRİMİÇİ • LOFT 777</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors relative z-10"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                                <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 p-6 bg-slate-50/50 overflow-y-auto max-h-[350px]">
                                <div className="space-y-6">
                                    {messages.map((msg, i) => (
                                        <motion.div
                                            initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            key={i}
                                            className={cn(
                                                "flex flex-col max-w-[85%] gap-2",
                                                msg.role === 'user' ? "ml-auto items-end" : "items-start"
                                            )}
                                        >
                                            <div className={cn(
                                                "px-5 py-3 rounded-3xl text-sm font-medium shadow-sm leading-relaxed",
                                                msg.role === 'user'
                                                    ? "bg-slate-900 text-white rounded-br-none"
                                                    : "bg-white text-slate-800 border border-slate-100 rounded-bl-none"
                                            )}>
                                                {msg.content}
                                            </div>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                                                {msg.role === 'user' ? 'SEN' : 'ASİSTAN'}
                                            </span>
                                        </motion.div>
                                    ))}
                                    {isLoading && (
                                        <div className="flex items-center gap-3 animate-pulse">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                                            </div>
                                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">AI DÜŞÜNÜYOR...</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Input Area */}
                            <div className="p-6 bg-white border-t border-slate-100">
                                <div className="relative">
                                    <Input
                                        placeholder="Sorunuzu yazın..."
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                        className="h-14 pl-6 pr-14 rounded-2xl border-slate-100 bg-slate-50 focus-visible:ring-blue-500 font-bold text-sm"
                                    />
                                    <Button
                                        onClick={handleSend}
                                        disabled={!input.trim() || isLoading}
                                        size="icon"
                                        className="absolute right-2 top-2 h-10 w-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-lg"
                                    >
                                        <Send className="w-5 h-5" />
                                    </Button>
                                </div>
                                <p className="text-[9px] text-center text-slate-400 font-black uppercase tracking-[0.2em] mt-4">
                                    Google Gemini 1.5 Flash ile Güçlendirildi
                                </p>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Bubble */}
            <button
                ref={bubbleRef}
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 transform active:scale-90",
                    isOpen ? "bg-red-500 text-white rotate-90" : "bg-slate-900 text-white hover:bg-slate-800"
                )}
            >
                {isOpen ? <X className="w-8 h-8" /> : <Bot className="w-8 h-8" />}
                {!isOpen && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center animate-bounce">
                        <Sparkles className="w-3 h-3 text-white fill-current" />
                    </div>
                )}
            </button>
        </div>
    );
}
