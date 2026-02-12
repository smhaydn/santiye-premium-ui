'use client';

import { useState, useRef } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Shield, Scale, Activity, ArrowUpRight, ArrowDownRight,
    User, History, AlertTriangle, CheckCircle2, Search,
    Filter, Download, Plus
} from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Simulated Audit Data
const auditLogs = [
    { id: 1, user: 'Sertan', action: 'Fatura Güncellendi', target: 'Kalyoncu Demir (FT-129)', time: '14:22', date: '13.02.2024', status: 'critical' },
    { id: 2, user: 'Sertan', action: 'Ödeme Kaydı Yapıldı', target: 'A Ortağı Ödemesi', time: '12:05', date: '13.02.2024', status: 'success' },
    { id: 3, user: 'Mehmet', action: 'Yeni İrsaliye Eklendi', target: 'Hazır Beton (Blok A)', time: '09:45', date: '12.02.2024', status: 'info' },
    { id: 4, user: 'Sertan', action: 'Birim Fiyat Değişti', target: 'Nervürlü Demir (12mm)', time: '17:30', date: '11.02.2024', status: 'warning' },
];

export default function PartnershipPage() {
    return (
        <div className="flex flex-col gap-8 pb-20">
            <PageHeader
                title="ORTAKLIK PANELİ"
                subtitle="Ortaklar arası finansal şeffaflık ve denetim merkezi."
            >
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-full gap-2 border-primary/20 text-primary hover:bg-primary/5">
                        <History className="w-4 h-4" /> Geçmiş Görüntüle
                    </Button>
                    <Button className="rounded-full bg-slate-900 text-white shadow-xl shadow-slate-900/20 gap-2">
                        <Plus className="w-4 h-4" /> Yeni Mutabakat
                    </Button>
                </div>
            </PageHeader>

            {/* Partnership Balance Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <Card className="lg:col-span-8 rounded-[3rem] p-10 bg-slate-900 text-white border-none shadow-2xl relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex justify-between items-center mb-10">
                            <div className="flex items-center gap-4">
                                <div className="p-4 rounded-3xl bg-blue-500/10 text-blue-400">
                                    <Scale className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black tracking-tight">Kümülatif Sermaye Dağılımı</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">HEDEFLENEN: %60 A / %40 B</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Toplam Yatırılan</p>
                                <p className="text-3xl font-black font-mono tracking-tighter">10.000.000 ₺</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative">
                            {/* Visual Center Line */}
                            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-white/5" />

                            {/* Partner A */}
                            <div className="space-y-6">
                                <div className="flex justify-between items-end">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center font-black text-blue-400">A</div>
                                        <span className="font-black text-sm uppercase opacity-60">A ORTAĞI (%60)</span>
                                    </div>
                                    <span className="text-2xl font-black font-mono">5.8M ₺</span>
                                </div>
                                <div className="h-4 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '58%' }}
                                        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                                        className="h-full bg-blue-500 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                                    />
                                </div>
                                <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                                    <span className="text-red-400 flex items-center gap-1"><ArrowDownRight className="w-4 h-4" /> MEVCUT: %58</span>
                                    <span className="text-slate-500">HEDEF: %60</span>
                                </div>
                            </div>

                            {/* Partner B */}
                            <div className="space-y-6">
                                <div className="flex justify-between items-end">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center font-black text-orange-400">B</div>
                                        <span className="font-black text-sm uppercase opacity-60">B ORTAĞI (%40)</span>
                                    </div>
                                    <span className="text-2xl font-black font-mono">4.2M ₺</span>
                                </div>
                                <div className="h-4 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '42%' }}
                                        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                                        className="h-full bg-orange-500 rounded-full shadow-[0_0_20px_rgba(249,115,22,0.3)]"
                                    />
                                </div>
                                <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                                    <span className="text-green-400 flex items-center gap-1"><ArrowUpRight className="w-4 h-4" /> MEVCUT: %42</span>
                                    <span className="text-slate-500">HEDEF: %40</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 p-6 rounded-[2rem] bg-white/5 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                                    <AlertTriangle className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">Mutabakat Gerekiyor</p>
                                    <p className="text-xs text-slate-400 font-medium">Hedeflenen 60/40 dengesine dönmek için gereken işlem.</p>
                                </div>
                            </div>
                            <div className="px-6 py-4 bg-white/10 rounded-2xl border border-white/10">
                                <span className="text-xs font-black uppercase tracking-[0.1em] text-slate-400 mr-3">DÜZELTME TUTARI:</span>
                                <span className="text-xl font-black text-blue-400">200.000 ₺</span>
                            </div>
                            <Button className="rounded-2xl h-14 px-10 font-black bg-blue-500 text-white shadow-xl shadow-blue-500/20">TAHSİLAT GİRİŞİ</Button>
                        </div>
                    </div>

                    <div className="absolute top-[-50px] right-[-50px] w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[100px]" />
                </Card>

                <Card className="lg:col-span-4 rounded-[3rem] p-8 border-none shadow-xl bg-white flex flex-col justify-between">
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
                                <Activity className="w-6 h-6" />
                            </div>
                            <h3 className="font-black text-lg text-slate-900 uppercase tracking-tight">AKTİVİTE ÖZETİ</h3>
                        </div>

                        <div className="space-y-4">
                            <StatBox label="OCAK HARCAMALARI" value="2.4M ₺" trend="+%12" color="indigo" />
                            <StatBox label="BEKLEYEN ÖDEMELER" value="840K ₺" trend="-%5" color="orange" />
                            <StatBox label="ORTALAMA MALİYET" value="45K ₺ / m2" trend="+%2" color="blue" />
                        </div>
                    </div>

                </Card>
            </div>

            {/* Audit Log Section */}
            <Card className="rounded-[3rem] p-10 border-none shadow-xl bg-white overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
                    <div className="flex items-center gap-4">
                        <div className="p-4 rounded-3xl bg-slate-900 text-white shadow-xl">
                            <History className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Denetim İzi (Audit Log)</h3>
                            <p className="text-sm text-muted-foreground font-medium">Kim, ne zaman, hangi veriyi güncelledi?</p>
                        </div>
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input className="pl-11 rounded-xl h-12 border-slate-100 bg-slate-50 font-medium" placeholder="İşlem veya kullanıcı ara..." />
                        </div>
                        <Button variant="outline" className="rounded-xl h-12 px-5 border-slate-200"><Filter className="w-4 h-4" /></Button>
                        <Button variant="outline" className="rounded-xl h-12 px-5 border-slate-200"><Download className="w-4 h-4" /></Button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-100">
                                <th className="pb-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">KULLANICI</th>
                                <th className="pb-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">İŞLEM</th>
                                <th className="pb-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">HEDEF VERİ</th>
                                <th className="pb-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">TARİH / SAAT</th>
                                <th className="pb-4 text-right text-[11px] font-black text-slate-400 uppercase tracking-widest">DURUM</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {auditLogs.map((log) => (
                                <tr key={log.id} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                                                <User className="w-4 h-4 text-slate-600" />
                                            </div>
                                            <span className="font-bold text-slate-900">{log.user}</span>
                                        </div>
                                    </td>
                                    <td className="py-5 font-bold text-slate-700">{log.action}</td>
                                    <td className="py-5 font-mono text-xs text-slate-500">{log.target}</td>
                                    <td className="py-5">
                                        <div className="text-[11px] font-black text-slate-400">
                                            {log.date} <span className="ml-1 opacity-50">•</span> {log.time}
                                        </div>
                                    </td>
                                    <td className="py-5 text-right">
                                        <span className={cn(
                                            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                            log.status === 'critical' ? 'bg-red-50 text-red-600' :
                                                log.status === 'warning' ? 'bg-orange-50 text-orange-600' :
                                                    log.status === 'success' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                                        )}>
                                            {log.status === 'critical' ? 'RİSK' : log.status === 'warning' ? 'UYARI' : 'GÜVENLİ'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-8 flex justify-center">
                    <Button variant="ghost" className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 hover:bg-slate-100 rounded-xl px-10 h-12">
                        DAHA FAZLA KAYIT GÖSTER
                    </Button>
                </div>
            </Card>
        </div>
    );
}

function StatBox({ label, value, trend, color }: { label: string, value: string, trend: string, color: string }) {
    return (
        <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100 group/box hover:border-slate-300 transition-all">
            <div className="flex justify-between items-start mb-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
                <span className={cn(
                    "text-[10px] font-black px-2 py-0.5 rounded-full",
                    trend.startsWith('+') ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                )}>{trend}</span>
            </div>
            <p className="text-2xl font-black text-slate-900 tracking-tight">{value}</p>
        </div>
    )
}
