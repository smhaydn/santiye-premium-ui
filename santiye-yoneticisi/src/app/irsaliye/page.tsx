'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectGroup, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from '@/lib/supabase';
import { CameraInput } from "@/components/camera-input";
import { PageHeader } from "@/components/layout/page-header";
import Link from "next/link";
import { toast } from 'sonner';
import { Plus, Trash2, Save, History, FileText, Building2, Truck, Package, ChevronRight, ChevronLeft, CheckCircle2, Camera } from 'lucide-react';
import gsap from 'gsap';
import { cn } from "@/lib/utils";

// --- Static Lists ---
const SUPPLIERS = ["Öztop", "Shn", "Canbek", "Mini Kepçe", "Ceper", "Artı Yedi", "Barış Vinç", "Diğer"];
const COMPANIES = ["Camsan", "Koparan", "Camsan&Koparan", "Altın Raket"];
const LOCATIONS = ["A-Blok", "B-Blok", "C-Blok", "D-Blok", "E-Blok", "Şantiye", "A-B. Blok", "B-E Blok", "Satış Ofisi", "E-C Blok", "A-B-E Blok", "B-C Blok", "C-D Blok", "A-B-D Blok"];

interface WaybillItem {
    id: string;
    material_id: string;
    quantity: string;
    unit: string;
    location: string;
    notes: string;
}

export default function WaybillWizardPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [materials, setMaterials] = useState<any[]>([]);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const stepContainerRef = useRef<HTMLDivElement>(null);

    // Header State
    const [header, setHeader] = useState({
        date: new Date().toISOString().split('T')[0],
        supplier: '',
        company: '',
        waybill_no: ''
    });

    // Items State
    const [items, setItems] = useState<WaybillItem[]>([
        { id: Math.random().toString(36).substr(2, 9), material_id: '', quantity: '', unit: 'Adet', location: 'Şantiye', notes: '' }
    ]);

    // Fetch Materials
    useEffect(() => {
        async function fetchMaterials() {
            const { data } = await supabase.from('materials').select('*').order('category', { ascending: true });
            if (data) setMaterials(data);
        }
        fetchMaterials();
    }, []);

    // Step Transition Animation
    useEffect(() => {
        if (stepContainerRef.current) {
            gsap.fromTo(stepContainerRef.current,
                { x: 50, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.6, ease: "expo.out" }
            );
        }
    }, [step]);

    // Group Materials
    const groupedMaterials = materials.reduce((acc, item) => {
        const cat = item.category || 'Diğer';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(item);
        return acc;
    }, {} as Record<string, any[]>);

    const addItem = () => {
        setItems([
            ...items,
            { id: Math.random().toString(36).substr(2, 9), material_id: '', quantity: '', unit: 'Adet', location: 'Şantiye', notes: '' }
        ]);
    };

    const removeItem = (id: string) => {
        if (items.length > 1) {
            setItems(items.filter(i => i.id !== id));
        } else {
            toast.error("En az bir satır olmalıdır.");
        }
    };

    const updateItem = (id: string, field: keyof WaybillItem, value: string) => {
        setItems(items.map(item => {
            if (item.id === id) {
                const updates: any = { [field]: value };
                if (field === 'material_id') {
                    const selected = materials.find(m => m.id === value);
                    if (selected) updates.unit = selected.unit || 'Adet';
                }
                return { ...item, ...updates };
            }
            return item;
        }));
    };

    const uploadPhoto = async (file: File) => {
        const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
        const { data, error } = await supabase.storage
            .from('waybill-photos')
            .upload(filename, file);

        if (error) {
            console.error("Upload error:", error);
            return null;
        }

        const { data: { publicUrl } } = supabase.storage
            .from('waybill-photos')
            .getPublicUrl(filename);

        return publicUrl;
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const validItems = items.filter(i => i.material_id && i.quantity);
            let finalPhotoUrl = '';
            if (photoFile) {
                const url = await uploadPhoto(photoFile);
                if (url) finalPhotoUrl = url;
            }

            const payload = {
                ...header,
                photo_url: finalPhotoUrl,
                created_by: 'user@demo.com',
                items: validItems.map(item => {
                    const mat = materials.find(m => m.id === item.material_id);
                    return { ...item, material_name: mat ? mat.name : 'Bilinmeyen' };
                })
            };

            const res = await fetch('/api/sync-waybill', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await res.json();
            if (result.success) {
                toast.success(`✅ İrsaliye başarıyla kaydedildi.`);
                router.push('/irsaliye/list');
            } else {
                toast.error("Hata: " + result.error);
            }
        } catch (err) {
            toast.error("Bir hata oluştu");
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => {
        if (step === 1 && (!header.date || !header.supplier || !header.company || !header.waybill_no)) {
            toast.error("Lütfen tüm zorunlu alanları doldurun.");
            return;
        }
        setStep(prev => Math.min(prev + 1, 3));
    };

    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6 font-sans pb-32 px-4">
            <PageHeader
                title="Yeni İrsaliye Girişi"
                backLink="/"
                subtitle={`${step}. ADIM: ${step === 1 ? 'ÜST BİLGİLER' : step === 2 ? 'BELGE FOTOĞRAFI' : 'MALZEME DETAYLARI'}`}
            >
                <Link href="/irsaliye/list">
                    <Button variant="outline" className="rounded-full gap-2 border-primary/20 text-primary hover:bg-primary/5">
                        <History className="w-4 h-4" /> Geçmiş
                    </Button>
                </Link>
            </PageHeader>

            {/* Steps Progress */}
            <div className="flex items-center justify-between px-12 mb-12 relative">
                <div className="absolute top-1/2 left-12 right-12 h-1 bg-border/40 -translate-y-1/2 z-0 rounded-full" />
                <div
                    className="absolute top-1/2 left-12 h-1 bg-primary -translate-y-1/2 z-1 transition-all duration-700 ease-in-out rounded-full shadow-[0_0_10px_rgba(var(--primary),0.3)]"
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

            <Card delay={0.1} className="glass-card shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] dark:shadow-[0_48px_80px_-20px_rgba(0,0,0,0.4)] rounded-[2.5rem] overflow-hidden border-none min-h-[500px] flex flex-col relative transition-all duration-500">
                <CardHeader className="p-8 pb-4 flex flex-row items-center justify-between border-b border-border/40 bg-muted/10">
                    <div className="flex items-center gap-5">
                        <div className={`p-4 rounded-2xl transition-all duration-500 shadow-inner ${step === 1 ? 'bg-primary/10 text-primary' : step === 2 ? 'bg-orange-500/10 text-orange-500' : 'bg-green-500/10 text-green-500'
                            }`}>
                            {step === 1 ? <FileText className="w-7 h-7" /> : step === 2 ? <Camera className="w-7 h-7" /> : <Package className="w-7 h-7" />}
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-black tracking-tight">{step === 1 ? 'Genel Bilgiler' : step === 2 ? 'Görsel Kanıt' : 'Malzeme Listesi'}</CardTitle>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{step}/3 AŞAMA • LOFT 777 CORE</p>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="flex-1 p-8 md:p-12" ref={stepContainerRef}>
                    {step === 1 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">İrsaliye Tarihi</Label>
                                <Input type="date" value={header.date} onChange={(e) => setHeader({ ...header, date: e.target.value })} className="h-14 bg-muted/10 border-border/60 rounded-2xl text-lg font-bold" />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">İrsaliye Numarası</Label>
                                <Input placeholder="No giriniz..." value={header.waybill_no} onChange={(e) => setHeader({ ...header, waybill_no: e.target.value })} className="h-14 border-border/60 rounded-2xl text-lg font-bold" />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Firma (Alıcı)</Label>
                                <Select value={header.company} onValueChange={(val) => setHeader({ ...header, company: val })}>
                                    <SelectTrigger className="h-14 border-border/60 rounded-2xl bg-muted/5 text-lg font-bold">
                                        <SelectValue placeholder="Firma Seç" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl glass">
                                        {COMPANIES.map(c => <SelectItem key={c} value={c} className="rounded-xl">{c}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Tedarikçi (Gönderen)</Label>
                                <Select value={header.supplier} onValueChange={(val) => setHeader({ ...header, supplier: val })}>
                                    <SelectTrigger className="h-14 border-border/60 rounded-2xl bg-muted/5 text-lg font-bold">
                                        <SelectValue placeholder="Tedarikçi Seç" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl glass">
                                        {SUPPLIERS.map(s => <SelectItem key={s} value={s} className="rounded-xl">{s}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-8 flex flex-col items-center">
                            <Label className="text-sm font-bold text-muted-foreground uppercase tracking-widest text-center">İrsaliye belgesinin fotoğrafını net bir şekilde çekin</Label>
                            <div className="w-full max-w-md p-4 bg-muted/10 rounded-[2rem] border-2 border-dashed border-border/40">
                                <CameraInput onPhotoTaken={setPhotoFile} />
                            </div>
                            {photoFile && (
                                <div className="flex items-center gap-2 text-green-500 bg-green-500/10 px-4 py-2 rounded-full text-xs font-black">
                                    <CheckCircle2 className="w-4 h-4" /> GÖRSEL YÜKLENDİ
                                </div>
                            )}
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6">
                            <div className="max-h-[350px] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                                {items.map((item, index) => (
                                    <div key={item.id} className="relative p-6 rounded-[1.5rem] border border-border/60 bg-white/50 dark:bg-black/20 group">
                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                                            <div className="md:col-span-12 space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Malzeme Seçimi</Label>
                                                    <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="h-8 w-8 text-destructive/40 hover:text-destructive hover:bg-destructive/10">
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                                <Select value={item.material_id} onValueChange={(val) => updateItem(item.id, 'material_id', val)}>
                                                    <SelectTrigger className="h-12 rounded-xl bg-background/50 border-border/40">
                                                        <SelectValue placeholder="Seçiniz..." />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-xl glass max-h-[250px]">
                                                        {Object.keys(groupedMaterials).map((cat) => (
                                                            <SelectGroup key={cat}>
                                                                <SelectLabel className="bg-muted px-3 py-1 text-[10px] font-black uppercase text-muted-foreground">{cat}</SelectLabel>
                                                                {groupedMaterials[cat].map(m => (
                                                                    <SelectItem key={m.id} value={m.id} className="rounded-lg">{m.name} ({m.unit})</SelectItem>
                                                                ))}
                                                            </SelectGroup>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="md:col-span-4 space-y-2">
                                                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Miktar</Label>
                                                <Input type="number" value={item.quantity} onChange={(e) => updateItem(item.id, 'quantity', e.target.value)} className="h-12 rounded-xl font-black text-xl bg-blue-500/5 text-blue-600 border-blue-500/20" />
                                            </div>
                                            <div className="md:col-span-8 space-y-2">
                                                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Lokasyon / Açıklama</Label>
                                                <div className="flex gap-2">
                                                    <Select value={item.location} onValueChange={(val) => updateItem(item.id, 'location', val)}>
                                                        <SelectTrigger className="h-12 rounded-xl bg-background/50 border-border/40 w-[150px]">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent className="rounded-xl glass">
                                                            {LOCATIONS.map(l => <SelectItem key={l} value={l} className="rounded-lg">{l}</SelectItem>)}
                                                        </SelectContent>
                                                    </Select>
                                                    <Input placeholder="Not..." value={item.notes} onChange={(e) => updateItem(item.id, 'notes', e.target.value)} className="h-12 rounded-xl flex-1 border-border/40" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button type="button" onClick={addItem} variant="outline" className="w-full h-12 rounded-2xl border-dashed border-primary/30 text-primary hover:bg-primary/5 font-bold uppercase tracking-widest text-xs">
                                <Plus className="w-4 h-4 mr-2" /> Yeni Satır Ekle
                            </Button>
                        </div>
                    )}
                </CardContent>

                <div className="p-8 border-t border-border/40 mt-auto bg-muted/5 flex items-center justify-between gap-6">
                    {step > 1 ? (
                        <Button magnetic variant="ghost" onClick={prevStep} className="rounded-2xl h-16 px-10 font-black text-muted-foreground hover:text-foreground uppercase tracking-tight">
                            <ChevronLeft className="mr-3 h-6 w-6" /> GERİ DÖN
                        </Button>
                    ) : (
                        <div />
                    )}

                    {step < 3 ? (
                        <Button magnetic onClick={nextStep} className="rounded-2xl h-16 px-12 font-black shadow-2xl shadow-primary/20 bg-foreground text-background hover:bg-foreground/90 uppercase tracking-tight">
                            SONRAKİ ADIM <ChevronRight className="ml-3 h-6 w-6" />
                        </Button>
                    ) : (
                        <Button magnetic onClick={handleSubmit} disabled={loading || items.length === 0} className="rounded-full h-16 px-16 font-black shadow-2xl shadow-primary/30 bg-primary hover:bg-primary/90 text-white uppercase tracking-tight">
                            {loading ? (
                                <span className="flex items-center gap-3">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> İŞLENİYOR...
                                </span>
                            ) : (
                                <span className="flex items-center gap-3">
                                    <Save className="w-6 h-6" /> KAYDI TAMAMLA
                                </span>
                            )}
                        </Button>
                    )}
                </div>
            </Card>

            <p className="text-center text-[10px] font-black text-muted-foreground/30 uppercase tracking-[0.5em]">
                LOFT 777 PREMIERE SYSTEM v4.0
            </p>
        </div>
    );
}
