'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
    Circle, ChevronDown, ChevronRight, Download, Edit2,
    Link2, Plus, RefreshCw, Search, Trash2, X, Check, CheckCircle2, Truck, Filter
} from "lucide-react";
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from 'framer-motion';

const SUPPLIERS = [
    'Öztop', 'Shn', 'Canbek', 'Mini Kepçe', 'Ceper', 'Artı Yedi', 'Barış Vinç'
];

const FIRMS = [
    'Camsan', 'Koparan', 'Camsan&Koparan', 'Altın Raket'
];

const DISTRICTS = [
    'A-Blok', 'B-Blok', 'C-Blok', 'D-Blok', 'E-Blok', 'Şantiye',
    'A-B. Blok', 'B-E Blok', 'Satış Ofisi', 'E-C Blok', 'A-B-E Blok', 'B-C Blok', 'C-D Blok', 'A-B-D Blok'
];

const WORK_TYPES = [
    'Malzeme Faturası', 'Malzeme İrsaliyesi', 'İş Mak. Çalış. Faturası', 'İş Mak. Çalış. İrsaliyesi'
];

const MACHINES_AND_MATERIALS = [
    'Jcb', 'Vinç', 'Kamyon', 'Pompa', 'Malzeme', 'Mini Kepçe',
    'İnşaat Demiri', 'Beton', 'Ekskavatör', 'İş Makinesi', 'Bypass',
    'Makine', 'Hizmet'
];

const DETAILS = [
    // Iron
    'Ø8', 'Ø10', 'Ø12', 'Ø14', 'Ø16', 'Ø20',
    // Concrete
    'C30/37 HAZIR BETON', 'C30/37 (KATKISIZ) HAZIR BETON',
    'C35/45 HAZIR BETON', 'C35/45 (ANTİFRİZLİ) HAZIR BETON', 'C35/45 (BRÜT) HAZIR BETON',
    // Machinery & Others
    '47 METRELİK POMPA', '38 METRELİK POMPA', '2 No Mıcır', 'Latex',
    '210 Lastikli', '390 Paletli', '310 Paletli', '230 Paletli',
    '35 BKM 330', '35 AIY 929', '35 BKM 352', '35 ADA 655', '35 BCY 219',
    'KIRK AYAK', "BIMS 25'LİK BLOK", "BIMS 19'LUK BLOK", 'ÇİMENTO 50 KG', 'Kpç 42,5 Çimento', 'Kpç 32,5',
    'DİŞLİ KUM', 'KORUGE BORU 200 MM', "200'lük Drenaj Borusu", "200'lük Koruge Mansor",
    'Geo Tekstil Keçe', 'Ocaktan', 'Depodan', '25 Ton', 'Blokaj Malzemesi', 'Sarı su tutucu bant',
    '5 Tonluk'
].sort();

const UNITS = [
    'Kg.', 'Ton', 'Saat', 'Sefer', 'Yevmiye', 'Adet', 'Gr.', 'Mt.', 'M2', 'M3'
];

export default function CariYonetimPage() {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [contracts, setContracts] = useState<any[]>([]);
    const [selectedContract, setSelectedContract] = useState<any>(null);
    const [isContractDialogOpen, setIsContractDialogOpen] = useState(false);

    // Machine Logs State
    const [isMachineDialogOpen, setIsMachineDialogOpen] = useState(false);
    const [machineDetails, setMachineDetails] = useState({
        machine_name: '',
        operator_name: '',
        work_date: new Date().toISOString().split('T')[0],
        hours_worked: '',
        start_time: '',
        end_time: '',
        location_detail: '',
        notes: ''
    });

    const [loading, setLoading] = useState(true);
    const [filterText, setFilterText] = useState('');
    const [debugInfo, setDebugInfo] = useState<any>(null);
    const [editingId, setEditingId] = useState<string | null>(null);

    // New Transaction State (Matching Excel Columns)
    const [newEntry, setNewEntry] = useState({
        status: 'BEKLİYOR',
        transaction_date: new Date().toISOString().split('T')[0],
        firm_name: 'Camsan', // Default
        supplier_name: '',
        document_no: '',
        district: 'Şantiye',
        work_type: 'Malzeme İrsaliyesi',
        description: '',
        category: 'Malzeme',
        detail: '',
        quantity: '',
        unit: 'Adet',
        unit_price: '',
        vat_rate: '20'
    });

    useEffect(() => {
        fetchTransactions();
        fetchContracts();
    }, []);

    async function fetchContracts() {
        const { data } = await supabase
            .from('contracts')
            .select('*')
            .eq('status', 'active');
        if (data) setContracts(data);
    }

    async function fetchTransactions() {
        setLoading(true);
        const { data, error } = await supabase
            .from('site_transactions')
            .select('*')
            .order('transaction_date', { ascending: false })
            .limit(50);

        if (error) {
            toast.error('Veriler yüklenirken hata oluştu');
        } else {
            setTransactions(data || []);
        }
        setLoading(false);
    }

    const handleToggleStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'ONAYLANDI' ? 'BEKLİYOR' : 'ONAYLANDI';
        setTransactions(transactions.map(t =>
            t.id === id ? { ...t, status: newStatus } : t
        ));

        const { error } = await supabase
            .from('site_transactions')
            .update({ status: newStatus })
            .eq('id', id);

        if (error) {
            toast.error('Durum güncellenemedi');
            setTransactions(transactions.map(t =>
                t.id === id ? { ...t, status: currentStatus } : t
            ));
        } else {
            if (newStatus === 'ONAYLANDI') toast.success('İşlem Onaylandı ✅');
        }
    };

    const parseAmount = (val: string) => {
        if (!val) return 0;
        const clean = val.toString().replaceAll('.', '').replace(',', '.').replace(/[^0-9.-]/g, '');
        return parseFloat(clean) || 0;
    };

    const [expandedContractId, setExpandedContractId] = useState<string | null>(null);

    const getContractTransactions = (contractId: string) => {
        return transactions.filter(t => t.contract_id === contractId);
    };

    const updateContractBalance = async (contractId: string, quantityDelta: number) => {
        const contract = contracts.find(c => c.id === contractId);
        if (!contract) return;

        const newDelivered = parseFloat((contract.delivered_quantity || 0).toString()) + quantityDelta;
        const { error } = await supabase
            .from('contracts')
            .update({ delivered_quantity: newDelivered < 0 ? 0 : newDelivered })
            .eq('id', contractId);

        if (error) {
            toast.error('Sözleşme bakiyesi güncellenemedi!');
        } else {
            setContracts(prev => prev.map(c => c.id === contractId ? { ...c, delivered_quantity: newDelivered } : c));
        }
    };

    const handleSave = async () => {
        try {
            const quantity = parseAmount(newEntry.quantity);
            const unit_price = parseAmount(newEntry.unit_price);
            const vat_rate = parseAmount(newEntry.vat_rate) || 20;

            const amount = quantity * unit_price;
            const vat_amount = amount * (vat_rate / 100);
            const total_amount = amount + vat_amount;

            const payload: any = {
                ...newEntry,
                quantity,
                unit_price,
                amount,
                vat_amount,
                total_amount,
                company: 'Merkez',
                supplier_name: newEntry.supplier_name || null,
                document_no: newEntry.document_no || null,
                firm_name: newEntry.firm_name || null,
                district: newEntry.district || null,
                work_type: newEntry.work_type || null,
                detail: newEntry.detail || null,
                transaction_date: newEntry.transaction_date || new Date().toISOString().split('T')[0],
            };

            const finalMachineDetails = { ...machineDetails };

            if (selectedContract) {
                payload.contract_id = selectedContract.id;
            } else {
                payload.contract_id = null;
            }

            const isMachineCategory = ['Jcb', 'Vinç', 'Kamyon', 'Mini Kepçe', 'Ekskavatör', 'İş Makinesi', 'Makine'].some(m => newEntry.category?.includes(m) || newEntry.description?.includes(m));

            if (isMachineCategory) {
                if (!finalMachineDetails.hours_worked && payload.quantity) {
                    finalMachineDetails.hours_worked = payload.quantity.toString();
                }
                if (!finalMachineDetails.machine_name) {
                    finalMachineDetails.machine_name = newEntry.category;
                }
            }

            let result;

            if (editingId) {
                const oldTransaction = transactions.find(t => t.id === editingId);
                result = await supabase.from('site_transactions').update(payload).eq('id', editingId).select().single();

                if (!result.error && oldTransaction) {
                    const oldQty = parseFloat(oldTransaction.quantity || '0');
                    const newQty = quantity;
                    const oldContractId = oldTransaction.contract_id;
                    const newContractId = selectedContract?.id;

                    if (oldContractId && newContractId && oldContractId === newContractId) {
                        const diff = newQty - oldQty;
                        if (diff !== 0) await updateContractBalance(newContractId, diff);
                    } else {
                        if (oldContractId) await updateContractBalance(oldContractId, -oldQty);
                        if (newContractId) await updateContractBalance(newContractId, newQty);
                    }
                }
            } else {
                result = await supabase.from('site_transactions').insert([payload]).select().single();

                if (!result.error && selectedContract) {
                    await updateContractBalance(selectedContract.id, quantity);
                    toast.success(`Bağlantıdan düşüldü: ${quantity} ${newEntry.unit}`);
                }
            }

            if (result.error) {
                toast.error(`HATA: ${result.error.message}`);
            } else {
                const data = result.data;
                if (finalMachineDetails.machine_name || finalMachineDetails.operator_name || isMachineCategory) {
                    const rpcPayload = {
                        p_transaction_id: data.id,
                        p_machine_name: finalMachineDetails.machine_name,
                        p_operator_name: finalMachineDetails.operator_name,
                        p_work_date: finalMachineDetails.work_date || data.transaction_date,
                        p_hours_worked: Number(finalMachineDetails.hours_worked) || 0,
                        p_location_detail: finalMachineDetails.location_detail,
                        p_notes: finalMachineDetails.notes
                    };
                    await supabase.rpc('upsert_machine_log', rpcPayload).catch(e => console.error(e));
                }

                toast.success(editingId ? 'Kayıt Güncellendi ✅' : 'Kayıt Eklendi ✅');

                if (editingId) {
                    setTransactions(transactions.map(t => t.id === editingId ? data : t));
                    setEditingId(null);
                } else {
                    setTransactions([data, ...transactions]);
                }

                // Reset Fields
                setNewEntry({
                    status: 'BEKLİYOR',
                    transaction_date: new Date().toISOString().split('T')[0],
                    firm_name: 'Camsan',
                    supplier_name: '',
                    document_no: '',
                    district: 'Şantiye',
                    work_type: 'Malzeme İrsaliyesi',
                    description: '',
                    category: 'Malzeme',
                    detail: '',
                    quantity: '',
                    unit: 'Adet',
                    unit_price: '',
                    vat_rate: '20'
                });

                setMachineDetails({
                    machine_name: '',
                    operator_name: '',
                    work_date: new Date().toISOString().split('T')[0],
                    hours_worked: '',
                    start_time: '',
                    end_time: '',
                    location_detail: '',
                    notes: ''
                });

                setSelectedContract(null);
            }
        } catch (err: any) {
            toast.error(`İstemci Hatası: ${err.message}`);
        }
    };

    const handleEdit = async (item: any) => {
        setEditingId(item.id);
        setNewEntry({
            ...item,
            supplier_name: item.supplier_name || '',
            document_no: item.document_no || '',
            firm_name: item.firm_name || '',
            district: item.district || '',
            work_type: item.work_type || '',
            description: item.description || '',
            category: item.category || 'Malzeme',
            detail: item.detail || '',
            unit: item.unit || 'Adet',
            quantity: item.quantity?.toString() || '',
            unit_price: item.unit_price?.toString() || '',
            vat_rate: item.amount > 0 ? Math.round((item.vat_amount / item.amount) * 100).toString() : '20'
        });

        if (item.contract_id) {
            const linked = contracts.find(c => c.id === item.contract_id);
            if (linked) setSelectedContract(linked);
        } else {
            setSelectedContract(null);
        }

        const { data: log } = await supabase.from('machine_logs').select('*').eq('transaction_id', item.id).maybeSingle();

        if (log) {
            setMachineDetails({
                machine_name: log.machine_name || '',
                operator_name: log.operator_name || '',
                work_date: log.work_date || item.transaction_date,
                hours_worked: log.hours_worked?.toString() || '',
                start_time: log.start_time || '',
                end_time: log.end_time || '',
                location_detail: log.location_detail || '',
                notes: log.notes || ''
            });
            toast.info("Makine detayları yüklendi.");
        } else {
            setMachineDetails({
                machine_name: '',
                operator_name: '',
                work_date: new Date().toISOString().split('T')[0],
                hours_worked: '',
                start_time: '',
                end_time: '',
                location_detail: '',
                notes: ''
            });
        }

        toast.info("Düzenleme modu aktif. Veriler yukarı taşındı.");
        const topElement = document.getElementById('input-row');
        if (topElement) topElement.scrollIntoView({ behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setNewEntry({
            status: 'BEKLİYOR',
            transaction_date: new Date().toISOString().split('T')[0],
            firm_name: 'Camsan',
            supplier_name: '',
            document_no: '',
            district: 'Şantiye',
            work_type: 'Malzeme İrsaliyesi',
            description: '',
            category: 'Malzeme',
            detail: '',
            quantity: '',
            unit: 'Adet',
            unit_price: '',
            vat_rate: '20'
        });
        setSelectedContract(null);
        toast.info("Düzenleme iptal edildi.");
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bu kaydı silmek istediğinize emin misiniz?')) return;
        const transaction = transactions.find(t => t.id === id);

        if (transaction && transaction.contract_id) {
            const { data: contract, error: fetchErr } = await supabase.from('contracts').select('*').eq('id', transaction.contract_id).single();

            if (contract && !fetchErr) {
                const newDelivered = parseFloat(contract.delivered_quantity || 0) - parseFloat(transaction.quantity || 0);
                await supabase.from('contracts').update({ delivered_quantity: newDelivered < 0 ? 0 : newDelivered }).eq('id', transaction.contract_id);
                setContracts(contracts.map(c => c.id === transaction.contract_id ? { ...c, delivered_quantity: newDelivered } : c));
            }
        }

        const { error } = await supabase.from('site_transactions').delete().eq('id', id);

        if (error) {
            toast.error(`Silinemedi: ${error.message}`);
        } else {
            toast.success('Kayıt silindi 🗑️');
            setTransactions(transactions.filter(t => t.id !== id));
        }
    };

    const handleNumberChange = (field: string, value: string) => {
        if (!/^[0-9.,]*$/.test(value)) return;
        let clean = value.replaceAll('.', '');
        const parts = clean.split(',');
        if (parts.length > 2) return;
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        const formatted = parts.join(',');
        setNewEntry({ ...newEntry, [field]: formatted });
    };

    const currentAmount = parseAmount(newEntry.quantity) * parseAmount(newEntry.unit_price);
    const currentVat = currentAmount * ((parseAmount(newEntry.vat_rate) || 20) / 100);
    const currentTotal = currentAmount + currentVat;

    const [isManageContractsOpen, setIsManageContractsOpen] = useState(false);

    const handleDeleteContract = async (id: string) => {
        if (!confirm('Bu bağlantıyı silmek istediğinize emin misiniz?')) return;
        const { error } = await supabase.from('contracts').delete().eq('id', id);
        if (error) {
            toast.error(`Silinemedi: ${error.message}`);
        } else {
            toast.success('Bağlantı silindi 🗑️');
            setContracts(contracts.filter(c => c.id !== id));
            if (selectedContract?.id === id) setSelectedContract(null);
        }
    };

    const togglePaymentStatus = async (id: string, currentStatus: string) => {
        const nextStatus = { 'Ödenmedi': 'Ödendi', 'Ödendi': 'Kısmi', 'Kısmi': 'Ödenmedi' }[currentStatus] || 'Ödendi';
        setTransactions(transactions.map(t => t.id === id ? { ...t, payment_status: nextStatus } : t));
        const { error } = await supabase.from('site_transactions').update({ payment_status: nextStatus }).eq('id', id);
        if (error) {
            toast.error("Ödeme durumu güncellenemedi");
            setTransactions(transactions.map(t => t.id === id ? { ...t, payment_status: currentStatus } : t));
        } else {
            toast.success(`Ödeme Durumu: ${nextStatus}`);
        }
    };

    // Animation Variants
    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.03 } }
    };

    const item = {
        hidden: { opacity: 0, scale: 0.99 },
        show: { opacity: 1, scale: 1 }
    };

    return (
        <div className="flex flex-col h-full bg-background font-sans">
            <PageHeader title="Cari Yönetim 2026" subtitle="AKILLI İŞLEM DEFTERİ" backLink="/">
                <Dialog open={isManageContractsOpen} onOpenChange={setIsManageContractsOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="gap-2 border-primary/20 hover:bg-primary/5 text-primary">
                            <Link2 className="w-4 h-4" /> Bağlantıları Yönet
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl glass-card">
                        <DialogHeader>
                            <DialogTitle>Mevcut Bağlantılar (Sözleşmeler)</DialogTitle>
                        </DialogHeader>
                        <div className="py-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                            <Table>
                                <TableHeader className="bg-muted/30">
                                    <TableRow>
                                        <TableHead className="w-[30px]"></TableHead>
                                        <TableHead>Tedarikçi</TableHead>
                                        <TableHead>Malzeme</TableHead>
                                        <TableHead className="text-right">Toplam</TableHead>
                                        <TableHead className="text-right">Teslim Edilen</TableHead>
                                        <TableHead className="text-right">Kalan</TableHead>
                                        <TableHead className="text-right">Birim Fiyat</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {contracts.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center text-muted-foreground py-8">Hiç bağlantı bulunamadı.</TableCell>
                                        </TableRow>
                                    ) : contracts.map(c => (
                                        <React.Fragment key={c.id}>
                                            <TableRow className={expandedContractId === c.id ? "bg-primary/5" : ""}>
                                                <TableCell className="w-[30px]">
                                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setExpandedContractId(expandedContractId === c.id ? null : c.id)}>
                                                        {expandedContractId === c.id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                                    </Button>
                                                </TableCell>
                                                <TableCell className="font-medium text-foreground">{c.supplier}</TableCell>
                                                <TableCell>{c.material_group}</TableCell>
                                                <TableCell className="text-right font-mono">{Number(c.total_quantity).toLocaleString('tr-TR')} {c.unit}</TableCell>
                                                <TableCell className="text-right font-mono text-muted-foreground">{Number(c.delivered_quantity).toLocaleString('tr-TR')} {c.unit}</TableCell>
                                                <TableCell className="text-right font-mono font-bold text-primary">{Number(c.remaining_quantity).toLocaleString('tr-TR')} {c.unit}</TableCell>
                                                <TableCell className="text-right font-mono">{Number(c.unit_price).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL</TableCell>
                                                <TableCell>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive" onClick={() => handleDeleteContract(c.id)}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                            <AnimatePresence>
                                                {expandedContractId === c.id && (
                                                    <TableRow className="bg-muted/20">
                                                        <TableCell colSpan={8} className="p-4">
                                                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-background/50 rounded-lg border border-border/50 p-2 overflow-hidden">
                                                                <div className="text-[10px] font-bold text-muted-foreground mb-2 uppercase tracking-wide px-2">İşlem Geçmişi</div>
                                                                <Table>
                                                                    <TableHeader>
                                                                        <TableRow className="h-8 border-none bg-muted/30">
                                                                            <TableHead className="h-8 text-[10px]">TARİH</TableHead>
                                                                            <TableHead className="h-8 text-[10px]">AÇIKLAMA</TableHead>
                                                                            <TableHead className="h-8 text-[10px] text-right">MİKTAR</TableHead>
                                                                            <TableHead className="h-8 text-[10px] text-right">TUTAR</TableHead>
                                                                        </TableRow>
                                                                    </TableHeader>
                                                                    <TableBody>
                                                                        {getContractTransactions(c.id).length === 0 ? (
                                                                            <TableRow>
                                                                                <TableCell colSpan={4} className="text-center text-xs text-muted-foreground py-2">Henüz işlem yapılmamış.</TableCell>
                                                                            </TableRow>
                                                                        ) : getContractTransactions(c.id).map(t => (
                                                                            <TableRow key={t.id} className="h-8 border-none hover:bg-muted/10">
                                                                                <TableCell className="text-xs py-1 text-muted-foreground">{new Date(t.transaction_date).toLocaleDateString('tr-TR')}</TableCell>
                                                                                <TableCell className="text-xs py-1 text-muted-foreground">{t.description || '-'}</TableCell>
                                                                                <TableCell className="text-xs py-1 text-right font-mono">{Number(t.quantity).toLocaleString('tr-TR')} {t.unit}</TableCell>
                                                                                <TableCell className="text-xs py-1 text-right font-mono">{Number(t.total_amount).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL</TableCell>
                                                                            </TableRow>
                                                                        ))}
                                                                    </TableBody>
                                                                </Table>
                                                            </motion.div>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </AnimatePresence>
                                        </React.Fragment>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </DialogContent>
                </Dialog>
            </PageHeader>

            <div className="flex-1 p-4 overflow-hidden flex flex-col gap-4">

                {/* Control Bar */}
                <div className="flex justify-between items-center bg-muted/10 p-2 rounded-lg border border-border/40">
                    <div className="flex items-center gap-2 bg-background/50 p-1.5 rounded-md border border-border/50 shadow-sm w-96 relative focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                        <Search className="w-4 h-4 text-muted-foreground ml-2" />
                        <Input
                            aria-label="İşlem Ara"
                            placeholder="İşlem, firma veya belge no ara..."
                            className="border-none h-6 text-sm bg-transparent focus-visible:ring-0 placeholder:text-muted-foreground/50"
                            value={filterText}
                            onChange={(e) => setFilterText(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground" onClick={fetchTransactions}>
                            <RefreshCw className="w-4 h-4" /> Yenile
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-2 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/10">
                            <Download className="w-4 h-4" /> Excel
                        </Button>
                    </div>
                </div>

                {/* Main Data Grid (Excel Style) */}
                <Card className="flex-1 overflow-auto border-border/40 shadow-xl rounded-xl bg-background/40 backdrop-blur-md glass-card">
                    <Table>
                        <TableHeader className="bg-muted/40 sticky top-0 z-10 opacity-100 backdrop-blur-md">
                            <TableRow className="border-b border-border/50 hover:bg-transparent">
                                <TableHead className="w-[80px] text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-center">ONAY</TableHead>
                                <TableHead className="w-[110px] text-[10px] font-bold text-muted-foreground uppercase tracking-wider">TARİH</TableHead>
                                <TableHead className="w-[140px] text-[10px] font-bold text-muted-foreground uppercase tracking-wider">FİRMA</TableHead>
                                <TableHead className="w-[140px] text-[10px] font-bold text-muted-foreground uppercase tracking-wider">TEDARİKÇİ</TableHead>
                                <TableHead className="w-[100px] text-[10px] font-bold text-muted-foreground uppercase tracking-wider">ADIN. NO</TableHead>
                                <TableHead className="w-[120px] text-[10px] font-bold text-muted-foreground uppercase tracking-wider">MAHAL</TableHead>
                                <TableHead className="w-[160px] text-[10px] font-bold text-muted-foreground uppercase tracking-wider">İMALAT TÜRÜ</TableHead>
                                <TableHead className="min-w-[150px] text-[10px] font-bold text-muted-foreground uppercase tracking-wider">AÇIKLAMA</TableHead>
                                <TableHead className="w-[140px] text-[10px] font-bold text-muted-foreground uppercase tracking-wider">TÜR</TableHead>
                                <TableHead className="min-w-[120px] text-[10px] font-bold text-muted-foreground uppercase tracking-wider">DETAY</TableHead>
                                <TableHead className="w-[80px] text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-right">MİKTAR</TableHead>
                                <TableHead className="w-[90px] text-[10px] font-bold text-muted-foreground uppercase tracking-wider">BİRİM</TableHead>
                                <TableHead className="w-[100px] text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-right">B.FİYAT</TableHead>
                                <TableHead className="w-[100px] text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-right">TUTAR</TableHead>
                                <TableHead className="w-[100px] text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-right">KDV</TableHead>
                                <TableHead className="w-[110px] text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-right">TOPLAM</TableHead>
                                <TableHead className="w-[100px] text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-center">ÖDEME</TableHead>
                                <TableHead className="w-[80px] text-[10px] font-bold text-center">İŞLEM</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>

                            {/* Input Row (Quick Add / Edit) */}
                            <TableRow id="input-row" className={`${editingId ? 'bg-secondary/20 shadow-inner' : 'bg-primary/5 hover:bg-primary/10'} border-b-2 border-primary/20 sticky top-[34px] z-20`}>
                                <TableCell className="p-1 text-center">
                                    <div className="flex justify-center items-center h-7 w-full text-muted-foreground/30">
                                        <Circle className="w-4 h-4" />
                                    </div>
                                </TableCell>
                                <TableCell className="p-1">
                                    <Input type="date" className="h-7 text-xs bg-background/80 px-1 border-border/50" value={newEntry.transaction_date} onChange={(e) => setNewEntry({ ...newEntry, transaction_date: e.target.value })} />
                                </TableCell>
                                <TableCell className="p-1">
                                    <SearchableSelect options={FIRMS} value={newEntry.firm_name} onChange={(v) => setNewEntry({ ...newEntry, firm_name: v })} placeholder="Firma" className="h-7 text-xs bg-background/80 border-border/50" />
                                </TableCell>
                                <TableCell className="p-1">
                                    <SearchableSelect options={SUPPLIERS} value={newEntry.supplier_name} onChange={(v) => setNewEntry({ ...newEntry, supplier_name: v })} placeholder="Tedarikçi" className="h-7 text-xs bg-background/80 border-border/50" />
                                </TableCell>
                                <TableCell className="p-1">
                                    <Input placeholder="No" className="h-7 text-xs bg-background/80 px-1 border-border/50" value={newEntry.document_no} onChange={(e) => setNewEntry({ ...newEntry, document_no: e.target.value })} />
                                </TableCell>
                                <TableCell className="p-1">
                                    <SearchableSelect options={DISTRICTS} value={newEntry.district} onChange={(v) => setNewEntry({ ...newEntry, district: v })} placeholder="Mahal" className="h-7 text-xs bg-background/80 border-border/50" />
                                </TableCell>
                                <TableCell className="p-1">
                                    <SearchableSelect options={WORK_TYPES} value={newEntry.work_type} onChange={(v) => setNewEntry({ ...newEntry, work_type: v })} placeholder="İmalat" className="h-7 text-xs bg-background/80 border-border/50" />
                                </TableCell>
                                <TableCell className="p-1">
                                    <Input placeholder="Açıklama" className="h-7 text-xs bg-background/80 px-1 border-border/50" value={newEntry.description} onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })} />
                                </TableCell>
                                <TableCell className="p-1">
                                    <SearchableSelect
                                        options={MACHINES_AND_MATERIALS}
                                        value={newEntry.category}
                                        onChange={(v) => {
                                            const isIron = v === 'İnşaat Demiri';
                                            setNewEntry({ ...newEntry, category: v, vat_rate: isIron ? '10' : '20' });
                                            if (isIron) toast.info('KDV oranı otomatik olarak %10 (Tevkifatlı) ayarlandı. Bağlantı seçebilirsiniz.');
                                        }}
                                        placeholder="Tür"
                                        className="h-7 text-xs bg-background/80 border-border/50"
                                    />
                                </TableCell>
                                <TableCell className="p-1">
                                    <SearchableSelect options={DETAILS} value={newEntry.detail} onChange={(v) => setNewEntry({ ...newEntry, detail: v })} placeholder="Detay" className="h-7 text-xs bg-background/80 border-border/50" />
                                </TableCell>
                                <TableCell className="p-1">
                                    <Input type="text" placeholder="0" className="h-7 text-xs bg-background/80 text-right px-1 border-border/50 font-mono" value={newEntry.quantity} onChange={(e) => handleNumberChange('quantity', e.target.value)} />
                                </TableCell>
                                <TableCell className="p-1">
                                    <SearchableSelect options={UNITS} value={newEntry.unit} onChange={(v) => setNewEntry({ ...newEntry, unit: v })} placeholder="Birim" className="h-7 text-xs bg-background/80 border-border/50" />
                                </TableCell>
                                <TableCell className="p-1">
                                    <Input type="text" placeholder="0,00" className="h-7 text-xs bg-background/80 text-right px-1 border-border/50 font-mono" value={newEntry.unit_price} onChange={(e) => handleNumberChange('unit_price', e.target.value)} />
                                </TableCell>
                                <TableCell className="text-right text-xs font-mono p-1 align-middle text-muted-foreground">
                                    {currentAmount > 0 ? currentAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-'}
                                </TableCell>
                                <TableCell className="text-right text-xs font-mono p-1 align-middle text-muted-foreground">
                                    {currentVat > 0 ? currentVat.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-'}
                                </TableCell>
                                <TableCell className="text-right text-xs font-mono p-1 align-middle text-primary font-bold">
                                    {currentTotal > 0 ? currentTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-'}
                                </TableCell>
                                <TableCell className="p-1 text-center">
                                    <span className="text-xs text-muted-foreground/30 select-none">-</span>
                                </TableCell>
                                <TableCell className="p-1 flex items-center justify-center gap-1">
                                    {/* Link to Contract Button (Only for Iron/Concrete) */}
                                    {newEntry.category === 'İnşaat Demiri' && !editingId && (
                                        <Dialog open={isContractDialogOpen} onOpenChange={setIsContractDialogOpen}>
                                            <DialogTrigger asChild>
                                                <Button size="icon" className={`h-7 w-7 rounded-sm ${selectedContract ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`} title={selectedContract ? `Seçili: ${selectedContract.supplier}` : 'Bağlantıdan Düş'}>
                                                    <Link2 className="w-3 h-3" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="glass-card">
                                                <DialogHeader><DialogTitle>Sözleşme / Bağlantı Seç</DialogTitle></DialogHeader>
                                                <div className="py-2 space-y-2">
                                                    {contracts.length === 0 ? <div className="text-muted-foreground text-sm">Hiç aktif bağlantı bulunamadı.</div> : contracts.map(c => (
                                                        <div key={c.id} className={`p-3 border rounded cursor-pointer hover:bg-muted/50 flex justify-between items-center ${selectedContract?.id === c.id ? 'border-primary bg-primary/5' : 'border-border'}`} onClick={() => {
                                                            setSelectedContract(c);
                                                            setIsContractDialogOpen(false);
                                                            if (c.unit_price) {
                                                                const formattedPrice = Number(c.unit_price).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                                                                setNewEntry({ ...newEntry, unit_price: formattedPrice, supplier_name: c.supplier });
                                                                toast.success("Birim fiyat ve tedarikçi güncellendi.");
                                                            }
                                                        }}>
                                                            <div><div className="font-bold">{c.supplier}</div><div className="text-sm text-muted-foreground">{c.material_group}</div></div>
                                                            <div className="text-right"><div className="font-mono text-sm">{c.remaining_quantity} {c.unit} Kaldı</div><div className="text-xs text-muted-foreground">{c.unit_price} TL</div></div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <DialogFooter><Button variant="outline" onClick={() => { setSelectedContract(null); setIsContractDialogOpen(false); }}>Seçimi Kaldır</Button></DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    )}
                                    {/* Machine Details Button */}
                                    {['Jcb', 'Vinç', 'Kamyon', 'Mini Kepçe', 'Ekskavatör', 'İş Makinesi', 'Makine', 'Hizmet'].some(m => newEntry.category?.includes(m) || newEntry.description?.includes(m)) && (
                                        <Dialog open={isMachineDialogOpen} onOpenChange={setIsMachineDialogOpen}>
                                            <DialogTrigger asChild>
                                                <Button size="icon" className={`h-7 w-7 rounded-sm ${machineDetails.operator_name ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'}`} title={machineDetails.operator_name ? `Operatör: ${machineDetails.operator_name}` : 'Makine Detayı Ekle'}>
                                                    <Truck className="w-3 h-3" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="glass-card">
                                                <DialogHeader><DialogTitle>Makine Çalışma Detayları</DialogTitle></DialogHeader>
                                                <div className="grid gap-4 py-4">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2"><Label>Makine Adı / Plaka</Label><Input value={machineDetails.machine_name} onChange={e => setMachineDetails({ ...machineDetails, machine_name: e.target.value })} placeholder="Örn: 34 ABC 123" /></div>
                                                        <div className="space-y-2"><Label>Operatör Adı</Label><Input value={machineDetails.operator_name} onChange={e => setMachineDetails({ ...machineDetails, operator_name: e.target.value })} placeholder="Örn: Ahmet Yılmaz" /></div>
                                                    </div>
                                                </div>
                                                <DialogFooter><Button onClick={() => setIsMachineDialogOpen(false)}>Kaydet ve Kapat</Button></DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    )}
                                    {editingId ? (
                                        <>
                                            <Button size="icon" onClick={handleSave} className="h-7 w-7 bg-green-600 hover:bg-green-700 text-white rounded-sm"><Check className="w-4 h-4" /></Button>
                                            <Button size="icon" onClick={handleCancelEdit} className="h-7 w-7 bg-destructive hover:bg-destructive/90 text-white rounded-sm"><X className="w-4 h-4" /></Button>
                                        </>
                                    ) : (
                                        <Button size="icon" onClick={handleSave} className="h-7 w-7 bg-primary hover:bg-primary/90 text-primary-foreground rounded-sm shadow-md animate-in zoom-in-50"><Plus className="w-4 h-4" /></Button>
                                    )}
                                </TableCell>
                            </TableRow>

                            {/* Data Rows */}
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={17} className="text-center h-24 text-muted-foreground">Yükleniyor...</TableCell>
                                </TableRow>
                            ) : (
                                <AnimatePresence>
                                    {transactions
                                        .filter(t => t.description?.toLowerCase().includes(filterText.toLowerCase()) || t.category?.toLowerCase().includes(filterText.toLowerCase()) || t.firm_name?.toLowerCase().includes(filterText) || filterText === '')
                                        .map((t, index) => (
                                            <motion.tr
                                                key={t.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className={`group hover:bg-muted/10 h-9 border-b border-border/40 transition-colors cursor-pointer ${editingId === t.id ? 'bg-secondary/10' : ''}`}
                                            >
                                                <TableCell className="p-1 text-center">
                                                    <Button variant="ghost" size="icon" className={`h-6 w-6 ${t.status === 'ONAYLANDI' ? 'text-green-500 hover:text-green-600' : 'text-muted-foreground hover:text-foreground'}`} onClick={(e) => { e.stopPropagation(); handleToggleStatus(t.id, t.status); }}>
                                                        {t.status === 'ONAYLANDI' ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                                                    </Button>
                                                </TableCell>
                                                <TableCell className="p-1 text-xs font-mono text-muted-foreground truncate">{new Date(t.transaction_date).toLocaleDateString('tr-TR')}</TableCell>
                                                <TableCell className="p-1 text-xs font-medium text-foreground truncate">{t.firm_name}</TableCell>
                                                <TableCell className="p-1 text-xs text-muted-foreground truncate">{t.supplier_name}</TableCell>
                                                <TableCell className="p-1 text-xs text-muted-foreground/60 font-mono truncate">{t.document_no}</TableCell>
                                                <TableCell className="p-1 text-xs text-muted-foreground truncate">{t.district}</TableCell>
                                                <TableCell className="p-1 text-xs text-muted-foreground truncate">{t.work_type}</TableCell>
                                                <TableCell className="p-1 text-xs text-foreground truncate font-medium">{t.description}</TableCell>
                                                <TableCell className="p-1 text-xs text-muted-foreground truncate">{t.category}</TableCell>
                                                <TableCell className="p-1 text-xs text-muted-foreground truncate">{t.detail}</TableCell>
                                                <TableCell className="p-1 text-xs font-mono text-foreground text-right">{Number(t.quantity).toLocaleString('tr-TR')}</TableCell>
                                                <TableCell className="p-1 text-xs text-muted-foreground">{t.unit}</TableCell>
                                                <TableCell className="p-1 text-xs font-mono text-muted-foreground text-right">{Number(t.unit_price).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</TableCell>
                                                <TableCell className="p-1 text-xs font-mono text-muted-foreground text-right">{Number(t.amount).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</TableCell>
                                                <TableCell className="p-1 text-xs font-mono text-muted-foreground text-right">{Number(t.vat_amount).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</TableCell>
                                                <TableCell className="p-1 text-xs font-mono text-foreground font-bold text-right">{Number(t.total_amount).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</TableCell>
                                                <TableCell className="p-1 text-center">
                                                    <Badge variant="outline" className={`cursor-pointer select-none text-[9px] px-2 py-0 w-[70px] justify-center rounded-sm ${t.payment_status === 'Ödendi' ? 'bg-green-500/10 text-green-500 border-green-500/20' : t.payment_status === 'Kısmi' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 'bg-destructive/10 text-destructive border-destructive/20'}`} onClick={(e) => { e.stopPropagation(); togglePaymentStatus(t.id, t.payment_status || 'Ödenmedi'); }}>
                                                        {t.payment_status || 'Ödenmedi'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="p-1 text-center flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button variant="ghost" size="icon" className="h-6 w-6 hover:text-primary" onClick={() => handleEdit(t)}><Edit2 className="w-3 h-3" /></Button>
                                                    <Button variant="ghost" size="icon" className="h-6 w-6 hover:text-destructive" onClick={() => handleDelete(t.id)}><Trash2 className="w-3 h-3" /></Button>
                                                </TableCell>
                                            </motion.tr>
                                        ))}
                                </AnimatePresence>
                            )}
                        </TableBody>
                    </Table>
                </Card>
            </div>
        </div>
    );
}
