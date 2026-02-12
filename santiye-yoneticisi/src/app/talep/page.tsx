'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useReactToPrint } from 'react-to-print';
import { PageHeader } from "@/components/layout/page-header";
import { ShoppingCart, Package, AlertCircle, User, ChevronRight, ChevronLeft, Save, Printer, ArrowLeft, RefreshCw, CheckCircle2 } from 'lucide-react';
import gsap from 'gsap';
import { cn } from "@/lib/utils";
import { toast } from 'sonner';

export default function RequestWizardPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [lastRequest, setLastRequest] = useState<any>(null);
    const printRef = useRef(null);
    const stepContainerRef = useRef<HTMLDivElement>(null);

    const [formData, setFormData] = useState({
        request_date: new Date().toISOString().split('T')[0],
        requester: 'Şantiye Şefi',
        item_name: '',
        quantity: '',
        unit: 'Adet',
        urgency: 'Normal'
    });

    // Step Transition Animation
    useEffect(() => {
        if (stepContainerRef.current) {
            gsap.fromTo(stepContainerRef.current,
                { x: 40, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.6, ease: "expo.out" }
            );
        }
    }, [step]);

    const handlePrint = useReactToPrint({
        contentRef: printRef,
    });

    const nextStep = () => {
        if (step === 1 && (!formData.item_name || !formData.quantity)) {
            toast.error("Lütfen malzeme adı ve miktarı giriniz.");
            return;
        }
        setStep(prev => Math.min(prev + 1, 2));
    };

    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/sync-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const result = await res.json();

            if (result.success) {
                setLastRequest(result.data);
                toast.success("✅ Talep başarıyla kaydedildi!");
            } else {
                toast.error("Hata: " + result.error);
            }
        } catch (err) {
            toast.error("Sunucu hatası");
        } finally {
            setLoading(false);
        }
    };

    // --- Success View (Print) ---
    if (lastRequest) {
        return (
            <div className="min-h-screen bg-neutral-100/50 p-4 md:p-12 flex flex-col items-center gap-8 font-sans pb-32">
                <Card delay={0.1} className="w-full max-w-4xl bg-white shadow-2xl rounded-[2.5rem] overflow-hidden border-none animate-in fade-in zoom-in duration-500">
                    <div className="bg-green-500 text-white p-6 flex items-center justify-center gap-3">
                        <CheckCircle2 className="w-6 h-6" />
                        <span className="text-lg font-black tracking-tight uppercase">Talep Başarıyla Sisteme İşlendi</span>
                    </div>

                    <div className="p-8 pb-32 relative">
                        {/* Printable Area */}
                        <div ref={printRef} className="bg-white p-12 border-2 border-black/5 rounded-xl text-black print:p-0 print:border-none relative">
                            <div className="border-b-4 border-primary pb-6 mb-10 flex flex-col items-center text-center">
                                <div className="bg-primary/10 text-primary p-4 rounded-3xl mb-4">
                                    <ShoppingCart className="w-10 h-10" />
                                </div>
                                <h1 className="text-3xl font-black tracking-tighter uppercase">Malzeme Satın Alma Talep Formu</h1>
                                <div className="mt-4 px-6 py-2 bg-muted rounded-full text-xs font-black tracking-widest text-muted-foreground uppercase">
                                    REFERANS: #{lastRequest.id.split('-')[0].toUpperCase()} • TARİH: {lastRequest.request_date}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
                                <div className="space-y-6">
                                    <div className="group">
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 underline decoration-primary/30 underline-offset-4">Talebi Yapan Birim</p>
                                        <p className="text-xl font-black text-foreground">{lastRequest.requester}</p>
                                    </div>
                                    <div className="group">
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 underline decoration-primary/30 underline-offset-4">Aciliyet Durumu</p>
                                        <div className={cn(
                                            "inline-flex px-4 py-1.5 rounded-lg text-sm font-black uppercase tracking-tighter",
                                            lastRequest.urgency === 'Normal' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                                        )}>
                                            {lastRequest.urgency}
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="group">
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 underline decoration-primary/30 underline-offset-4">Talep Edilen Malzeme</p>
                                        <p className="text-2xl font-black text-primary tracking-tight leading-tight">{lastRequest.item_name}</p>
                                    </div>
                                    <div className="group">
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 underline decoration-primary/30 underline-offset-4">İstenen Miktar</p>
                                        <p className="text-3xl font-black text-foreground">{lastRequest.quantity} <span className="text-lg text-muted-foreground ml-1">{lastRequest.unit}</span></p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-8 text-center pt-10 border-t border-dashed border-black/10">
                                <div>
                                    <div className="h-16 flex items-end justify-center pb-2 text-muted-foreground/20 italic text-xs uppercase font-black">Dijital Onay</div>
                                    <p className="text-xs font-black border-t-2 border-black pt-3 uppercase tracking-widest">Talep Eden</p>
                                </div>
                                <div>
                                    <div className="h-16 flex items-end justify-center pb-2 text-muted-foreground/20 italic text-xs uppercase font-black">Bekliyor...</div>
                                    <p className="text-xs font-black border-t-2 border-black pt-3 uppercase tracking-widest">Proje Müdürü</p>
                                </div>
                                <div>
                                    <div className="h-16 flex items-end justify-center pb-2 text-muted-foreground/20 italic text-xs uppercase font-black">Bekliyor...</div>
                                    <p className="text-xs font-black border-t-2 border-black pt-3 uppercase tracking-widest">Şantiye Şefi</p>
                                </div>
                            </div>

                            <div className="mt-20 text-center opacity-20">
                                <p className="text-[8px] font-black uppercase tracking-[0.5em]">LOFT 777 AUTOMATION INFRASTRUCTURE • DIGITAL RECORD</p>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Print Controls */}
                <div className="flex flex-wrap justify-center gap-4 fixed bottom-10 z-50 animate-in slide-in-from-bottom duration-700">
                    <Button magnetic onClick={() => handlePrint()} className="h-16 px-10 rounded-2xl bg-primary text-white font-black shadow-2xl flex items-center gap-3 text-lg transition-transform hover:scale-110">
                        <Printer className="w-6 h-6" /> PDF / YAZDIR
                    </Button>
                    <Button magnetic variant="outline" onClick={() => router.push('/')} className="h-16 px-10 rounded-2xl bg-white border-2 font-black shadow-xl flex items-center gap-3 text-lg">
                        <ArrowLeft className="w-6 h-6" /> ANA MENÜ
                    </Button>
                    <Button magnetic variant="outline" onClick={() => { setLastRequest(null); setStep(1); setFormData(prev => ({ ...prev, item_name: '', quantity: '' })) }} className="h-16 px-10 rounded-2xl bg-orange-100 border-orange-200 text-orange-700 font-black shadow-xl flex items-center gap-3 text-lg transition-transform hover:scale-105 active:scale-95">
                        <RefreshCw className="w-6 h-6" /> YENİ TALEP
                    </Button>
                </div>
            </div>
        );
    }

    // --- Form View (Wizard) ---
    return (
        <div className="w-full max-w-2xl mx-auto space-y-8 font-sans pb-32 px-4">
            <PageHeader
                title="Yeni Satın Alma Talebi"
                backLink="/"
                subtitle={`${step}. ADIM: ${step === 1 ? 'MALZEME TANIMI' : 'TALEP DETAYLARI'}`}
            />

            {/* Steps Progress */}
            <div className="flex items-center justify-between px-20 mb-10 relative">
                <div className="absolute top-1/2 left-20 right-20 h-1 bg-border/40 -translate-y-1/2 z-0 rounded-full" />
                <div
                    className="absolute top-1/2 left-20 h-1 bg-primary -translate-y-1/2 z-1 transition-all duration-700 ease-in-out rounded-full shadow-[0_0_10px_rgba(var(--primary),0.3)]"
                    style={{ width: `${(step - 1) * 100}%` }}
                />

                {[1, 2].map((s) => (
                    <div
                        key={s}
                        className={`relative z-10 w-14 h-14 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${step >= s ? 'bg-primary border-primary text-white scale-110 shadow-xl shadow-primary/20' : 'bg-background border-border text-muted-foreground'
                            }`}
                    >
                        {step > s ? <CheckCircle2 className="w-8 h-8" /> : (
                            s === 1 ? <Package className="w-7 h-7" /> : <User className="w-7 h-7" />
                        )}
                    </div>
                ))}
            </div>

            <Card delay={0.1} className="glass-card shadow-2xl rounded-[3rem] overflow-hidden border-none min-h-[400px] flex flex-col transition-all duration-500">
                <CardHeader className="p-8 pb-4 border-b border-border/30 bg-muted/10">
                    <div className="flex items-center gap-4">
                        <div className={cn(
                            "p-4 rounded-2xl transition-all duration-500",
                            step === 1 ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
                        )}>
                            {step === 1 ? <ShoppingCart className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-black tracking-tight">{step === 1 ? 'Malzeme Seçimi' : 'Gönderim & Onay'}</CardTitle>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Malzeme İstek Sihirbazı v2.0</p>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="flex-1 p-10 md:p-14" ref={stepContainerRef}>
                    {step === 1 && (
                        <div className="space-y-10">
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">İstenen Malzeme / Hizmet</Label>
                                <Input
                                    placeholder="Örn: 10'luk İnşaat Çivisi, İş Eldiveni..."
                                    value={formData.item_name}
                                    onChange={(e) => setFormData({ ...formData, item_name: e.target.value })}
                                    className="h-16 text-xl font-black bg-muted/10 border-border/60 rounded-2xl focus:ring-primary/20 transition-all placeholder:text-muted-foreground/30 px-6"
                                    required
                                />
                            </div>

                            <div className="space-y-3">
                                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">İhtiyaç Miktarı ve Birim</Label>
                                <div className="flex gap-4">
                                    <Input
                                        type="number"
                                        placeholder="0.00"
                                        value={formData.quantity}
                                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                        className="h-16 flex-1 text-2xl font-black bg-blue-500/5 text-blue-600 border-blue-500/20 rounded-2xl px-6 text-center"
                                        required
                                    />
                                    <Select
                                        value={formData.unit}
                                        onValueChange={(val) => setFormData({ ...formData, unit: val })}
                                    >
                                        <SelectTrigger className="h-16 w-[160px] rounded-2xl text-lg font-black bg-muted/10 border-border/60">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl glass">
                                            {["Adet", "Ton", "Kg", "Metre", "m2", "m3", "Kutu", "Paket", "Litre", "Sefer"].map(u => (
                                                <SelectItem key={u} value={u} className="rounded-xl font-bold">{u}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-10">
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Aciliyet Seviyesi</Label>
                                <Select onValueChange={(val) => setFormData({ ...formData, urgency: val })} defaultValue={formData.urgency}>
                                    <SelectTrigger className="h-16 rounded-2xl text-lg font-black bg-muted/10 border-border/60 px-6">
                                        <SelectValue placeholder="Seç" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl glass">
                                        <SelectItem value="Normal" className="rounded-xl font-bold">NORMAL (3-5 İŞ GÜNÜ)</SelectItem>
                                        <SelectItem value="Acil" className="rounded-xl font-bold text-orange-500">ACİL (24 SAAT)</SelectItem>
                                        <SelectItem value="Çok Acil" className="rounded-xl font-bold text-red-600">🔥🔥 ÇOK ACİL (HEMEN)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Talep Eden Sorumlu</Label>
                                <div className="relative">
                                    <Input
                                        value={formData.requester}
                                        onChange={(e) => setFormData({ ...formData, requester: e.target.value })}
                                        className="h-16 pl-12 text-lg font-black bg-background border-border/60 rounded-2xl focus:ring-accent/20 transition-all shadow-inner"
                                    />
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>

                <div className="p-8 border-t border-border/30 mt-auto bg-muted/5 flex items-center justify-between gap-6">
                    {step > 1 ? (
                        <Button magnetic variant="ghost" onClick={prevStep} className="rounded-2xl h-16 px-10 font-black text-muted-foreground hover:text-foreground uppercase tracking-tight">
                            <ChevronLeft className="mr-3 h-6 w-6" /> GERİ
                        </Button>
                    ) : <div />}

                    {step < 2 ? (
                        <Button magnetic onClick={nextStep} className="rounded-2xl h-16 px-12 font-black shadow-2xl shadow-primary/20 bg-foreground text-background hover:bg-foreground/90 uppercase tracking-tight">
                            DETAYLAR <ChevronRight className="ml-3 h-6 w-6" />
                        </Button>
                    ) : (
                        <Button magnetic onClick={handleSubmit} disabled={loading} className="rounded-full h-16 px-16 font-black shadow-2xl shadow-primary/30 bg-primary hover:bg-primary/90 text-white uppercase tracking-tight">
                            {loading ? (
                                <span className="flex items-center gap-3">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> İŞLENİYOR...
                                </span>
                            ) : (
                                <span className="flex items-center gap-3">
                                    <Save className="w-6 h-6" /> TALEBİ ONAYLA
                                </span>
                            )}
                        </Button>
                    )}
                </div>
            </Card>

            <div className="text-center opacity-30 select-none">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.5em]">
                    LOFT 777 CORE SYSTEM • 2026
                </p>
            </div>
        </div>
    );
}
