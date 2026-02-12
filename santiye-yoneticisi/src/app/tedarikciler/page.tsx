'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Download, Plus, Trash2, Folder, Pencil, Truck, User, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { PageHeader } from "@/components/layout/page-header";
import { motion, AnimatePresence } from "framer-motion";

export default function SuppliersPage() {
    const [suppliers, setSuppliers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('all'); // all, taseron, tedarikci, both
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchSuppliers();
    }, []);

    async function fetchSuppliers() {
        const { data, error } = await supabase.from('suppliers').select('*').order('created_at', { ascending: false });
        if (data) setSuppliers(data);
        setLoading(false);
    }

    async function handleDelete(id: string) {
        if (!confirm("Bu firmayı silmek istediğinize emin misiniz?")) return;

        try {
            const res = await fetch(`/api/suppliers/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setSuppliers(suppliers.filter(s => s.id !== id));
            } else {
                alert("Silme işlemi başarısız oldu.");
            }
        } catch (e) {
            console.error(e);
            alert("Bir hata oluştu.");
        }
    }

    // Filter Logic
    const filteredSuppliers = suppliers.filter(s => {
        const matchesSearch = s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.email?.toLowerCase().includes(searchTerm.toLowerCase());

        if (!matchesSearch) return false;

        if (activeFilter === 'all') return true;
        if (activeFilter === 'taseron') return s.type && s.type.toLowerCase().includes('taşeron');
        if (activeFilter === 'tedarikci') return s.type && s.type.toLowerCase().includes('tedarikçi');
        return true;
    });

    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.05 } }
    };

    const item = {
        hidden: { opacity: 0, x: -10 },
        show: { opacity: 1, x: 0 }
    };

    return (
        <div className="flex flex-col h-full bg-background font-sans">
            <PageHeader title="Taşeron ve Tedarikçiler" subtitle="FİRMA VE TEDARİKÇİ YÖNETİMİ" backLink="/">
                <div className="flex items-center gap-3">
                    <Link href="/tedarikciler/yeni">
                        <Button className="rounded-full shadow-lg gap-2">
                            <Plus className="w-4 h-4" /> Yeni Firma
                        </Button>
                    </Link>
                </div>
            </PageHeader>

            <div className="flex flex-1 overflow-hidden p-6 gap-6 pt-2">

                {/* Left Sidebar (Filters) */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-64 space-y-4 hidden md:block shrink-0"
                >
                    <div className="glass-card rounded-xl overflow-hidden">
                        <div className="p-4 flex flex-col items-center border-b border-border/50 bg-muted/30">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-lg mb-2 shadow-inner">
                                <Building2 className="w-6 h-6" />
                            </div>
                            <div className="text-sm font-semibold text-foreground">Tedarikçi Yönetimi</div>
                        </div>

                        <div className="p-2 space-y-1">
                            <button
                                onClick={() => setActiveFilter('all')}
                                className={cn(
                                    "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                                    activeFilter === 'all'
                                        ? "bg-primary/10 text-primary shadow-sm"
                                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                )}
                            >
                                <Folder className="w-4 h-4" /> Hepsi
                            </button>
                            <button
                                onClick={() => setActiveFilter('taseron')}
                                className={cn(
                                    "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                                    activeFilter === 'taseron'
                                        ? "bg-primary/10 text-primary shadow-sm"
                                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                )}
                            >
                                <User className="w-4 h-4" /> Taşeron
                            </button>
                            <button
                                onClick={() => setActiveFilter('tedarikci')}
                                className={cn(
                                    "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                                    activeFilter === 'tedarikci'
                                        ? "bg-primary/10 text-primary shadow-sm"
                                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                )}
                            >
                                <Truck className="w-4 h-4" /> Tedarikçi
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Right Content */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex-1 flex flex-col glass-card rounded-xl overflow-hidden shadow-xl"
                >

                    {/* Toolbar */}
                    <div className="p-4 border-b border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/10">
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                aria-label="Tedarikçi Ara"
                                placeholder="Firma adı veya e-posta ara..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 h-9 bg-background/50 border-border/50 focus:bg-background transition-colors"
                            />
                        </div>
                        <div className="flex items-center gap-2 self-end sm:self-auto">
                            <Button variant="outline" className="h-9 text-xs font-medium gap-2">
                                <Filter className="w-3 h-3" /> Filtrele
                            </Button>
                            <Button variant="outline" className="h-9 text-xs font-medium gap-2 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20">
                                <Download className="w-3 h-3" /> Excel
                            </Button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <Table>
                            <TableHeader className="bg-muted/40 sticky top-0 z-10 backdrop-blur-md">
                                <TableRow className="hover:bg-transparent border-b border-border/50">
                                    <TableHead className="w-12 h-10"><Input type="checkbox" className="w-4 h-4 translate-y-0.5" /></TableHead>
                                    <TableHead className="h-10 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Firma Adı</TableHead>
                                    <TableHead className="h-10 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Firma Tipi</TableHead>
                                    <TableHead className="h-10 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Ticari Faaliyetler</TableHead>
                                    <TableHead className="h-10 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Email</TableHead>
                                    <TableHead className="h-10 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Telefon</TableHead>
                                    <TableHead className="h-10 w-24 text-right"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center h-64 text-muted-foreground">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                                                <span className="text-sm font-medium animate-pulse">Firmalar yükleniyor...</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : filteredSuppliers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center h-64 text-muted-foreground/50">
                                            <div className="flex flex-col items-center justify-center">
                                                <Building2 className="w-16 h-16 mb-4 opacity-20" />
                                                <span className="text-sm font-medium">Kayıtlı firma bulunamadı.</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    <AnimatePresence>
                                        {filteredSuppliers.map((s, idx) => (
                                            <motion.tr
                                                key={s.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                className="group cursor-pointer hover:bg-muted/30 border-b border-border/40 transition-colors"
                                            >
                                                <TableCell className="py-3"><Input type="checkbox" className="w-4 h-4" /></TableCell>
                                                <TableCell className="font-medium py-3 text-foreground">
                                                    <Link href={`/tedarikciler/${s.id}`} className="hover:text-primary hover:underline block flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                                            {s.name.substring(0, 2).toUpperCase()}
                                                        </div>
                                                        {s.name}
                                                    </Link>
                                                </TableCell>
                                                <TableCell className="py-3">
                                                    <Badge variant="outline" className="capitalize bg-muted/50 border-border font-normal text-muted-foreground">
                                                        {s.type}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="py-3">
                                                    <span className="text-xs text-muted-foreground italic">Belirtilmemiş</span>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground py-3 text-sm">{s.email || '-'}</TableCell>
                                                <TableCell className="text-muted-foreground py-3 text-sm font-mono">{s.phone || '-'}</TableCell>
                                                <TableCell className="py-3 text-right">
                                                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Link href={`/tedarikciler/${s.id}/duzenle`}>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                                                                <Pencil className="w-4 h-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(s.id)}>
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination Footer */}
                    <div className="p-3 border-t border-border/50 bg-muted/20 flex justify-between items-center text-xs text-muted-foreground">
                        <div>Toplam <span className="font-semibold text-foreground">{filteredSuppliers.length}</span> kayıt</div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="h-7 px-2 text-[10px]" disabled>Önceki</Button>
                            <Button variant="outline" size="sm" className="h-7 px-2 text-[10px]" disabled>Sonraki</Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
