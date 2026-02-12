'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { supabase } from "@/lib/supabase";
import {
  AlertCircle, ArrowRight, Activity, Hammer, Truck, FileText,
  TrendingUp, DollarSign, Calendar, CheckCircle2, ChevronRight,
  MoreHorizontal, Wallet, PieChart
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const [stats, setStats] = useState({
    waybillCount: 0,
    requestCount: 0,
    totalConcrete: 0,
    pendingPayments: 0
  });

  const [upcomingChecks, setUpcomingChecks] = useState<any[]>([]);
  const [loadingChecks, setLoadingChecks] = useState(true);

  useEffect(() => {
    fetchUpcomingChecks();
  }, []);

  const fetchUpcomingChecks = async () => {
    try {
      const today = new Date();
      const nextMonth = new Date();
      nextMonth.setDate(today.getDate() + 30);

      const { data, error } = await supabase
        .from('concrete_invoices')
        .select('id, invoice_number, grand_total, check_due_date')
        .gte('check_due_date', today.toISOString())
        .lte('check_due_date', nextMonth.toISOString())
        .order('check_due_date', { ascending: true })
        .limit(5);

      if (!error) {
        setUpcomingChecks(data || []);
      }
    } catch (error) {
      console.error('Error fetching checks:', error);
    } finally {
      setLoadingChecks(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background/50 font-sans overflow-y-auto custom-scrollbar">
      <PageHeader
        title="Merkezi Kontrol Paneli"
        subtitle="LOFT 777 YÖNETİM SİSTEMİ"
      >
        <div className="flex items-center gap-2">
          <div className="text-xs font-mono text-muted-foreground bg-secondary/50 px-2 py-1 rounded-full border border-border/50">
            v2.4.0-premium
          </div>
        </div>
      </PageHeader>

      <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8">

        {/* Hero / Welcome Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* Main Action Card (Demir Bağlantı) */}
          <div className="md:col-span-8 lg:col-span-8">
            <Link href="/demir-baglanti" className="block h-full">
              <Card delay={0.1} interactive className="relative h-full min-h-[220px] rounded-[2rem] overflow-hidden p-0 border-none group">
                {/* Background Gradient & Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#0f0f0f] to-background z-0" />
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />
                <div className="absolute -right-20 -top-20 w-96 h-96 bg-primary/20 rounded-full blur-[100px] group-hover:bg-primary/30 transition-colors duration-500" />

                {/* Content */}
                <div className="relative z-10 p-8 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/20">
                        Ana Modül
                      </span>
                      <span className="text-muted-foreground text-xs flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md">
                        <Activity className="w-3.5 h-3.5 text-primary" /> Canlı Veri
                      </span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-heading font-black text-white mb-3 tracking-tight">
                      Demir & <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">Bağlantı</span>
                    </h2>
                    <p className="text-neutral-400 max-w-md text-sm leading-relaxed font-medium">
                      Aktif sözleşmeleri yönetin, sevkiyatları takip edin ve hakediş raporlarını saniyeler içinde oluşturun.
                    </p>
                  </div>

                  <div className="flex items-center gap-4 mt-8">
                    <Button magnetic variant="default" className="rounded-full px-6 h-12 font-bold shadow-xl shadow-primary/20">
                      Modülü Aç <ArrowRight className="w-4 h-4" />
                    </Button>
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-9 h-9 rounded-full bg-neutral-800 border-2 border-neutral-900 flex items-center justify-center text-[10px] text-neutral-500">
                          <Wallet className="w-4 h-4" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Decorative 3D Element Placeholder */}
                <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 bg-gradient-to-l from-primary/30 to-transparent skew-x-12 hidden md:block" />
              </Card>
            </Link>
          </div>

          {/* Side Stats / Upcoming */}
          <div className="md:col-span-4 lg:col-span-4 flex flex-col gap-4">
            <Card delay={0.2} interactive className="flex-1 rounded-[2rem] p-6 border-l-4 border-l-orange-500 group/pay">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-black text-foreground flex items-center gap-2 text-lg">
                    <Calendar className="w-5 h-5 text-orange-500" /> Ödemeler
                  </h3>
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] mt-1.5">Yaklaşan Çekler</p>
                </div>
                <Link href="/ceks">
                  <Button magnetic variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-orange-500/10 hover:text-orange-500">
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>

              <div className="space-y-4">
                {loadingChecks ? (
                  <div className="flex items-center gap-3 animate-pulse">
                    <div className="w-12 h-12 rounded-2xl bg-muted" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-24 bg-muted rounded" />
                      <div className="h-3 w-16 bg-muted rounded" />
                    </div>
                  </div>
                ) : upcomingChecks.length > 0 ? (
                  upcomingChecks.slice(0, 2).map((check, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/40 dark:hover:bg-white/5 transition-all border border-transparent hover:border-border/50 group/item">
                      <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 font-black text-sm ring-1 ring-orange-500/20 group-hover/item:scale-110 transition-transform">
                        <span>{new Date(check.check_due_date).getDate()}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold truncate text-foreground/80">{check.invoice_number}</div>
                        <div className="text-xs text-muted-foreground font-mono">{Number(check.grand_total).toLocaleString('tr-TR')} ₺</div>
                      </div>
                      <div className="text-[9px] font-black text-orange-500 bg-orange-500/10 px-2 py-1 rounded-full uppercase tracking-tighter">
                        Kritik
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-xs text-muted-foreground py-6 bg-muted/20 rounded-2xl border-2 border-dashed border-border/40">Yaklaşan ödeme bulunamadı.</div>
                )}
              </div>
            </Card>

            <Link href="/beton" className="flex-1">
              <Card delay={0.3} interactive className="h-full rounded-[2rem] p-6 flex items-center justify-between border-l-4 border-l-blue-500 group/beton overflow-hidden relative">
                <div className="flex items-center gap-5 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center group-hover/beton:scale-110 group-hover/beton:rotate-6 transition-all duration-500">
                    <Hammer className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-black text-foreground text-lg">Beton Dökümü</h3>
                    <p className="text-xs text-muted-foreground font-medium mt-0.5">Günlük Kalite & Takip</p>
                  </div>
                </div>
                <Button magnetic variant="outline" size="icon" className="h-10 w-10 rounded-full border-blue-500/20 text-blue-500 hover:bg-blue-500 hover:text-white relative z-10">
                  <PlusIcon className="w-5 h-5" />
                </Button>
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-blue-500/5 -skew-x-12 translate-x-12" />
              </Card>
            </Link>
          </div>
        </div>

        {/* Widgets Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <WidgetCard delay={0.4} icon={<FileText />} color="purple" label="Cari Yönetim" title="Hesaplar" href="/cari-yonetim" trend="+12%" />
          <WidgetCard delay={0.5} icon={<Truck />} color="green" label="Şantiye" title="Personel" href="/personeller" badge="Aktif" />
          <WidgetCard delay={0.6} icon={<TrendingUp />} color="cyan" label="Lojistik" title="İrsaliyeler" href="/irsaliye" />
          <WidgetCard delay={0.7} icon={<CheckCircle2 />} color="neutral" label="Sistem" title="Ayarlar" href="/ayarlar" />
        </div>

        {/* Bottom Section */}
        <Card delay={0.8} className="rounded-[2.5rem] p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-[0.03] rotate-12">
            <PieChart className="w-64 h-64" />
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center border-b border-border/50 pb-6 mb-8 gap-4 px-2">
            <div>
              <h3 className="text-2xl font-black font-heading tracking-tight">Proje Özeti</h3>
              <p className="text-sm text-muted-foreground font-medium">Genel durum ve ilerleme raporu</p>
            </div>
            <div className="flex gap-4">
              <Button magnetic variant="outline" className="rounded-full px-6">Rapor İndir</Button>
              <Button magnetic className="rounded-full px-6 shadow-lg shadow-primary/20">Tüm Veriler</Button>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center text-muted-foreground/30 text-sm font-black uppercase tracking-widest border-2 border-dashed border-border/40 rounded-3xl bg-muted/10">
            İstatistik Grafikleri Yükleniyor...
          </div>
        </Card>
      </div>
    </div>
  );
}

function WidgetCard({ delay, icon, color, label, title, href, trend, badge }: any) {
  const iconRef = useRef<HTMLDivElement>(null);
  const colorMap: any = {
    purple: "border-t-purple-500 text-purple-600 bg-purple-500/10",
    green: "border-t-green-500 text-green-600 bg-green-500/10",
    cyan: "border-t-cyan-500 text-cyan-600 bg-cyan-500/10",
    neutral: "border-t-neutral-500 text-neutral-600 bg-neutral-500/10"
  };

  const onMouseEnter = () => {
    if (iconRef.current) {
      gsap.to(iconRef.current, {
        y: -10,
        rotate: 15,
        scale: 1.2,
        duration: 0.4,
        ease: "back.out(2)"
      });
    }
  };

  const onMouseLeave = () => {
    if (iconRef.current) {
      gsap.to(iconRef.current, {
        y: 0,
        rotate: 0,
        scale: 1,
        duration: 0.6,
        ease: "expo.out"
      });
    }
  };

  return (
    <Link href={href} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <Card delay={delay} interactive className={cn("rounded-3xl p-6 border-t-[6px] group transition-all h-full", colorMap[color])}>
        <div className="flex justify-between items-start mb-4">
          <div ref={iconRef} className={cn("p-3 rounded-2xl transition-shadow group-hover:shadow-lg", colorMap[color])}>
            {icon}
          </div>
          {trend && <BadgeTrend value={trend} />}
          {badge && <div className="text-[10px] font-black bg-green-500/20 text-green-600 px-2.5 py-1 rounded-full uppercase tracking-tighter">{badge}</div>}
        </div>
        <div className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em] mb-2">{label}</div>
        <div className="text-2xl font-black text-foreground group-hover:text-primary transition-colors tracking-tighter line-clamp-1">{title}</div>
      </Card>
    </Link>
  );
}


function BadgeTrend({ value }: { value: string }) {
  const isPositive = value.startsWith('+');
  return (
    <div className={cn(
      "text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5",
      isPositive ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
    )}>
      {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingUp className="w-3 h-3 rotate-180" />}
      {value}
    </div>
  )
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}

