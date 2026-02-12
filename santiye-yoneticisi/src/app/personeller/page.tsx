'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Users,
    UserCheck,
    UserX,
    Building2,
    LayoutGrid,
    Filter,
    RefreshCcw,
    Download,
    Trash2,
    Plus,
    Search,
    MoreHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { PageHeader } from "@/components/layout/page-header";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

export default function PersonnelPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all'); // all, active, passive, company, project
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    async function fetchUsers() {
        setLoading(true);
        const { data } = await supabase.from('personnel').select('*').order('created_at', { ascending: false });
        if (data) setUsers(data);
        setLoading(false);
    }

    // Filter Logic
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.role?.toLowerCase().includes(searchTerm.toLowerCase());

        if (!matchesSearch) return false;

        if (activeTab === 'active') return user.is_active;
        if (activeTab === 'passive') return !user.is_active;
        if (activeTab === 'company') return user.role && (user.role.toLowerCase().includes('yönetici') || user.role.toLowerCase().includes('admin'));
        if (activeTab === 'project') return user.role && !user.role.toLowerCase().includes('yönetici');
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

            <PageHeader title="Şirket Kullanıcıları" subtitle="PERSONEL YÖNETİMİ VE YETKİLENDİRME" backLink="/">
                <div className="flex items-center gap-3">
                    <Link href="/personeller/yeni">
                        <Button className="rounded-full shadow-lg gap-2">
                            <Plus className="w-4 h-4" /> Yeni Kullanıcı
                        </Button>
                    </Link>
                </div>
            </PageHeader>

            {/* Main Content Area */}
            <div className="flex flex-1 overflow-hidden p-6 gap-6 pt-2">

                {/* Left Sub-Sidebar (Cards/Tabs) */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-64 space-y-4 hidden md:block shrink-0"
                >

                    {/* Navigation Menu */}
                    <div className="glass-card rounded-xl overflow-hidden">
                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-4 py-3 bg-muted/30 border-b border-border/50">
                            Kullanıcılar
                        </div>
                        <div className="p-2 space-y-1">
                            {[
                                { id: 'all', label: 'Tüm Kullanıcılar', icon: Users },
                                { id: 'active', label: 'Aktif Kullanıcılar', icon: UserCheck },
                                { id: 'passive', label: 'Pasif Kullanıcılar', icon: UserX },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                                        activeTab === tab.id
                                            ? "bg-primary/10 text-primary shadow-sm"
                                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                    )}
                                >
                                    <tab.icon className="w-4 h-4" /> {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-4 py-3 bg-muted/30 border-b border-border/50 border-t mt-2">
                            Gruplar
                        </div>
                        <div className="p-2 space-y-1">
                            {[
                                { id: 'company', label: 'Şirket', icon: Building2 },
                                { id: 'project', label: 'Saha Ekibi', icon: LayoutGrid },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                                        activeTab === tab.id
                                            ? "bg-primary/10 text-primary shadow-sm"
                                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                    )}
                                >
                                    <tab.icon className="w-4 h-4" /> {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Right Content (Toolbar & Table) */}
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
                                placeholder="İsim, e-posta veya rol ara..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 h-9 bg-background/50 border-border/50 focus:bg-background transition-colors"
                            />
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-auto">
                            <Button size="icon" variant="outline" className="h-9 w-9" onClick={fetchUsers}>
                                <RefreshCcw className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" className="h-9 text-xs font-medium gap-2">
                                <Filter className="w-3 h-3" /> Filtrele
                            </Button>
                            <Button variant="outline" className="h-9 text-xs font-medium gap-2 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20">
                                <Download className="w-3 h-3" /> Excel
                            </Button>
                        </div>
                    </div>

                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-muted/40 border-b border-border/50 text-[10px] font-bold text-muted-foreground uppercase tracking-wider items-center select-none">
                        <div className="col-span-4 pl-2">Kullanıcı Bilgileri</div>
                        <div className="col-span-3">İletişim</div>
                        <div className="col-span-2">Rol / Görev</div>
                        <div className="col-span-2">Firma</div>
                        <div className="col-span-1 text-right">Durum</div>
                    </div>

                    {/* Table Body */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                                <span className="text-sm font-medium animate-pulse">Kullanıcılar yükleniyor...</span>
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground/50">
                                <Users className="w-16 h-16 mb-4 opacity-20" />
                                <span className="text-sm font-medium">Kayıt bulunamadı.</span>
                            </div>
                        ) : (
                            <motion.div variants={container} initial="hidden" animate="show">
                                {filteredUsers.map((user, idx) => (
                                    <motion.div
                                        variants={item}
                                        key={user.id}
                                        className={cn(
                                            "grid grid-cols-12 gap-4 px-6 py-4 border-b border-border/40 items-center hover:bg-muted/30 transition-colors group text-sm relative",
                                            idx % 2 === 0 ? "bg-background/20" : "bg-transparent"
                                        )}
                                    >
                                        <div className="col-span-4 flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0 shadow-inner">
                                                {(user.name || '?').split(' ').map((n: any) => n[0]).join('').substring(0, 2).toUpperCase()}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="font-semibold text-foreground truncate">{user.name}</span>
                                                <span className="text-xs text-muted-foreground truncate opacity-70">Son Giriş: 2 gün önce</span>
                                            </div>
                                        </div>

                                        <div className="col-span-3 text-muted-foreground text-xs flex flex-col gap-0.5">
                                            <span className="truncate hover:text-foreground transition-colors cursor-pointer">{user.email}</span>
                                            <span className="opacity-70">{user.phone || '-'}</span>
                                        </div>

                                        <div className="col-span-2">
                                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-secondary/50 text-secondary-foreground text-xs font-medium border border-secondary">
                                                {user.role || '-'}
                                            </span>
                                        </div>

                                        <div className="col-span-2 text-xs font-medium text-muted-foreground flex items-center gap-1">
                                            <Building2 className="w-3 h-3 opacity-50" />
                                            {user.company || 'Demo A.Ş.'}
                                        </div>

                                        <div className="col-span-1 flex justify-end items-center gap-3">
                                            <div className={cn("w-2.5 h-2.5 rounded-full shadow-sm", user.is_active ? "bg-green-500 shadow-green-500/50" : "bg-red-400")} title={user.is_active ? "Aktif" : "Pasif"}></div>

                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 flex gap-1 bg-background/80 backdrop-blur-sm p-1 rounded-lg border shadow-sm">
                                                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </div>

                    {/* Pagination */}
                    <div className="border-t border-border/50 p-3 flex items-center justify-between text-xs text-muted-foreground bg-muted/20">
                        <div>
                            Toplam <span className="font-semibold text-foreground">{filteredUsers.length}</span> kayıt
                        </div>
                        <div className="flex gap-1">
                            <Button variant="outline" size="sm" className="h-7 px-2 text-[10px]" disabled>Önceki</Button>
                            <Button variant="outline" size="sm" className="h-7 px-2 text-[10px]" disabled>Sonraki</Button>
                        </div>
                    </div>

                </motion.div>
            </div>
        </div>
    );
}
