'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Calendar, MapPin, Clock, Wallet, Truck, RefreshCw, Filter, Construction } from "lucide-react";
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export default function MachineOperationsPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterText, setFilterText] = useState('');

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        setLoading(true);
        // Fetch site_transactions filtered by machine categories
        const { data, error } = await supabase
            .from('site_transactions')
            .select(`
                *,
                machine_log:machine_logs (*)
            `)
            .in('category', ['Jcb', 'Vinç', 'Kamyon', 'Mini Kepçe', 'Ekskavatör', 'İş Makinesi', 'Makine', 'Hizmet'])
            .order('transaction_date', { ascending: false });

        if (error) {
            console.error('Error fetching machine logs:', error);
            toast.error('Veriler yüklenirken hata oluştu');
        } else {
            // Normalize data structure
            const normalized = (data || []).map((t: any) => {
                const log = t.machine_log?.[0] || {};
                return {
                    id: t.id,
                    work_date: log.work_date || t.transaction_date,
                    machine_name: log.machine_name || t.category, // Fallback
                    operator_name: log.operator_name || '-',
                    location_detail: log.location_detail || t.district || t.project_id || '-',
                    hours_worked: log.hours_worked || t.quantity || 0,
                    start_time: log.start_time,
                    end_time: log.end_time,
                    notes: log.notes || t.description,
                    transaction: t
                };
            });
            setLogs(normalized);
        }
        setLoading(false);
    };

    const filteredLogs = logs.filter(log =>
        log.machine_name?.toLowerCase().includes(filterText.toLowerCase()) ||
        log.location_detail?.toLowerCase().includes(filterText.toLowerCase()) ||
        log.transaction?.firm_name?.toLowerCase().includes(filterText.toLowerCase()) ||
        log.transaction?.supplier_name?.toLowerCase().includes(filterText.toLowerCase())
    );

    const totalHours = filteredLogs.reduce((sum, log) => sum + (Number(log.hours_worked) || 0), 0);
    const totalAmount = filteredLogs.reduce((sum, log) => sum + (Number(log.transaction?.amount) || 0), 0);

    const handleTogglePaymentStatus = async (id: string, currentStatus: string) => {
        const nextStatus = {
            'Ödenmedi': 'Ödendi',
            'Ödendi': 'Kısmi',
            'Kısmi': 'Ödenmedi'
        }[currentStatus] || 'Ödendi';

        // Optimistic UI Update
        setLogs(logs.map(log =>
            log.id === id ? { ...log, transaction: { ...log.transaction, payment_status: nextStatus } } : log
        ));

        const { error } = await supabase
            .from('site_transactions')
            .update({ payment_status: nextStatus })
            .eq('id', id);

        if (error) {
            console.error("Payment Status Error:", error);
            toast.error("Ödeme durumu güncellenemedi");
            // Revert
            setLogs(logs.map(log =>
                log.id === id ? { ...log, transaction: { ...log.transaction, payment_status: currentStatus } } : log
            ));
        } else {
            toast.success(`Ödeme Durumu: ${nextStatus}`);
        }
    };

    return (
        <div className="flex flex-col h-full bg-background font-sans">
            <PageHeader title="Makine Parkı & Çalışmalar" subtitle="SAHA OPERASYON VE HİZMET TAKİBİ" backLink="/">
                <Button variant="outline" size="sm" onClick={fetchLogs} className="gap-2 border-primary/20 hover:bg-primary/5 text-primary">
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Yenile
                </Button>
            </PageHeader>

            <div className="flex-1 p-4 md:p-6 overflow-hidden flex flex-col gap-6">

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="glass-card p-6 flex items-center gap-4 relative overflow-hidden group">
                        <div className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-orange-500 to-orange-600/50" />
                        <div className="p-4 bg-orange-500/10 rounded-full group-hover:scale-110 transition-transform duration-300">
                            <Clock className="w-8 h-8 text-orange-500" />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Toplam Çalışma</div>
                            <div className="text-3xl font-bold text-foreground mt-1">{totalHours.toLocaleString('tr-TR')} <span className="text-sm font-normal text-muted-foreground">Saat</span></div>
                        </div>
                    </Card>

                    <Card className="glass-card p-6 flex items-center gap-4 relative overflow-hidden group">
                        <div className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-blue-500 to-blue-600/50" />
                        <div className="p-4 bg-blue-500/10 rounded-full group-hover:scale-110 transition-transform duration-300">
                            <Truck className="w-8 h-8 text-blue-500" />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Kayıtlı İşlem</div>
                            <div className="text-3xl font-bold text-foreground mt-1">{filteredLogs.length} <span className="text-sm font-normal text-muted-foreground">Adet</span></div>
                        </div>
                    </Card>

                    <Card className="glass-card p-6 flex items-center gap-4 relative overflow-hidden group">
                        <div className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-green-500 to-green-600/50" />
                        <div className="p-4 bg-green-500/10 rounded-full group-hover:scale-110 transition-transform duration-300">
                            <Wallet className="w-8 h-8 text-green-500" />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Toplam Tutar</div>
                            <div className="text-3xl font-bold text-foreground mt-1">{totalAmount.toLocaleString('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} <span className="text-sm font-normal text-muted-foreground">TL</span></div>
                        </div>
                    </Card>
                </div>

                {/* Filter & Toolbar */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-muted/20 p-2 rounded-xl border border-border/40">
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="Makine, Operatör veya Firma Ara..."
                            className="pl-9 bg-background/50 border-transparent focus:border-primary/30 h-10 transition-all font-medium"
                            value={filterText}
                            onChange={(e) => setFilterText(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="hidden md:flex gap-2 text-muted-foreground">
                            <Filter className="w-4 h-4" /> Filtrele
                        </Button>
                    </div>
                </div>

                {/* Data Table */}
                <Card className="flex-1 overflow-hidden glass-card border border-border/50 shadow-xl rounded-xl flex flex-col">
                    <div className="overflow-auto flex-1 custom-scrollbar">
                        <Table>
                            <TableHeader className="bg-muted/40 sticky top-0 z-10 backdrop-blur-md">
                                <TableRow className="border-b border-border/50 hover:bg-transparent">
                                    <TableHead className="font-bold text-xs text-muted-foreground uppercase tracking-wider w-[120px]">TARİH</TableHead>
                                    <TableHead className="font-bold text-xs text-muted-foreground uppercase tracking-wider">MAKİNE & PLAKA</TableHead>
                                    <TableHead className="font-bold text-xs text-muted-foreground uppercase tracking-wider">KONUM</TableHead>
                                    <TableHead className="text-right font-bold text-xs uppercase tracking-wider text-orange-600 bg-orange-500/5">SÜRE / MİKTAR</TableHead>
                                    <TableHead className="font-bold text-xs text-muted-foreground uppercase tracking-wider">FİRMA / TEDARİKÇİ</TableHead>
                                    <TableHead className="font-bold text-xs text-muted-foreground uppercase tracking-wider">AÇIKLAMA</TableHead>
                                    <TableHead className="text-right font-bold text-xs text-muted-foreground uppercase tracking-wider">TUTAR</TableHead>
                                    <TableHead className="text-center font-bold text-xs text-muted-foreground uppercase tracking-wider w-[100px]">DURUM</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center h-32">
                                            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                                <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                                                <span className="text-xs">Veriler Yükleniyor...</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : filteredLogs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center h-32 text-muted-foreground">
                                            <div className="flex flex-col items-center gap-2 opacity-50">
                                                <Construction className="w-8 h-8" />
                                                <span>Kayıt bulunamadı.</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    <AnimatePresence>
                                        {filteredLogs.map((log) => (
                                            <motion.tr
                                                key={log.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="group hover:bg-muted/30 border-b border-border/40 transition-colors h-12"
                                            >
                                                <TableCell className="py-2">
                                                    <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded w-fit">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(log.work_date).toLocaleDateString('tr-TR')}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-2">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-semibold text-foreground">{log.machine_name}</span>
                                                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                            <User className="w-3 h-3" /> {log.operator_name}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-2 text-xs text-muted-foreground">
                                                    <div className="flex items-center gap-1.5">
                                                        <MapPin className="w-3 h-3 text-primary/50" />
                                                        {log.location_detail || '-'}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-2 text-right bg-orange-500/5 group-hover:bg-orange-500/10 transition-colors border-x border-dashed border-orange-500/10">
                                                    <div className="font-mono font-bold text-orange-600">
                                                        {Number(log.hours_worked).toLocaleString('tr-TR')} <span className="text-[10px] text-orange-400 font-normal">{log.transaction?.unit}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-2">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold text-foreground">{log.transaction?.firm_name}</span>
                                                        <span className="text-[10px] text-muted-foreground">{log.transaction?.supplier_name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-2">
                                                    <div className="text-xs text-muted-foreground max-w-[200px] truncate" title={log.notes || log.transaction?.description}>
                                                        {log.notes || log.transaction?.description || '-'}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-2 text-right">
                                                    <span className="font-mono text-xs font-medium text-foreground">
                                                        {log.transaction?.amount ? Number(log.transaction.amount).toLocaleString('tr-TR', { minimumFractionDigits: 2 }) + ' ₺' : '-'}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="py-2 text-center">
                                                    <Badge
                                                        variant="outline"
                                                        className={`cursor-pointer select-none text-[9px] px-2 py-0 h-5 w-[70px] justify-center transition-all ${log.transaction?.payment_status === 'Ödendi'
                                                                ? 'bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20'
                                                                : log.transaction?.payment_status === 'Kısmi'
                                                                    ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20 hover:bg-yellow-500/20'
                                                                    : 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20'
                                                            }`}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleTogglePaymentStatus(log.transaction?.id || log.id, log.transaction?.payment_status || 'Ödenmedi');
                                                        }}
                                                    >
                                                        {log.transaction?.payment_status || 'Ödenmedi'}
                                                    </Badge>
                                                </TableCell>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </Card>
            </div>
        </div>
    );
}
