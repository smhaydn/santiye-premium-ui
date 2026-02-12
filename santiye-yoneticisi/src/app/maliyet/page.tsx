'use client';

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Building2, ChevronRight, ChevronDown, Package,
    Layers, Wallet, TrendingUp, Info, PieChart as PieChartIcon,
    LayoutGrid, List
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// Simulated Tree Data
const costData = [
    {
        id: 'kaba',
        title: 'KABA İNŞAAT',
        total: '4.200.000 ₺',
        percent: 65,
        items: [
            { id: 'beton', title: 'Beton İşleri', total: '1.800.000 ₺', status: 'completed' },
            { id: 'demir', title: 'Demir & Kalıp', total: '2.100.000 ₺', status: 'active' },
            { id: 'tugla', title: 'Tuğla & Duvar', total: '300.000 ₺', status: 'pending' },
        ]
    },
    {
        id: 'ince',
        title: 'İNCE İNŞAAT',
        total: '2.100.000 ₺',
        percent: 25,
        items: [
            { id: 'alci', title: 'Alçı & Boya', total: '450.000 ₺', status: 'active' },
            { id: 'seramik', title: 'Seramik & Kaplama', total: '850.000 ₺', status: 'pending' },
            { id: 'mobilya', title: 'Mutfak & Kapıları', total: '800.000 ₺', status: 'pending' },
        ]
    },
    {
        id: 'mekanik',
        title: 'MEKANİK & ELEKTRİK',
        total: '1.200.000 ₺',
        percent: 10,
        items: [
            { id: 'tesisat', title: 'Sıhhi Tesisat', total: '500.000 ₺', status: 'active' },
            { id: 'elektrik', title: 'Elektrik Dağıtım', total: '700.000 ₺', status: 'pending' },
        ]
    }
];

export default function CostAnalysisPage() {
    const [selectedBlock, setSelectedBlock] = useState('blok-a');
    const [expandedItems, setExpandedItems] = useState<string[]>(['kaba']);

    const toggleExpand = (id: string) => {
        setExpandedItems(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    return (
        <div className="flex flex-col gap-8 pb-20">
            <PageHeader
                title="MALİYET ANALİZİ"
                subtitle="Blok bazlı derinlemesine maliyet kırılımı ve ağaç yapısı görünümü."
            />

            {/* Block Selector */}
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {['BLOK A', 'BLOK B', 'BLOK C', 'BLOK D', 'SOSYAL ALAN'].map((blok) => {
                    const id = blok.toLowerCase().replace(' ', '-');
                    return (
                        <Button
                            key={id}
                            onClick={() => setSelectedBlock(id)}
                            className={cn(
                                "rounded-2xl h-20 px-10 font-black text-sm uppercase tracking-widest transition-all",
                                selectedBlock === id
                                    ? "bg-slate-900 text-white shadow-2xl scale-105"
                                    : "bg-white text-slate-400 hover:bg-slate-50 border border-slate-100"
                            )}
                        >
                            <Building2 className={cn("mr-3 w-5 h-5", selectedBlock === id ? "text-blue-400" : "text-slate-300")} />
                            {blok}
                        </Button>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Cost Tree */}
                <div className="lg:col-span-8 space-y-6">
                    <Card className="rounded-[3rem] p-10 border-none shadow-xl bg-white">
                        <div className="flex justify-between items-center mb-10">
                            <div className="flex items-center gap-4">
                                <div className="p-4 rounded-3xl bg-slate-900 text-white shadow-xl">
                                    <Layers className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Maliyet Ağacı</h3>
                                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">{selectedBlock.replace('-', ' ')} İÇİN KIRILIM</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {costData.map((category) => (
                                <div key={category.id} className="group">
                                    <div
                                        onClick={() => toggleExpand(category.id)}
                                        className={cn(
                                            "p-6 rounded-3xl border transition-all cursor-pointer flex items-center justify-between",
                                            expandedItems.includes(category.id)
                                                ? "bg-slate-50 border-slate-200 shadow-sm"
                                                : "bg-white border-slate-100 hover:border-slate-300"
                                        )}
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className={cn(
                                                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                                                expandedItems.includes(category.id) ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-400"
                                            )}>
                                                {expandedItems.includes(category.id) ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">KATEGORİ</p>
                                                <h4 className="font-black text-slate-900 tracking-tight">{category.title}</h4>
                                            </div>
                                        </div>
                                        <div className="text-right flex items-center gap-10">
                                            <div className="hidden md:block">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">DAĞILIM</p>
                                                <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                                                    <div className="h-full bg-blue-500" style={{ width: `${category.percent}%` }} />
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">TOPLAM HARCAMA</p>
                                                <p className="text-lg font-black text-slate-900 font-mono tracking-tighter">{category.total}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <AnimatePresence>
                                        {expandedItems.includes(category.id) && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="mt-2 ml-10 p-4 space-y-2">
                                                    {category.items.map((item) => (
                                                        <div key={item.id} className="p-4 rounded-2xl bg-white border border-dashed border-slate-200 flex justify-between items-center group-hover:border-slate-400 transition-all">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-2 h-2 rounded-full bg-slate-300" />
                                                                <span className="font-bold text-slate-700">{item.title}</span>
                                                            </div>
                                                            <div className="flex items-center gap-6">
                                                                <span className={cn(
                                                                    "text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full",
                                                                    item.status === 'completed' ? 'bg-green-50 text-green-600' :
                                                                        item.status === 'active' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400'
                                                                )}>
                                                                    {item.status === 'completed' ? 'TAMAMLANDI' : item.status === 'active' ? 'DEVAM EDİYOR' : 'BEKLEMEDE'}
                                                                </span>
                                                                <span className="font-black text-slate-900 font-mono text-sm">{item.total}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Right: Overview Stats */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="rounded-[3rem] p-10 bg-slate-900 text-white border-none shadow-2xl relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
                                <TrendingUp className="text-blue-400" /> GENEL ÖZET
                            </h3>

                            <div className="space-y-8">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">TOPLAM PROJE BÜTÇESİ</p>
                                    <p className="text-4xl font-black tracking-tighter">450M ₺</p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold uppercase">
                                        <span className="text-slate-400">HARCANAN</span>
                                        <span className="text-blue-400">%24</span>
                                    </div>
                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500" style={{ width: '24%' }} />
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/5 space-y-4">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-400 font-medium">Birim m2 Maliyeti</span>
                                        <span className="font-black">42.500 ₺</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-400 font-medium">Toplam Cari Borç</span>
                                        <span className="font-black text-orange-400">12.8M ₺</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="absolute right-[-40px] top-[-40px] w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]" />
                    </Card>

                    <Card className="rounded-[3rem] p-8 border-none shadow-xl bg-white">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
                                <Info className="w-6 h-6" />
                            </div>
                            <p className="text-xs font-black text-slate-900 uppercase">ANALİZ NOTU</p>
                        </div>
                        <p className="text-sm font-medium text-slate-600 leading-relaxed italic">
                            "Kaba inşaat maliyetleri öngörülenin %5 altında seyrediyor. Beton birim fiyatlarındaki artışa rağmen demir stoklaması sayesinde denge sağlandı."
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    );
}
