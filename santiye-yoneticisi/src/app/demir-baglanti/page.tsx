
'use client';

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/page-header";
import { Plus, Wallet, ChevronDown, ChevronRight, Activity, Percent, Truck } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

// Static lists for v2 MVP
const MATERIAL_GROUPS = ["İnce Demir (Ø8-Ø10)", "Kalın Demir (Ø12-Ø20)", "Hasır Çelik"];
const SUPPLIERS = ["Öztop", "Camsan", "Koparan", "Diğer"];

export default function IronConnectionPage() {
    const [contracts, setContracts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<'dashboard' | 'new-contract'>('dashboard');

    const [transactions, setTransactions] = useState<any[]>([]);
    const [expandedContractId, setExpandedContractId] = useState<string | null>(null);

    // New Contract Form State
    const [newContract, setNewContract] = useState({
        supplier: '',
        material_group: '',
        total_quantity: '',
        unit_price: '',
        date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        fetchContracts();
        fetchTransactions();
    }, []);

    async function fetchContracts() {
        // Fetch active contracts
        const { data, error } = await supabase
            .from('contracts')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setContracts(data);
        setLoading(false);
    }

    async function fetchTransactions() {
        const { data } = await supabase
            .from('site_transactions')
            .select('*')
            .not('contract_id', 'is', null)
            .order('transaction_date', { ascending: false });

        if (data) setTransactions(data);
    }

    const getContractTransactions = (contractId: string) => {
        const raw = transactions.filter(t => t.contract_id === contractId);

        // Group by Waybill No (document_no) + Date
        const grouped: any[] = [];
        const map = new Map<string, any>();

        raw.forEach(t => {
            // Include empty document_no as unique items (don't group)
            if (!t.document_no) {
                grouped.push(t);
                return;
            }

            const key = `${t.document_no}-${t.transaction_date}`;

            if (map.has(key)) {
                const existing = map.get(key);
                existing.quantity = Number(existing.quantity) + Number(t.quantity);
                existing.total_amount = Number(existing.total_amount) + Number(t.total_amount); // Also sum total amount if wanted

                const desc = t.description + (t.detail ? ` (${t.detail})` : '');
                // Avoid duplicates in description list
                if (!existing._descriptions.includes(desc)) {
                    existing._descriptions.push(desc);
                }
            } else {
                const newItem = {
                    ...t,
                    quantity: Number(t.quantity),
                    total_amount: Number(t.total_amount),
                    _descriptions: [t.description + (t.detail ? ` (${t.detail})` : '')]
                };
                map.set(key, newItem);
                grouped.push(newItem);
            }
        });

        // Format descriptions
        return grouped.map(g => {
            if (g._descriptions) {
                return {
                    ...g,
                    description: g._descriptions.join(', '),
                    detail: '' // Clear detail since it's merged
                };
            }
            return g;
        }).sort((a, b) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime());
    };

    const handleCreateContract = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.from('contracts').insert([{
            supplier: newContract.supplier,
            material_group: newContract.material_group,
            total_quantity: parseFloat(newContract.total_quantity),
            unit_price: parseFloat(newContract.unit_price),
            start_date: newContract.date,
            status: 'active'
        }]);

        if (error) {
            toast.error("Hata: " + error.message);
        } else {
            toast.success("Bağlantı Kaydedildi! 🎉");
            setView('dashboard');
            fetchContracts();
        }
        setLoading(false);
    };

    // Calculate Totals
    const totalIronStock = contracts.reduce((acc, c) => acc + (Number(c.remaining_quantity) || Number(c.total_quantity)), 0);
    const activeDeals = contracts.filter(c => c.status === 'active').length;

    // Animation Variants
    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const item = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={container}
            className="flex flex-col h-full bg-background font-sans"
        >
            <PageHeader title="Demir Bağlantı & Stok" backLink="/" subtitle="STOK VE ANLAŞMA YÖNETİMİ">
                <Button onClick={() => setView(view === 'dashboard' ? 'new-contract' : 'dashboard')} className={view === 'new-contract' ? "bg-secondary text-secondary-foreground" : "bg-primary text-primary-foreground hover:bg-primary/90"}>
                    {view === 'new-contract' ? 'Vazgeç' : <><Plus className="w-4 h-4 mr-2" /> Yeni Bağlantı</>}
                </Button>
            </PageHeader>

            <div className="flex-1 overflow-y-auto p-0 space-y-6">

                <div className="max-w-6xl mx-auto space-y-6">
                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <motion.div variants={item}>
                            <Card className="glass-card border-l-4 border-l-blue-500">
                                <CardContent className="p-5 flex items-center justify-between">
                                    <div>
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">TOPLAM STOK</div>
                                        <div className="text-2xl font-bold text-foreground mt-1 font-mono tracking-tight">{totalIronStock.toLocaleString('tr-TR')} <span className="text-sm font-sans font-normal text-muted-foreground">Ton</span></div>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                                        <Activity className="w-5 h-5" />
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div variants={item}>
                            <Card className="glass-card border-l-4 border-l-purple-500">
                                <CardContent className="p-5 flex items-center justify-between">
                                    <div>
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">AKTİF ANLAŞMALAR</div>
                                        <div className="text-2xl font-bold text-foreground mt-1 font-mono tracking-tight">{activeDeals} <span className="text-sm font-sans font-normal text-muted-foreground">Adet</span></div>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                                        <Wallet className="w-5 h-5" />
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div variants={item}>
                            <Card className="glass-card border-l-4 border-l-green-500">
                                <CardContent className="p-5 flex items-center justify-between">
                                    <div>
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Doluluk Oranı</div>
                                        <div className="text-2xl font-bold text-foreground mt-1 font-mono tracking-tight">%85 <span className="text-sm font-sans font-normal text-muted-foreground">Sevk</span></div>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center">
                                        <Percent className="w-5 h-5" />
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    <AnimatePresence mode="wait">
                        {view === 'new-contract' ? (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <Card className="glass-card">
                                    <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
                                        <CardTitle className="text-primary flex items-center gap-2">
                                            <Plus className="w-5 h-5" />
                                            Yeni Demir Bağlantısı Ekle
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-6">
                                        <form onSubmit={handleCreateContract} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Tarih</label>
                                                <Input type="date" value={newContract.date} onChange={e => setNewContract({ ...newContract, date: e.target.value })} required className="bg-background/50" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Tedarikçi</label>
                                                <Select onValueChange={val => setNewContract({ ...newContract, supplier: val })} required>
                                                    <SelectTrigger className="bg-background/50"><SelectValue placeholder="Seçiniz" /></SelectTrigger>
                                                    <SelectContent>
                                                        {SUPPLIERS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Malzeme Grubu</label>
                                                <Select onValueChange={val => setNewContract({ ...newContract, material_group: val })} required>
                                                    <SelectTrigger className="bg-background/50"><SelectValue placeholder="Seçiniz" /></SelectTrigger>
                                                    <SelectContent>
                                                        {MATERIAL_GROUPS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Miktar (Ton)</label>
                                                <Input type="number" placeholder="Örn: 150" value={newContract.total_quantity} onChange={e => setNewContract({ ...newContract, total_quantity: e.target.value })} required className="bg-background/50 font-mono" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Birim Fiyat (TL)</label>
                                                <Input type="number" placeholder="Örn: 25416.67" step="0.01" value={newContract.unit_price} onChange={e => setNewContract({ ...newContract, unit_price: e.target.value })} required className="bg-background/50 font-mono" />
                                            </div>
                                            <div className="md:col-span-2 flex justify-end gap-3 mt-4 pt-4 border-t border-border/50">
                                                <Button type="button" variant="ghost" onClick={() => setView('dashboard')}>İptal</Button>
                                                <Button type="submit">Bağlantıyı Kaydet</Button>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="list"
                                variants={item}
                            >
                                <Card className="glass-card overflow-hidden">
                                    <CardHeader className="bg-muted/30 border-b border-border/50 px-6 py-4">
                                        <div className="flex justify-between items-center">
                                            <CardTitle className="text-base font-bold flex items-center gap-2">
                                                <Activity className="w-4 h-4 text-primary" />
                                                Aktif Bağlantılarım
                                            </CardTitle>
                                        </div>
                                    </CardHeader>
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader className="bg-muted/50">
                                                <TableRow className="hover:bg-transparent">
                                                    <TableHead className="w-[50px]"></TableHead>
                                                    <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Tarih</TableHead>
                                                    <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Tedarikçi</TableHead>
                                                    <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Ürün Grubu</TableHead>
                                                    <TableHead className="text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">Miktar</TableHead>
                                                    <TableHead className="text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">Birim Fiyat</TableHead>
                                                    <TableHead className="text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">Kalan</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {loading ? <TableRow><TableCell colSpan={7} className="text-center p-8 text-muted-foreground">Yükleniyor...</TableCell></TableRow> :
                                                    contracts.map((c) => (
                                                        <React.Fragment key={c.id}>
                                                            <TableRow className={`group transition-colors ${expandedContractId === c.id ? 'bg-primary/5' : 'hover:bg-muted/50'}`}>
                                                                <TableCell>
                                                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground" onClick={() => setExpandedContractId(expandedContractId === c.id ? null : c.id)}>
                                                                        {expandedContractId === c.id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                                                    </Button>
                                                                </TableCell>
                                                                <TableCell className="font-mono text-xs text-muted-foreground">{new Date(c.start_date).toLocaleDateString('tr-TR')}</TableCell>
                                                                <TableCell className="font-medium text-foreground">{c.supplier}</TableCell>
                                                                <TableCell>
                                                                    <Badge variant="outline" className="font-normal bg-background/50 hover:bg-background text-foreground border-border">
                                                                        {c.material_group}
                                                                    </Badge>
                                                                </TableCell>
                                                                <TableCell className="text-right font-medium">{Number(c.total_quantity).toLocaleString('tr-TR')} Ton</TableCell>
                                                                <TableCell className="text-right font-mono text-xs text-muted-foreground">₺{Number(c.unit_price).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</TableCell>
                                                                <TableCell className="text-right">
                                                                    <span className="font-bold text-green-600 dark:text-green-400">
                                                                        {Number(c.remaining_quantity || c.total_quantity - (c.delivered_quantity || 0)).toLocaleString('tr-TR')}
                                                                    </span>
                                                                    <span className="text-xs font-normal text-muted-foreground ml-1">Ton</span>
                                                                </TableCell>
                                                            </TableRow>

                                                            {/* EXPANDED DETAILS */}
                                                            <AnimatePresence>
                                                                {expandedContractId === c.id && (
                                                                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                                                                        <TableCell colSpan={7} className="p-0">
                                                                            <motion.div
                                                                                initial={{ opacity: 0, height: 0 }}
                                                                                animate={{ opacity: 1, height: 'auto' }}
                                                                                exit={{ opacity: 0, height: 0 }}
                                                                                className="p-4 pl-12"
                                                                            >
                                                                                <div className="bg-background rounded-lg border border-border/50 shadow-inner overflow-hidden">
                                                                                    <Table>
                                                                                        <TableHeader>
                                                                                            <TableRow className="bg-muted/50 h-8 hover:bg-muted/50">
                                                                                                <TableHead className="h-8 text-[10px] font-bold text-muted-foreground">İŞLEM TARİHİ</TableHead>
                                                                                                <TableHead className="h-8 text-[10px] font-bold text-muted-foreground">İRSALİYE NO</TableHead>
                                                                                                <TableHead className="h-8 text-[10px] font-bold text-muted-foreground">AÇIKLAMA</TableHead>
                                                                                                <TableHead className="h-8 text-[10px] font-bold text-muted-foreground text-right">MİKTAR</TableHead>
                                                                                            </TableRow>
                                                                                        </TableHeader>
                                                                                        <TableBody>
                                                                                            {getContractTransactions(c.id).length === 0 ? (
                                                                                                <TableRow>
                                                                                                    <TableCell colSpan={4} className="text-center text-xs text-muted-foreground py-4">
                                                                                                        <div className="flex flex-col items-center gap-2">
                                                                                                            <Truck className="w-8 h-8 opacity-20" />
                                                                                                            Bu bağlantıdan henüz sevkiyat yapılmamış.
                                                                                                        </div>
                                                                                                    </TableCell>
                                                                                                </TableRow>
                                                                                            ) : getContractTransactions(c.id).map(t => (
                                                                                                <TableRow key={t.id} className="h-8 hover:bg-muted/30">
                                                                                                    <TableCell className="text-xs py-1.5">{new Date(t.transaction_date).toLocaleDateString('tr-TR')}</TableCell>
                                                                                                    <TableCell className="text-xs py-1.5 font-mono text-primary">{t.document_no || '-'}</TableCell>
                                                                                                    <TableCell className="text-xs py-1.5 text-muted-foreground">{t.description} {t.detail ? `(${t.detail})` : ''}</TableCell>
                                                                                                    <TableCell className="text-xs py-1.5 text-right font-bold text-foreground">{Number(t.quantity).toLocaleString('tr-TR')}</TableCell>
                                                                                                </TableRow>
                                                                                            ))}
                                                                                        </TableBody>
                                                                                    </Table>
                                                                                </div>
                                                                            </motion.div>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                )}
                                                            </AnimatePresence>
                                                        </React.Fragment>
                                                    ))}
                                                {contracts.length === 0 && !loading && (
                                                    <TableRow>
                                                        <TableCell colSpan={7} className="text-center p-12 text-muted-foreground">
                                                            Henüz aktif bağlantınız yok.
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}
