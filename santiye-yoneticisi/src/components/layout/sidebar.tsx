'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    LayoutDashboard,
    Activity,
    FileText,
    Settings,
    Briefcase,
    Users,
    Building,
    Menu,
    ChevronLeft,
    ChevronRight,
    Hammer,
    Package,
    Calendar,
    Receipt,
    Building2,
    Truck
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion, AnimatePresence } from "framer-motion";

import { useRef } from "react";
import gsap from "gsap";

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);

    // Desktop/Mobile detection
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);

        // GSAP Entry Animation (Safe & Explicit)
        if (sidebarRef.current && !onNavigate) {
            gsap.fromTo(sidebarRef.current,
                { x: -100, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 1.5,
                    ease: "expo.out",
                    delay: 0.3,
                    clearProps: "all" // Bu, animasyon bittiğinde GSAP'in stile müdahalesini temizler
                }
            );
        }

        return () => window.removeEventListener('resize', checkMobile);
    }, []); // Bağımlılığı boşaltarak sadece mount anında çalışmasını garanti ediyoruz

    // Floating Glass Sidebar Design
    return (
        <motion.div
            ref={sidebarRef}
            initial={false}
            animate={{
                width: collapsed ? "5rem" : "18rem",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={cn(
                "group flex flex-col bg-background/60 backdrop-blur-xl shadow-2xl z-30 transition-all duration-300",
                // Desktop Styles
                !onNavigate && "hidden md:flex h-[calc(100vh-2rem)] m-4 rounded-[2rem] border border-white/20 dark:border-white/5 sticky top-4 overflow-visible",
                // Mobile Styles (Reset desktop specific styles)
                onNavigate && "flex h-full w-full border-none m-0 rounded-none bg-background/95"
            )}
        >
            {/* Brand Area */}
            <div className={cn(
                "relative flex items-center justify-between p-6 mb-2",
                collapsed ? "justify-center px-2" : "justify-start"
            )}>
                <Link href="/" onClick={onNavigate} className="flex items-center gap-3 overflow-hidden group/brand">
                    <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/20 text-white shrink-0 group-hover/brand:scale-110 transition-transform duration-300">
                        <Building2 className="w-5 h-5" />
                        <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/20" />
                    </div>

                    <AnimatePresence>
                        {!collapsed && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="flex flex-col min-w-[120px]"
                            >
                                <span className="font-heading font-black text-xl leading-none tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">LOFT 777</span>
                                <span className="text-[9px] font-bold text-muted-foreground tracking-[0.2em] uppercase mt-1">Saha Yönetimi</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Link>

                {/* Collapse Toggle */}
                {!isMobile && !collapsed && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setCollapsed(true)}
                        className="h-6 w-6 text-muted-foreground hover:bg-white/50 dark:hover:bg-white/10 rounded-full absolute -right-3 top-8 border border-white/20 shadow-sm bg-background/50 backdrop-blur-md hidden group-hover:flex transition-all hover:scale-110"
                    >
                        <ChevronLeft className="w-3 h-3" />
                    </Button>
                )}
            </div>

            {/* Toggle when collapsed (Centrally located) */}
            {collapsed && !isMobile && (
                <div className="flex justify-center mb-6">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setCollapsed(false)}
                        className="h-6 w-6 text-muted-foreground hover:bg-white/50 dark:hover:bg-white/10 rounded-full border border-white/20"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            )}

            {/* Navigation Items */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 space-y-6 scrollbar-thin scrollbar-thumb-rounded-md scrollbar-thumb-muted/20 hover:scrollbar-thumb-muted/50 transition-colors">

                <NavGroup label="YÖNETİM" collapsed={collapsed}>
                    <NavItem href="/" icon={<LayoutDashboard />} label="Kontrol Paneli" pathname={pathname} collapsed={collapsed} onClick={onNavigate} />
                    <NavItem href="/cari-yonetim" icon={<FileText />} label="Cari Hesaplar" pathname={pathname} collapsed={collapsed} onClick={onNavigate} />
                    <NavItem href="/ceks" icon={<Calendar />} label="Çek Takvimi" pathname={pathname} collapsed={collapsed} onClick={onNavigate} />
                    <NavItem href="/faturalar" icon={<Receipt />} label="Faturalar" pathname={pathname} collapsed={collapsed} onClick={onNavigate} />
                    <NavItem href="/siparisler" icon={<Package />} label="Siparişler" pathname={pathname} collapsed={collapsed} onClick={onNavigate} />
                </NavGroup>

                <NavGroup label="SAHA VE ÜRETİM" collapsed={collapsed}>
                    <NavItem href="/demir-baglanti" icon={<Activity />} label="Demir Bağlantı" pathname={pathname} collapsed={collapsed} onClick={onNavigate} activeColor="text-orange-500" />
                    <NavItem href="/beton" icon={<Building />} label="Beton Dökümü" pathname={pathname} collapsed={collapsed} onClick={onNavigate} activeColor="text-blue-500" />
                    <NavItem href="/makine-calismalari" icon={<Hammer />} label="Makine Parkı" pathname={pathname} collapsed={collapsed} onClick={onNavigate} />
                    <NavItem href="/irsaliye" icon={<Truck />} label="İrsaliye Girişi" pathname={pathname} collapsed={collapsed} onClick={onNavigate} />
                </NavGroup>

                <NavGroup label="KURUMSAL" collapsed={collapsed}>
                    <NavItem href="/personeller" icon={<Users />} label="Ekip ve İK" pathname={pathname} collapsed={collapsed} onClick={onNavigate} />
                    <NavItem href="/tedarikciler" icon={<Briefcase />} label="Tedarikçiler" pathname={pathname} collapsed={collapsed} onClick={onNavigate} />
                </NavGroup>

            </div>

            {/* Footer / Settings */}
            <div className="p-3 mt-auto border-t border-white/10 dark:border-white/5 mx-3 mb-2">
                <NavItem href="/ayarlar" icon={<Settings />} label="Sistem Ayarları" pathname={pathname} collapsed={collapsed} onClick={onNavigate} />
            </div>
        </motion.div>
    );
}

function NavGroup({ label, collapsed, children }: { label: string, collapsed: boolean, children: React.ReactNode }) {
    if (collapsed) return <div className="space-y-1">{children}</div>;

    return (
        <div className="space-y-1 animate-in fade-in slide-in-from-left-2 duration-500">
            <h4 className="px-4 text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.2em] mb-3 select-none">
                {label}
            </h4>
            {children}
        </div>
    );
}

function NavItem({
    href,
    icon,
    label,
    pathname,
    collapsed,
    onClick,
    activeColor
}: {
    href: string,
    icon: any,
    label: string,
    pathname: string,
    collapsed: boolean,
    onClick?: () => void,
    activeColor?: string
}) {
    const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));

    return (
        <Link
            href={href}
            onClick={onClick}
            className={cn(
                "relative flex items-center py-3 px-3.5 rounded-2xl transition-all duration-300 group overflow-hidden outline-none",
                isActive
                    ? "bg-white/80 dark:bg-white/5 shadow-md shadow-black/5 ring-1 ring-black/5 dark:ring-white/10 backdrop-blur-sm"
                    : "text-muted-foreground hover:bg-white/40 dark:hover:bg-white/5 hover:text-foreground"
            )}
        >
            {/* Active Indicator Glow */}
            {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-primary to-transparent opacity-50 rounded-r-full" />
            )}

            <span className={cn(
                "flex-shrink-0 transition-all duration-300 relative z-10",
                isActive
                    ? cn("scale-110 drop-shadow-sm", activeColor || "text-primary")
                    : "group-hover:scale-105 group-hover:text-foreground",
                collapsed ? "mx-auto" : "mr-3"
            )}>
                {icon && <icon.type {...icon.props} size={20} strokeWidth={isActive ? 2.5 : 2} />}
            </span>

            {!collapsed && (
                <span className={cn(
                    "truncate text-sm font-medium tracking-wide transition-colors duration-200",
                    isActive ? "text-foreground font-bold" : ""
                )}>
                    {label}
                </span>
            )}

            {/* Hover Tooltip for Collapsed State */}
            {collapsed && (
                <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-popover text-popover-foreground text-xs font-bold px-3 py-1.5 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-all duration-200 translate-x-2 group-hover:translate-x-0 border border-border/50 backdrop-blur-md">
                    {label}
                </div>
            )}
        </Link>
    )
}

export function MobileSidebar() {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="w-6 h-6" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 border-r-0 bg-transparent shadow-none w-[300px]">
                <Sidebar onNavigate={() => setOpen(false)} />
            </SheetContent>
        </Sheet>
    )
}
