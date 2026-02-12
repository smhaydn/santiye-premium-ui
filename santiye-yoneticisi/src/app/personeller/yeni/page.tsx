'use client';

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { User, Building2, Briefcase, FileText, CheckCircle2, ChevronRight, ChevronLeft, Save, Shield, MapPin, Calendar, Heart, GraduationCap, Users } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import gsap from 'gsap';
import { cn } from "@/lib/utils";
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PersonnelWizardPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const stepContainerRef = useRef<HTMLDivElement>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', role: '', company: 'Loft 777', team: '',
        tc_no: '', is_active: true, is_company_official: false,
        birth_place: '', birth_date: '', gender: '', start_date: '',
        iban: '', sgk_no: '', marital_status: '', child_count: 0,
        blood_type: '', address: '', country: 'Türkiye', city: '',
        permissions: {}, project_permissions: {}
    });

    const [selectedProject, setSelectedProject] = useState<string>("");

    // Step Transition Animation
    useEffect(() => {
        if (stepContainerRef.current) {
            gsap.fromTo(stepContainerRef.current,
                { x: 30, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.6, ease: "expo.out" }
            );
        }
    }, [step]);

    const totalSteps = formData.is_active ? 4 : 2;

    const nextStep = () => {
        if (step === 1 && (!formData.name || (formData.is_active && !formData.email))) {
            toast.error("Lütfen zorunlu alanları (Ad Soyad, Email) doldurunuz.");
            return;
        }
        setStep(prev => Math.min(prev + 1, totalSteps));
    };

    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/personnel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const result = await res.json();
            if (result.success) {
                toast.success("✅ Personel başarıyla kaydedildi.");
                router.push('/personeller');
            } else {
                toast.error("Hata: " + result.error);
            }
        } catch (error) {
            toast.error("Sunucu hatası");
        } finally {
            setLoading(false);
        }
    };

    const setCompanyPermission = (val: string) => {
        let perms = {};
        if (val === 'admin') perms = { b: 'full', p: 'full', t: 'full', m: 'full', e: 'full', s: 'full', d: 'full', c: 'full' };
        else if (val === 'saha') perms = { b: 'none', p: 'none', t: 'view', m: 'full', e: 'edit', s: 'full', d: 'view', c: 'none' };
        setFormData({ ...formData, permissions: perms });
    };

    return (
        <div className="w-full max-w-5xl mx-auto space-y-6 font-sans pb-32 px-4">
            <PageHeader
                title="Yeni Personel Kaydı"
                backLink="/personeller"
                subtitle={`${step}. ADIM: ${step === 1 ? 'KİMLİK VE ROL' :
                        step === 2 ? 'KİŞİSEL DETAYLAR' :
                            step === 3 ? 'YETKİ TANIMLARI' : 'ONAY VE BELGE'
                    }`}
            />

            {/* Steps Progress */}
            <div className="flex items-center justify-between px-16 mb-12 relative">
                <div className="absolute top-1/2 left-16 right-16 h-1 bg-border/40 -translate-y-1/2 z-0 rounded-full" />
                <div
                    className="absolute top-1/2 left-16 h-1 bg-primary -translate-y-1/2 z-1 transition-all duration-700 ease-in-out rounded-full shadow-[0_0_15px_rgba(var(--primary),0.4)]"
                    style={{ width: `calc(${(step - 1) / (totalSteps - 1)} * (100% - 8rem))` }}
                />

                {Array.from({ length: totalSteps }).map((_, i) => (
                    <div
                        key={i + 1}
                        className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${step >= (i + 1) ? 'bg-primary border-primary text-white scale-110 shadow-xl shadow-primary/20' : 'bg-background border-border text-muted-foreground'
                            }`}
                    >
                        {step > (i + 1) ? <CheckCircle2 className="w-7 h-7" /> : <span className="text-base font-black">{i + 1}</span>}
                    </div>
                ))}
            </div>

            <Card className="glass-card shadow-2xl rounded-[3rem] overflow-hidden border-none min-h-[600px] flex flex-col relative">
                <CardHeader className="p-8 pb-4 border-b border-border/30 bg-muted/5">
                    <div className="flex items-center gap-5">
                        <div className={`p-4 rounded-2xl transition-all duration-500 shadow-inner ${step === 1 ? 'bg-primary/10 text-primary' : step === 2 ? 'bg-orange-500/10 text-orange-500' : 'bg-blue-500/10 text-blue-500'
                            }`}>
                            {step === 1 ? <User className="w-7 h-7" /> : step === 2 ? <Briefcase className="w-7 h-7" /> : <Shield className="w-7 h-7" />}
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-black tracking-tight">
                                {step === 1 ? 'Personel Kimliği' : step === 2 ? 'Ekstra Bilgiler' : step === 3 ? 'Erişim Yetkileri' : 'Son Onay'}
                            </CardTitle>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{step}/{totalSteps} AŞAMA • HR MODULE</p>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="flex-1 p-8 md:p-12" ref={stepContainerRef}>
                    {step === 1 && (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                                <div className="space-y-4">
                                    <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Hesap Durumu</Label>
                                    <div className="flex gap-4">
                                        <div
                                            onClick={() => setFormData({ ...formData, is_active: true })}
                                            className={cn("flex-1 p-4 rounded-2xl border-2 cursor-pointer transition-all", formData.is_active ? "border-primary bg-primary/5" : "border-border/60")}
                                        >
                                            <p className="font-black text-sm">AKTİF</p>
                                            <p className="text-[10px] text-muted-foreground">Sisteme Giriş Yapabilir</p>
                                        </div>
                                        <div
                                            onClick={() => setFormData({ ...formData, is_active: false })}
                                            className={cn("flex-1 p-4 rounded-2xl border-2 cursor-pointer transition-all", !formData.is_active ? "border-orange-500 bg-orange-500/5" : "border-border/60")}
                                        >
                                            <p className="font-black text-sm">PASİF</p>
                                            <p className="text-[10px] text-muted-foreground">Sadece Kayıtlı Personel</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4 pt-10">
                                    <div className="flex items-center gap-3 bg-muted/20 p-4 rounded-2xl border">
                                        <Switch checked={formData.is_company_official} onCheckedChange={(v) => setFormData({ ...formData, is_company_official: v })} />
                                        <Label className="font-bold cursor-pointer">Firma Yetkilisi / Admin</Label>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Ad Soyad *</Label>
                                    <Input placeholder="Ad Soyad..." value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="h-14 rounded-xl font-bold border-border/60" />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">E-Posta Adresi {formData.is_active && '*'}</Label>
                                    <Input placeholder="email@firma.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="h-14 rounded-xl font-bold border-border/60" />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Ünvan / Rol</Label>
                                    <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v })}>
                                        <SelectTrigger className="h-14 rounded-xl font-bold border-border/60">
                                            <SelectValue placeholder="Seçiniz..." />
                                        </SelectTrigger>
                                        <SelectContent className="glass">
                                            {["Mühendis", "Mimar", "Taşeron", "Saha Elemanı", "Depocu", "Muhasebe"].map(r => (
                                                <SelectItem key={r} value={r.toLowerCase()}>{r}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Telefon No</Label>
                                    <Input placeholder="05XX XXX XX XX" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="h-14 rounded-xl font-bold border-border/60" />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-8 h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black text-muted-foreground uppercase">T.C. Kimlik No</Label>
                                    <Input value={formData.tc_no} onChange={(e) => setFormData({ ...formData, tc_no: e.target.value })} className="h-12 rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black text-muted-foreground uppercase">Doğum Tarihi</Label>
                                    <Input type="date" value={formData.birth_date} onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })} className="h-12 rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black text-muted-foreground uppercase">Kan Grubu</Label>
                                    <Select value={formData.blood_type} onValueChange={(v) => setFormData({ ...formData, blood_type: v })}>
                                        <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="Seç" /></SelectTrigger>
                                        <SelectContent>
                                            {["A Rh+", "A Rh-", "B Rh+", "B Rh-", "0 Rh+", "0 Rh-", "AB Rh+", "AB Rh-"].map(bt => (
                                                <SelectItem key={bt} value={bt}>{bt}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black text-muted-foreground uppercase">Eğitim Durumu</Label>
                                    <Select value={formData.education_status} onValueChange={(v) => setFormData({ ...formData, education_status: v })}>
                                        <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {["Lise", "Ön Lisans", "Lisans", "Yüksek Lisans", "Doktora"].map(e => (<SelectItem key={e} value={e.toLowerCase()}>{e}</SelectItem>))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black text-muted-foreground uppercase">Şehir / İkamet</Label>
                                    <Input value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="h-12 rounded-xl" placeholder="İstanbul..." />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-muted-foreground uppercase">IBAN No</Label>
                                <Input value={formData.iban} onChange={(e) => setFormData({ ...formData, iban: e.target.value })} className="h-12 rounded-xl font-mono text-xs" placeholder="TR00 0000..." />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-muted-foreground uppercase">Adres Detayı</Label>
                                <Textarea value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="rounded-xl min-h-[80px]" />
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-8">
                            <div className="flex items-center gap-6 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800">
                                <div className="p-3 bg-white dark:bg-black rounded-2xl shadow-sm">
                                    <Shield className="w-8 h-8 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-black text-lg tracking-tight">Şirket Genel Yetkileri</h3>
                                    <p className="text-xs text-muted-foreground">Personelin ana modüllere olan erişim seviyesini belirleyin.</p>
                                </div>
                                <Select onValueChange={setCompanyPermission}>
                                    <SelectTrigger className="w-56 h-12 rounded-xl border-blue-500/30 bg-white">
                                        <SelectValue placeholder="Şablon Seç" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">Sistem Yöneticisi</SelectItem>
                                        <SelectItem value="saha">Saha / Tekniker</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="p-6 bg-indigo-50 dark:bg-indigo-900/10 rounded-3xl border border-indigo-200 dark:border-indigo-800/50">
                                <div className="flex items-center gap-4 mb-6">
                                    <Briefcase className="w-6 h-6 text-indigo-600" />
                                    <h3 className="font-black text-lg tracking-tight text-indigo-900 dark:text-indigo-400 uppercase">Proje Bazlı Yetkiler</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase text-indigo-700/60">Aktif Proje Seçimi</Label>
                                        <Select value={selectedProject} onValueChange={setSelectedProject}>
                                            <SelectTrigger className="h-14 rounded-2xl bg-white border-indigo-200"><SelectValue placeholder="Proje Seç..." /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="loft">LOFT 777</SelectItem>
                                                <SelectItem value="vadi">VADİ İSTANBUL</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase text-indigo-700/60">Proje Rolü</Label>
                                        <Select disabled={!selectedProject} onValueChange={(v) => {
                                            const p = v === 'full' ? { irsaliye: 'full', beton: 'full', talep: 'full' } : { irsaliye: 'view', beton: 'view', talep: 'none' };
                                            setFormData({ ...formData, project_permissions: { ...formData.project_permissions, [selectedProject]: p } });
                                        }}>
                                            <SelectTrigger className="h-14 rounded-2xl bg-white border-indigo-200"><SelectValue placeholder="Seviye Seç..." /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="full">Tam Yetki</SelectItem>
                                                <SelectItem value="view">Sadece İzleme</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-8 flex flex-col items-center justify-center text-center">
                            <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                                <FileText className="w-12 h-12 text-green-500 animate-bounce" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black tracking-tight text-foreground uppercase">Kayıt Hazır</h2>
                                <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                                    {formData.name} isimli personel <b>{formData.role}</b> rolü ile <b>{formData.is_active ? 'AKTİF' : 'PASİF'}</b> olarak kaydedilecektir.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 w-full max-w-lg mt-8">
                                <div className="p-4 bg-muted/20 border rounded-2xl text-left">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase">Yetki Seviyesi</p>
                                    <p className="font-bold">{Object.keys(formData.permissions).length > 0 ? 'Admin/Özel' : 'Standart'}</p>
                                </div>
                                <div className="p-4 bg-muted/20 border rounded-2xl text-left">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase">Projeler</p>
                                    <p className="font-bold">{Object.keys(formData.project_permissions).length} Proje</p>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>

                <div className="p-8 border-t border-border/40 mt-auto bg-muted/5 flex items-center justify-between gap-6">
                    {step > 1 ? (
                        <Button magnetic variant="ghost" onClick={prevStep} className="rounded-2xl h-16 px-10 font-black text-muted-foreground hover:text-foreground uppercase tracking-tight">
                            <ChevronLeft className="mr-3 h-6 w-6" /> GERİ
                        </Button>
                    ) : <div />}

                    {step < totalSteps ? (
                        <Button magnetic onClick={nextStep} className="rounded-2xl h-16 px-12 font-black shadow-2xl shadow-primary/20 bg-foreground text-background hover:bg-foreground/90 uppercase tracking-tight">
                            SONRAKİ <ChevronRight className="ml-3 h-6 w-6" />
                        </Button>
                    ) : (
                        <Button magnetic onClick={handleSubmit} disabled={loading} className="rounded-full h-16 px-16 font-black shadow-2xl shadow-primary/30 bg-primary hover:bg-primary/90 text-white uppercase tracking-tight">
                            {loading ? (
                                <span className="flex items-center gap-3">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> KAYDEDİLİYOR...
                                </span>
                            ) : (
                                <span className="flex items-center gap-3">
                                    <Save className="w-6 h-6" /> PERSONELİ KAYDET
                                </span>
                            )}
                        </Button>
                    )}
                </div>
            </Card>

            <div className="flex justify-center items-center gap-8 opacity-20 py-4">
                <Building2 className="w-6 h-6" />
                <Users className="w-6 h-6" />
                <Briefcase className="w-6 h-6" />
            </div>
        </div>
    );
}
