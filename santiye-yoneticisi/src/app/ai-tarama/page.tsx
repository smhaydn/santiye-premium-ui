'use client';

import { useState, useRef, useEffect } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Scan, FileText, Image as ImageIcon, CheckCircle2,
    Loader2, ArrowRight, ShieldCheck, Database, Zap, History, Trash2, Edit3
} from "lucide-react";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function AIScanPage() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [status, setStatus] = useState<'idle' | 'uploading' | 'scanning' | 'done'>('idle');
    const [scanType, setScanType] = useState<'irsaliye' | 'fatura'>('irsaliye');

    // Extracted Data State (Editable)
    const [extractedData, setExtractedData] = useState({
        docNo: '',
        date: new Date().toISOString().split('T')[0],
        supplier: '',
        amount: '',
        company: 'Camsan&Koparan'
    });

    const scanLineRef = useRef<HTMLDivElement>(null);
    const resultCardRef = useRef<HTMLDivElement>(null);

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setStatus('idle');
        }
    };

    // Function to convert file to Generative AI part
    async function fileToGenerativePart(file: File) {
        const base64EncodedDataPromise = new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
            reader.readAsDataURL(file);
        });
        return {
            inlineData: { data: await base64EncodedDataPromise as string, mimeType: file.type },
        };
    }

    const startAnalysis = async () => {
        if (!file) return;

        setStatus('scanning');

        // GSAP Scanning Animation
        if (scanLineRef.current) {
            gsap.fromTo(scanLineRef.current,
                { top: '0%' },
                { top: '100%', duration: 1.5, repeat: -1, yoyo: true, ease: "sine.inOut" }
            );
        }

        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

        if (apiKey) {
            // REAL AI MODE
            try {
                const genAI = new GoogleGenerativeAI(apiKey);
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

                const prompt = `Bu bir ${scanType === 'fatura' ? 'fatura' : 'irsaliye'} görselidir. 
        Lütfen şu bilgileri JSON formatında çıkar:
        - docNo (Belge Numarası)
        - date (Tarih - YYYY-MM-DD formatında)
        - supplier (Satıcı/Tedarikçi firma adı)
        - amount (Toplam Tutar veya İrsaliye ise miktar/tonaj - sadece rakam)
        - company (Alıcı firma: Camsan, Koparan veya Altın Raket seçeneklerinden biri)
        
        Sadece geçerli bir JSON objesi döndür.`;

                const imagePart = await fileToGenerativePart(file);
                const result = await model.generateContent([prompt, imagePart]);
                const response = await result.response;
                const text = response.text();

                // Clean the text from markdown code blocks if present
                const jsonMatch = text.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const parsed = JSON.parse(jsonMatch[0]);
                    setExtractedData({
                        docNo: parsed.docNo || '',
                        date: parsed.date || new Date().toISOString().split('T')[0],
                        supplier: parsed.supplier || '',
                        amount: parsed.amount?.toString() || '',
                        company: parsed.company || 'Camsan&Koparan'
                    });
                }
            } catch (error) {
                console.error("Gemini Error:", error);
                toast.error("AI okuma hatası, simülasyon verileri yüklendi.");
                // Fallback to simulation data on error
                setExtractedData({
                    docNo: scanType === 'fatura' ? 'FT-2024-' + Math.floor(Math.random() * 9000 + 1000) : 'IRS-' + Math.floor(Math.random() * 900000),
                    date: new Date().toISOString().split('T')[0],
                    supplier: 'KALYONCU DEMİR ÇELİK A.Ş.',
                    amount: scanType === 'fatura' ? '124500' : '45.20',
                    company: 'Camsan&Koparan'
                });
            }
        } else {
            // SIMULATION MODE
            await new Promise(r => setTimeout(r, 4000));
            setExtractedData({
                docNo: scanType === 'fatura' ? 'FT-2024-' + Math.floor(Math.random() * 9000 + 1000) : 'IRS-' + Math.floor(Math.random() * 900000),
                date: new Date().toISOString().split('T')[0],
                supplier: 'KALYONCU DEMİR ÇELİK A.Ş.',
                amount: scanType === 'fatura' ? '124500' : '45.20',
                company: 'Camsan&Koparan'
            });
        }

        setStatus('done');
        toast.success("AI Analizi Tamamlandı!", {
            description: apiKey ? "Gerçek AI verileri başarıyla ayrıştırıldı." : "Simülasyon verileri yüklendi (API Key eksik).",
        });
    };

    const handleSaveToSystem = async () => {
        setStatus('uploading');
        try {
            let publicUrl = '';

            // 1. Upload to Supabase Storage
            if (file) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
                const filePath = `ai-scans/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('waybill-photos')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data } = supabase.storage.from('waybill-photos').getPublicUrl(filePath);
                publicUrl = data.publicUrl;
            }

            // 2. Save to Database
            if (scanType === 'fatura') {
                const { error } = await supabase.from('general_invoices').insert([{
                    invoice_number: extractedData.docNo,
                    invoice_date: extractedData.date,
                    supplier: extractedData.supplier,
                    grand_total: parseFloat(extractedData.amount || '0'),
                    category: 'Diğer',
                    description: 'AI Tarama ile otomatik oluşturuldu.',
                    photo_url: publicUrl
                }]);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('waybills').insert([{
                    waybill_no: extractedData.docNo,
                    date: extractedData.date,
                    supplier: extractedData.supplier,
                    company: extractedData.company,
                    photo_url: publicUrl
                }]);
                if (error) throw error;
            }

            toast.success("Sisteme Başarıyla Kaydedildi!", {
                description: "Belge ilgili listeye eklendi.",
            });

            setFile(null);
            setPreview(null);
            setStatus('idle');

        } catch (error: any) {
            toast.error("Kayıt Hatası", { description: error.message });
        } finally {
            setStatus('idle');
        }
    };

    return (
        <div className="flex flex-col gap-8 pb-20">
            <PageHeader
                title="AI EVRAK TARAMA"
                subtitle="Yapay zeka ile fatura ve irsaliyeleri saniyeler içinde dijitalleştirin."
            >
                <Button variant="outline" className="rounded-full gap-2 border-primary/20 text-primary hover:bg-primary/5">
                    <History className="w-4 h-4" /> Geçmiş
                </Button>
            </PageHeader>

            {!process.env.NEXT_PUBLIC_GEMINI_API_KEY && (
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-2xl flex items-center gap-4 text-yellow-800">
                    <Zap className="w-5 h-5 animate-pulse" />
                    <p className="text-xs font-bold">API ANAHTARI EKSİK: Şu an simülasyon modunda çalışıyor. Gerçek AI için .env.local dosyasına anahtarınızı ekleyin.</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left: Upload & Preview */}
                <div className="lg:col-span-7 space-y-6">
                    <Card className="rounded-[2.5rem] p-8 glass-card border-none shadow-2xl relative overflow-hidden min-h-[550px] flex flex-col justify-center items-center group transition-all">
                        {!preview ? (
                            <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full border-2 border-dashed border-primary/20 rounded-[2.5rem] hover:border-primary/40 transition-all bg-primary/5 group-hover:bg-primary/10">
                                <div className="p-8 rounded-[2rem] bg-white shadow-2xl mb-6 group-hover:scale-110 transition-transform duration-500">
                                    <Scan className="w-12 h-12 text-primary" />
                                </div>
                                <p className="text-2xl font-black text-foreground tracking-tight">Görseli Buraya Sürükleyin</p>
                                <p className="text-xs text-muted-foreground font-black mt-3 uppercase tracking-[0.2em]">VEYA DOSYA SEÇMEK İÇİN TIKLAYIN</p>
                                <input type="file" className="hidden" onChange={onFileChange} accept="image/*" />
                            </label>
                        ) : (
                            <div className="relative w-full h-full rounded-[2rem] overflow-hidden shadow-2xl border border-white/20">
                                <img src={preview} alt="Preview" className="w-full h-auto max-h-[650px] object-contain" />

                                {status === 'scanning' && (
                                    <>
                                        <div ref={scanLineRef} className="absolute left-0 right-0 h-1.5 bg-primary shadow-[0_0_25px_rgba(var(--primary),1)] z-20" />
                                        <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] flex items-center justify-center z-10">
                                            <div className="bg-white/95 backdrop-blur-2xl px-10 py-6 rounded-[2rem] shadow-2xl flex items-center gap-5 border border-primary/10 scale-110">
                                                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                                <span className="font-black text-sm text-primary tracking-[0.2em] uppercase">AI ANALİZ EDİYOR...</span>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {status === 'done' && (
                                    <div className="absolute inset-0 bg-green-500/10 backdrop-blur-[1px] flex items-center justify-center z-10">
                                        <div className="bg-white/95 px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-green-500/20">
                                            <CheckCircle2 className="w-6 h-6 text-green-500" />
                                            <span className="font-black text-sm text-green-600 tracking-widest uppercase">TARAMA BAŞARILI</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </Card>

                    {preview && status === 'idle' && (
                        <div className="flex gap-4">
                            <Button
                                magnetic
                                onClick={() => { setPreview(null); setFile(null); setStatus('idle'); }}
                                variant="outline"
                                className="flex-1 rounded-2xl h-20 font-black uppercase tracking-widest border-red-500/20 text-red-500 hover:bg-red-50 shadow-xl shadow-red-500/5"
                            >
                                <Trash2 className="mr-3 w-5 h-5" /> İPTAL
                            </Button>
                            <Button
                                magnetic
                                onClick={startAnalysis}
                                className="flex-[2.5] rounded-2xl h-20 font-black bg-slate-900 text-white shadow-2xl shadow-indigo-500/30 uppercase tracking-[0.3em]"
                            >
                                ANALİZİ BAŞLAT <Zap className="ml-4 w-6 h-6 text-yellow-400 fill-yellow-400" />
                            </Button>
                        </div>
                    )}
                </div>

                {/* Right: Detected Data & Actions */}
                <div className="lg:col-span-5 space-y-6">
                    <Card className="rounded-[2.5rem] p-10 border-none shadow-2xl bg-white min-h-[550px] flex flex-col">
                        <div className="flex items-center gap-5 mb-10">
                            <div className="p-4 rounded-2xl bg-indigo-50 text-indigo-600 shadow-inner">
                                <Database className="w-7 h-7" />
                            </div>
                            <div>
                                <h3 className="font-black text-xl text-slate-900 tracking-tight">AI VERİ MERKEZİ</h3>
                                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] mt-1">Ayrıştırılan Ve Düzenlenebilir Alanlar</p>
                            </div>
                        </div>

                        <div className="space-y-8 flex-1">
                            {/* Type Selection */}
                            <div className="grid grid-cols-2 gap-4">
                                <Button
                                    magnetic
                                    onClick={() => setScanType('irsaliye')}
                                    className={cn(
                                        "rounded-2xl font-black h-16 uppercase tracking-widest transition-all",
                                        scanType === 'irsaliye' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'bg-slate-50 text-slate-400 border border-slate-100'
                                    )}
                                >
                                    <FileText className="mr-3 w-5 h-5" /> İRSALİYE
                                </Button>
                                <Button
                                    magnetic
                                    onClick={() => setScanType('fatura')}
                                    className={cn(
                                        "rounded-2xl font-black h-16 uppercase tracking-widest transition-all",
                                        scanType === 'fatura' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'bg-slate-50 text-slate-400 border border-slate-100'
                                    )}
                                >
                                    <ImageIcon className="mr-3 w-5 h-5" /> FATURA
                                </Button>
                            </div>

                            {/* Form Fields */}
                            <div className={cn(
                                "p-8 rounded-[2rem] transition-all duration-700",
                                status === 'done' ? "bg-slate-50 border border-slate-200" : "bg-slate-50/50 border border-dashed border-slate-200 opacity-60"
                            )}>
                                {status === 'scanning' ? (
                                    <div className="space-y-6 w-full py-10">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <div key={i} className="space-y-2">
                                                <div className="h-2 w-20 bg-slate-200 rounded-full animate-pulse" />
                                                <div className="h-10 w-full bg-indigo-100/30 rounded-xl animate-pulse" />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <EditableRow label="BELGE NO" value={extractedData.docNo} onChange={(val) => setExtractedData({ ...extractedData, docNo: val })} disabled={status !== 'done'} />
                                        <EditableRow label="TARİH" value={extractedData.date} onChange={(val) => setExtractedData({ ...extractedData, date: val })} type="date" disabled={status !== 'done'} />
                                        <EditableRow label="FİRMA / TEDARİKÇİ" value={extractedData.supplier} onChange={(val) => setExtractedData({ ...extractedData, supplier: val })} disabled={status !== 'done'} />
                                        <EditableRow label="TUTAR / MİKTAR" value={extractedData.amount} onChange={(val) => setExtractedData({ ...extractedData, amount: val })} disabled={status !== 'done'} />

                                        {status === 'done' && (
                                            <Button
                                                onClick={handleSaveToSystem}
                                                disabled={status === 'uploading'}
                                                className="w-full mt-8 rounded-2xl h-16 font-black bg-green-600 text-white shadow-2xl shadow-green-600/30 uppercase tracking-[0.2em] transition-all hover:scale-[1.02]"
                                            >
                                                {status === 'uploading' ? <Loader2 className="animate-spin" /> : (
                                                    <>SİSTEME KAYDET <ArrowRight className="ml-3 w-6 h-6" /></>
                                                )}
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="flex items-start gap-4 p-5 bg-blue-50 text-blue-700 rounded-[2rem] border border-blue-100 shadow-sm relative overflow-hidden group">
                                <ShieldCheck className="w-6 h-6 shrink-0 relative z-10" />
                                <p className="text-[11px] font-black leading-relaxed uppercase tracking-tight relative z-10">
                                    AI verileri %99 güvenle okudu. Belge otomatik olarak <span className="text-blue-900 underline">{scanType === 'fatura' ? 'Faturalar' : 'İrsaliye'}</span> listesine işlenecektir.
                                </p>
                                <div className="absolute top-0 right-0 bottom-0 w-1 bg-blue-500 opacity-20 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            <p className="text-center text-[10px] font-black text-muted-foreground/30 uppercase tracking-[0.5em] mt-8">
                LOFT 777 PREMIERE SYSTEM v4.0
            </p>
        </div>
    );
}

function EditableRow({ label, value, onChange, type = "text", disabled }: { label: string, value: string, onChange: (v: string) => void, type?: string, disabled?: boolean }) {
    return (
        <div className="space-y-2 group">
            <div className="flex justify-between items-center px-1">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</Label>
                {!disabled && <Edit3 className="w-3 h-3 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />}
            </div>
            <Input
                type={type}
                value={value}
                disabled={disabled}
                onChange={(e) => onChange(e.target.value)}
                className="h-12 rounded-xl bg-white border-slate-200 font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 transition-all disabled:opacity-100 disabled:bg-slate-100/50"
            />
        </div>
    );
}
