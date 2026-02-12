'use client';

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Building2, Mail, Phone, MapPin, User, FileText, Globe, CheckCircle2, ChevronRight, ChevronLeft, Save, Truck, Activity } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import gsap from 'gsap';
import { cn } from "@/lib/utils";
import { toast } from 'sonner';

export default function NewSupplierWizardPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const stepContainerRef = useRef<HTMLDivElement>(null);

    // Form State
    const [formData, setFormData] = useState({
        type: 'taseron',
        name: '',
        email: '',
        phone: '',
        fax: '',
        activities: [] as string[],
        country: 'tr',
        city: '',
        address: '',
        contact_name: '',
        contact_email: '',
        contact_phone: '',
        notes: '',
        is_active: true
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

    const nextStep = () => {
        if (step === 1 && !formData.name) {
            toast.error("Lütfen firma adını giriniz.");
            return;
        }
        setStep(prev => Math.min(prev + 1, 3));
    };

    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/suppliers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await res.json();
            if (result.success) {
                toast.success("✅ Firma başarıyla kaydedildi.");
                router.push('/tedarikciler');
            } else {
                toast.error("Hata: " + result.error);
            }
        } catch (err) {
            toast.error("Bağlantı hatası");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6 font-sans pb-32 px-4">
            <PageHeader
                title="Yeni Firma Kaydı"
                backLink="/tedarikciler"
                subtitle={`${step}. ADIM: ${step === 1 ? 'FİRMA KİMLİĞİ' : step === 2 ? 'ADRES VE KONUM' : 'YETKİLİ VE ONAY'}`}
            />

            {/* Steps Progress */}
            <div className="flex items-center justify-between px-12 mb-10 relative">
                <div className="absolute top-1/2 left-12 right-12 h-1 bg-border/40 -translate-y-1/2 z-0 rounded-full" />
                <div
                    className="absolute top-1/2 left-12 h-1 bg-primary -translate-y-1/2 z-1 transition-all duration-700 ease-in-out rounded-full shadow-[0_0_15px_rgba(var(--primary),0.4)]"
                    style={{ width: `calc(${(step - 1) / 2} * (100% - 6rem))` }}
                />

                {[1, 2, 3].map((s) => (
                    <div
                        key={s}
                        className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${step >= s ? 'bg-primary border-primary text-white scale-110 shadow-xl shadow-primary/20' : 'bg-background border-border text-muted-foreground'
                            }`}
                    >
                        {step > s ? <CheckCircle2 className="w-7 h-7" /> : <span className="text-base font-black">{s}</span>}
                    </div>
                ))}
            </div>

            <Card delay={0.1} className="glass-card shadow-2xl rounded-[3rem] overflow-hidden border-none min-h-[500px] flex flex-col relative transition-all duration-500">
                <CardHeader className="p-8 pb-4 border-b border-border/40 bg-muted/10">
                    <div className="flex items-center gap-5">
                        <div className={`p-4 rounded-2xl transition-all duration-500 shadow-inner ${step === 1 ? 'bg-primary/10 text-primary' : step === 2 ? 'bg-blue-500/10 text-blue-500' : 'bg-green-500/10 text-green-500'
                            }`}>
                            {step === 1 ? <Building2 className="w-7 h-7" /> : step === 2 ? <MapPin className="w-7 h-7" /> : <User className="w-7 h-7" />}
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-black tracking-tight">{step === 1 ? 'Firma Bilgileri' : step === 2 ? 'Lokasyon Detayları' : 'İrtibat & Ayarlar'}</CardTitle>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{step}/3 AŞAMA • TEDARİKÇİ PORTALI</p>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="flex-1 p-8 md:p-12" ref={stepContainerRef}>
                    {step === 1 && (
                        <div className="space-y-8">
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Firma Tipi</Label>
                                <RadioGroup defaultValue={formData.type} className="flex flex-wrap gap-4" onValueChange={(val) => setFormData({ ...formData, type: val })}>
                                    <div className={cn("flex items-center space-x-3 border-2 p-5 rounded-2xl w-full sm:w-48 transition-all cursor-pointer group", formData.type === 'taseron' ? "border-primary bg-primary/5 shadow-lg" : "border-border/60 hover:border-primary/30")}>
                                        <RadioGroupItem value="taseron" id="taseron" className="w-5 h-5" />
                                        <Label htmlFor="taseron" className="font-black text-sm cursor-pointer flex items-center gap-2">
                                            <User className="w-4 h-4" /> TAŞERON
                                        </Label>
                                    </div>
                                    <div className={cn("flex items-center space-x-3 border-2 p-5 rounded-2xl w-full sm:w-48 transition-all cursor-pointer group", formData.type === 'tedarikci' ? "border-orange-500 bg-orange-500/5 shadow-lg" : "border-border/60 hover:border-orange-300")}>
                                        <RadioGroupItem value="tedarikci" id="tedarikci" className="w-5 h-5" />
                                        <Label htmlFor="tedarikci" className="font-black text-sm cursor-pointer flex items-center gap-2">
                                            <Truck className="w-4 h-4" /> TEDARİKÇİ
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                <div className="space-y-3 col-span-1 md:col-span-2">
                                    <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Firma Resmi Ünvanı *</Label>
                                    <div className="relative">
                                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/40" />
                                        <Input placeholder="Tam firma adını giriniz..." value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="h-16 pl-12 text-xl font-black bg-muted/5 border-border/60 rounded-2xl focus:ring-primary/20" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Email Adresi</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/40" />
                                        <Input type="email" placeholder="email@firma.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="h-14 pl-12 rounded-xl bg-muted/5 border-border/60 font-bold" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Telefon</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/40" />
                                        <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="h-14 pl-12 rounded-xl bg-muted/5 border-border/60 font-bold" placeholder="05XX XXX XX XX" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Ülke</Label>
                                    <Select value={formData.country} onValueChange={(val) => setFormData({ ...formData, country: val })}>
                                        <SelectTrigger className="h-14 rounded-xl border-border/60 bg-muted/5 font-bold">
                                            <div className="flex items-center gap-2">
                                                <Globe className="w-4 h-4 text-primary" />
                                                <SelectValue />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl glass">
                                            <SelectItem value="tr">TÜRKİYE</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Şehir</Label>
                                    <Select onValueChange={(val) => setFormData({ ...formData, city: val })} value={formData.city}>
                                        <SelectTrigger className="h-14 rounded-xl border-border/60 bg-muted/5 font-bold">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-primary" />
                                                <SelectValue placeholder="Seçiniz..." />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl glass">
                                            {["İstanbul", "Ankara", "İzmir", "Bursa", "Antalya", "Adana", "Konya", "Gaziantep"].map(c => (
                                                <SelectItem key={c} value={c} className="rounded-lg">{c.toUpperCase()}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="col-span-1 md:col-span-2 space-y-3">
                                    <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Detaylı Adres</Label>
                                    <Textarea
                                        placeholder="Cadde, sokak, mahalle, no..."
                                        className="min-h-[120px] rounded-2xl border-border/60 bg-muted/5 font-medium p-6"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Yetkili Ad Soyad</Label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/40" />
                                        <Input placeholder="Yetkili Kişi" value={formData.contact_name} onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })} className="h-14 pl-12 rounded-xl bg-muted/5 border-border/60 font-bold" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Yetkili Telefon</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/40" />
                                        <Input value={formData.contact_phone} onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })} className="h-14 pl-12 rounded-xl bg-muted/5 border-border/60 font-bold" />
                                    </div>
                                </div>
                                <div className="col-span-1 md:col-span-2 space-y-3 p-6 bg-primary/5 rounded-[2rem] border border-primary/20">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-primary/10 rounded-xl">
                                                <Activity className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-sm uppercase tracking-tight">Firma Aktiflik Durumu</h4>
                                                <p className="text-xs text-muted-foreground">Aktif olmayan firmalar yeni kayıtlarda seçilemez.</p>
                                            </div>
                                        </div>
                                        <Switch checked={formData.is_active} onCheckedChange={(val) => setFormData({ ...formData, is_active: val })} className="scale-125" />
                                    </div>
                                </div>
                                <div className="col-span-1 md:col-span-2 space-y-3 mt-4">
                                    <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Notlar</Label>
                                    <Textarea placeholder="Firma hakkında ek bilgiler..." value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="rounded-2xl border-border/60 bg-muted/5" />
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>

                <div className="p-8 border-t border-border/40 mt-auto bg-muted/5 flex items-center justify-between gap-6">
                    {step > 1 ? (
                        <Button magnetic variant="ghost" onClick={prevStep} className="rounded-2xl h-16 px-10 font-black text-muted-foreground hover:text-foreground uppercase tracking-tight">
                            <ChevronLeft className="mr-3 h-6 w-6" /> GERİ GİT
                        </Button>
                    ) : (
                        <div />
                    )}

                    {step < 3 ? (
                        <Button magnetic onClick={nextStep} className="rounded-2xl h-16 px-12 font-black shadow-2xl shadow-primary/20 bg-foreground text-background hover:bg-foreground/90 uppercase tracking-tight">
                            SONRAKİ ADIM <ChevronRight className="ml-3 h-6 w-6" />
                        </Button>
                    ) : (
                        <Button magnetic onClick={handleSubmit} disabled={loading} className="rounded-full h-16 px-16 font-black shadow-2xl shadow-primary/30 bg-primary hover:bg-primary/90 text-white uppercase tracking-tight">
                            {loading ? (
                                <span className="flex items-center gap-3">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> YÜKLENİYOR...
                                </span>
                            ) : (
                                <span className="flex items-center gap-3">
                                    <Save className="w-6 h-6" /> FİRMAYI KAYDET
                                </span>
                            )}
                        </Button>
                    )}
                </div>
            </Card>

            <p className="text-center text-[10px] font-black text-muted-foreground/30 uppercase tracking-[0.5em]">
                LOFT 777 ENTERPRISE • V2.5.0
            </p>
        </div>
    );
}
