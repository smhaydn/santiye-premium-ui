'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageHeader } from "@/components/layout/page-header";
import { Hammer, Truck, Building2, Calculator, Calendar, Save, ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import gsap from 'gsap';

const CONCRETE_CLASSES = ["C25", "C30", "C35", "C40", "C45", "C50"];
const CASTING_TYPES = ["Pompalı", "Mikser (Transmikser)", "Kovalı", "Vinç ile"];

export default function ConcreteWizardPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const stepContainerRef = useRef<HTMLDivElement>(null);

    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        supplier: 'Öztop',
        concrete_class: '',
        casting_type: 'Pompalı',
        location_block: '',
        location_floor: '',
        quantity: '',
        slump: ''
    });

    // Step Transition Animation
    useEffect(() => {
        if (stepContainerRef.current) {
            gsap.fromTo(stepContainerRef.current,
                { x: 30, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.6, ease: "expo.out" }
            );
        }
    }, [step]);

    const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/sync-concrete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await res.json();
            if (result.success) {
                toast.success("✅ Beton dökümü başarıyla kaydedildi!");
                router.push('/');
            } else {
                toast.error("Hata: " + result.error);
            }
        } catch (err) {
            toast.error("Bir hata oluştu");
        } finally {
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Kayıt Tarihi</Label>
                                <Input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="h-14 bg-muted/20 border-border/60 rounded-2xl focus:ring-primary/20 text-lg font-bold"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Tedarikçi Firma</Label>
                                <Input value={formData.supplier} disabled className="h-14 bg-muted/40 font-bold cursor-not-allowed border-dashed rounded-2xl opacity-60" />
                            </div>
                        </div>
                        <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10">
                            <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Bilgi</h4>
                            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                                Standart tedarikçi "Öztop" olarak kilitlenmiştir. Diğer tedarikçiler için sistem yöneticisine başvurun.
                            </p>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Yapı / Blok</Label>
                                <Input
                                    placeholder="Örn: A-Blok Rezidans"
                                    value={formData.location_block}
                                    onChange={(e) => setFormData({ ...formData, location_block: e.target.value })}
                                    className="h-14 border-border/60 rounded-2xl bg-white/50 dark:bg-black/20 focus:ring-accent/20 text-lg font-bold shadow-sm"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Kat & Eleman</Label>
                                <Input
                                    placeholder="Örn: 12. Kat Kolonlar"
                                    value={formData.location_floor}
                                    onChange={(e) => setFormData({ ...formData, location_floor: e.target.value })}
                                    className="h-14 border-border/60 rounded-2xl bg-white/50 dark:bg-black/20 focus:ring-accent/20 text-lg font-bold shadow-sm"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-accent/60">
                            <MapPin className="w-5 h-5" />
                            <span className="text-xs font-bold uppercase tracking-wider">Saha lokasyonu doğrulanıyor...</span>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-8 text-left">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Beton Sınıfı</Label>
                                <Select onValueChange={(val) => setFormData({ ...formData, concrete_class: val })} defaultValue={formData.concrete_class}>
                                    <SelectTrigger className="h-14 border-border/60 rounded-2xl bg-muted/10 text-lg font-bold">
                                        <SelectValue placeholder="Sınıf Seçiniz" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl glass">
                                        {CONCRETE_CLASSES.map(c => <SelectItem key={c} value={c} className="rounded-xl">{c}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Döküm Metodu</Label>
                                <Select onValueChange={(val) => setFormData({ ...formData, casting_type: val })} defaultValue={formData.casting_type}>
                                    <SelectTrigger className="h-14 border-border/60 rounded-2xl bg-muted/10 text-lg font-bold">
                                        <SelectValue placeholder="Metod Seçiniz" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl glass">
                                        {CASTING_TYPES.map(c => <SelectItem key={c} value={c} className="rounded-xl">{c}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center justify-between ml-1">
                                    <span>Planlanan Miktar (m³)</span>
                                    <Calculator className="w-4 h-4 text-blue-500" />
                                </Label>
                                <Input
                                    type="number"
                                    step="0.5"
                                    placeholder="0.00"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                    className="h-16 font-black text-3xl bg-blue-500/5 border-blue-500/30 text-blue-600 rounded-[1.5rem] focus:ring-blue-500/20 text-center"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Kıvam (Slump) CM</Label>
                                <Input
                                    type="number"
                                    placeholder="16"
                                    value={formData.slump}
                                    onChange={(e) => setFormData({ ...formData, slump: e.target.value })}
                                    className="h-16 font-black text-3xl border-border/60 rounded-[1.5rem] text-center focus:ring-primary/20 bg-muted/5"
                                />
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto space-y-6 font-sans pb-32">
            <PageHeader
                title="Beton Döküm Sihirbazı"
                backLink="/"
                subtitle={`${step}. ADIM: ${step === 1 ? 'TEMEL VERİLER' : step === 2 ? 'SAHA LOKASYONU' : 'TEKNİK DETAYLAR'}`}
            />

            {/* Steps Progress Indicator */}
            <div className="flex items-center justify-between px-12 mb-8 relative">
                <div className="absolute top-1/2 left-12 right-12 h-0.5 bg-border -translate-y-1/2 z-0" />
                <div
                    className="absolute top-1/2 left-12 h-0.5 bg-primary -translate-y-1/2 z-1 transition-all duration-500 ease-in-out"
                    style={{ width: `calc(${(step - 1) / 2} * (100% - 6rem))` }}
                />

                {[1, 2, 3].map((s) => (
                    <div
                        key={s}
                        className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${step >= s ? 'bg-primary border-primary text-white scale-110 shadow-lg shadow-primary/20' : 'bg-background border-border text-muted-foreground'
                            }`}
                    >
                        {step > s ? <CheckCircle2 className="w-6 h-6" /> : <span className="text-sm font-black">{s}</span>}
                    </div>
                ))}
            </div>

            <Card delay={0.1} className="glass-card shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.4)] rounded-[3rem] overflow-hidden border-none min-h-[450px] flex flex-col">
                <CardHeader className="p-8 pb-0 flex flex-row items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl transition-colors duration-500 ${step === 1 ? 'bg-primary/10 text-primary' : step === 2 ? 'bg-accent/10 text-accent' : 'bg-blue-500/10 text-blue-500'}`}>
                            {step === 1 ? <Calendar className="w-6 h-6" /> : step === 2 ? <Building2 className="w-6 h-6" /> : <Calculator className="w-6 h-6" />}
                        </div>
                        <div>
                            <CardTitle className="text-xl font-black">{step === 1 ? 'Tarih ve Firma' : step === 2 ? 'Lokasyon Tanımı' : 'Beton Spesifikasyonu'}</CardTitle>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Sertifika v2.4-Premium</p>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="flex-1 p-8 md:p-12" ref={stepContainerRef}>
                    {renderStep()}
                </CardContent>

                <div className="p-8 pt-0 mt-auto border-t border-border/50 flex items-center justify-between gap-4">
                    {step > 1 ? (
                        <Button
                            magnetic
                            variant="ghost"
                            onClick={prevStep}
                            className="rounded-2xl h-14 px-8 font-black text-muted-foreground hover:text-foreground"
                        >
                            <ChevronLeft className="mr-2 h-5 w-5" /> GERİ
                        </Button>
                    ) : <div />}

                    {step < 3 ? (
                        <Button
                            magnetic
                            onClick={nextStep}
                            className="rounded-2xl h-14 px-10 font-black shadow-xl shadow-primary/20"
                        >
                            SONRAKİ <ChevronRight className="ml-2 h-5 w-5" />
                        </Button>
                    ) : (
                        <Button
                            magnetic
                            onClick={handleSubmit}
                            disabled={loading || !formData.concrete_class || !formData.quantity}
                            className="rounded-full h-14 px-12 font-black shadow-xl shadow-primary/30 bg-primary hover:bg-primary/90 text-white"
                        >
                            {loading ? 'KAYDEDİLİYOR...' : 'ONAYLA VE GÖNDER'}
                        </Button>
                    )}
                </div>
            </Card>

            <div className="text-center">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] opacity-30">
                    LOFT 777 TEKNOLOJİ ALTYAPISI
                </p>
            </div>
        </div>
    );
}

// Re-using Icon components
import { MapPin } from 'lucide-react';
