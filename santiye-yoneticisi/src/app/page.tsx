'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Shield,
  PieChart,
  FileText,
  Calendar,
  Truck,
  Plus,
  History,
  TrendingUp,
  Hammer,
  CheckCircle2,
  DollarSign,
  Briefcase,
  Activity,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { PageHeader } from '@/components/layout/page-header';
import { cn } from '@/lib/utils';
import gsap from 'gsap';

export default function Home() {
  const [stats, setStats] = useState({
    activeProjects: 12,
    totalBudget: '45.2M',
    completionRate: 78,
    teamSize: 140
  });

  const [upcomingChecks, setUpcomingChecks] = useState<any[]>([]);

  useEffect(() => {
    async function fetchStats() {
      // Mock stats or actual fetch from supabase
      const { data: checks } = await supabase
        .from('upcoming_checks')
        .select('*')
        .order('check_due_date', { ascending: true })
        .limit(3);

      if (checks) setUpcomingChecks(checks);
    }
    fetchStats();
  }, []);

  return (
    <div className="flex flex-col gap-8 pb-20">
      <PageHeader
        title="LOFT 777"
        subtitle="İnşaat Yönetim Kontrol Merkezi"
      >
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-full gap-2 border-border/40 hover:bg-muted/5">
            <History className="w-4 h-4" /> Loglar
          </Button>
          <Button className="rounded-full bg-slate-900 text-white shadow-xl shadow-slate-900/20 gap-2">
            <Plus className="w-4 h-4" /> Yeni Rapor
          </Button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Stats Area */}
        <div className="xl:col-span-2 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="AKTİF PROJE" value={stats.activeProjects} icon={<Briefcase />} color="blue" />
            <StatCard label="TOPLAM BÜTÇE" value={stats.totalBudget} icon={<DollarSign />} color="green" />
            <StatCard label="TAMAMLANMA" value={`%${stats.completionRate}`} icon={<Activity />} color="orange" />
            <StatCard label="PERSONEL" value={stats.teamSize} icon={<Truck />} color="purple" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card delay={0.2} className="rounded-[2rem] p-6 border-none bg-white shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-black text-slate-900 text-lg">Önemli Ödemeler</h3>
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1">Yaklaşan Çekler</p>
                </div>
                <AlertCircle className="w-5 h-5 text-orange-500" />
              </div>
              <div className="space-y-3">
                {upcomingChecks.length === 0 ? (
                  <div className="flex items-center gap-4 p-3 rounded-2xl bg-orange-500/5 border border-orange-500/10">
                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center font-black">15</div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-slate-800">Canbek Beton A.Ş.</div>
                      <div className="text-xs text-muted-foreground">342.000,00 ₺</div>
                    </div>
                    <div className="text-[9px] font-black text-orange-500 bg-orange-500/10 px-2 py-1 rounded-full uppercase tracking-tighter">Kritik</div>
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
                      <div className="text-[9px] font-black text-orange-500 bg-orange-500/10 px-2 py-1 rounded-full uppercase tracking-tighter">Kritik</div>
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
                  <Plus className="w-5 h-5" />
                </Button>
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-blue-500/5 -skew-x-12 translate-x-12" />
              </Card>
            </Link>
          </div>
        </div>

        {/* Premium Strategic Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:col-span-3 lg:col-span-12">
          {/* Ortaklık Paneli - Ortaklık Dengesi */}
          <Card delay={0.4} interactive className="lg:col-span-8 rounded-[2.5rem] p-8 bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none shadow-2xl relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
                    <Shield className="w-7 h-7 text-blue-400" /> ORTAKLIK PANELİ
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">Güncel Ortaklık Katkı Payı / %60 - %40</p>
                </div>
                <div className="bg-white/10 px-4 py-2 rounded-2xl backdrop-blur-md">
                  <span className="text-[10px] font-black text-blue-400">DURUM: %98 DENGELİ</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Orta A (%60) */}
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-black uppercase tracking-tighter opacity-60 text-slate-400">A ORTAĞI (%60)</span>
                    <span className="text-xl font-black font-mono tracking-tighter">5.800.000 ₺</span>
                  </div>
                  <div className="h-4 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '58%' }}
                      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full bg-blue-500 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-blue-400/80">
                    <span>KATILIM ORANI: %58</span>
                    <span>KALAN: -%2</span>
                  </div>
                </div>

                {/* Orta B (%40) */}
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-black uppercase tracking-tighter opacity-60 text-slate-400">B ORTAĞI (%40)</span>
                    <span className="text-xl font-black font-mono tracking-tighter">4.200.000 ₺</span>
                  </div>
                  <div className="h-4 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '42%' }}
                      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                      className="h-full bg-orange-500 rounded-full shadow-[0_0_20px_rgba(249,115,22,0.3)]"
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-orange-400/80">
                    <span>KATILIM ORANI: %42</span>
                    <span>FAZLA: +%2</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-[11px] font-bold text-slate-300">
                  <Activity className="w-4 h-4 text-green-400" />
                  <span>DENGE İÇİN: <b className="text-white">A ORTAĞI 200.000 ₺</b> ÖDEME YAPMALIDIR.</span>
                </div>
                <Link href="/ortaklik">
                  <Button magnetic variant="outline" className="text-[10px] font-black text-blue-400 border-blue-400/20 rounded-xl hover:bg-blue-400/10 px-6">DETAYLI ANALİZ</Button>
                </Link>
              </div>
            </div>

            {/* Background Decoration */}
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px]" />
          </Card>

          {/* Nakit Akış AI Prediction */}
          <Card delay={0.5} interactive className="lg:col-span-4 rounded-[2.5rem] p-8 border-none bg-white shadow-xl flex flex-col group overflow-hidden relative">
            <div className="mb-6 relative z-10">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" /> NAKİT AKIŞ AI
              </h3>
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] mt-1.5">15 GÜNLÜK ÖNGÖRÜ</p>
            </div>

            <div className="flex-1 flex flex-col justify-center space-y-6 relative z-10">
              <div className="p-6 rounded-[2rem] bg-indigo-50/50 border border-indigo-100/50 relative group/box overflow-hidden">
                <div className="relative z-10">
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none mb-2">ÖNGÖRÜLEN ÇIKIŞ</p>
                  <p className="text-3xl font-black text-indigo-900 tracking-tighter">1.450.000 ₺</p>
                </div>
                <div className="absolute right-[-10px] bottom-[-10px] w-20 h-20 text-indigo-400/10 transition-transform duration-700 group-hover/box:scale-125">
                  <DollarSign className="w-full h-full" />
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-orange-50 text-orange-700 rounded-2xl border border-orange-100 shadow-sm">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-[11px] font-bold leading-tight uppercase">Önümüzdeki Perşembe günü <b>200.000 ₺</b> nakit açığı bekleniyor.</p>
              </div>
            </div>

            <Button magnetic className="w-full mt-6 rounded-2xl h-14 font-black bg-slate-900 shadow-xl shadow-slate-900/20 text-white relative z-10 transition-all hover:scale-[1.02]">
              TAKVİMİ ANALİZ ET
            </Button>
          </Card>
        </div>

        {/* Widgets Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 xl:col-span-3 lg:col-span-12">
          <WidgetCard delay={0.6} icon={<FileText />} color="purple" label="Kurumsal" title="Cari Yönetim" href="/cari-yonetim" trend="+12%" />
          <WidgetCard delay={0.7} icon={<Truck />} color="green" label="Şantiye" title="Personeller" href="/personeller" badge="Aktif" />
          <WidgetCard delay={0.8} icon={<TrendingUp />} color="cyan" label="Lojistik" title="İrsaliyeler" href="/irsaliye" />
          <WidgetCard delay={0.9} icon={<CheckCircle2 />} color="neutral" label="Sistem" title="Ayarlar" href="/ayarlar" />
        </div>

        {/* Bottom Section */}
        <Card delay={0.8} className="rounded-[2.5rem] p-8 relative overflow-hidden xl:col-span-3 lg:col-span-12">
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

function StatCard({ label, value, icon, color }: any) {
  const colorMap: any = {
    blue: "text-blue-600 bg-blue-50",
    green: "text-green-600 bg-green-50",
    orange: "text-orange-600 bg-orange-50",
    purple: "text-purple-600 bg-purple-50"
  };

  return (
    <Card interactive className="p-5 rounded-3xl border-none shadow-lg bg-white group overflow-hidden relative">
      <div className="relative z-10">
        <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", colorMap[color])}>
          {icon}
        </div>
        <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{label}</div>
        <div className="text-2xl font-black text-slate-900 tracking-tighter mt-1">{value}</div>
      </div>
      <div className={cn("absolute -right-4 -bottom-4 w-20 h-20 opacity-10 transition-transform group-hover:scale-125", colorMap[color].split(' ')[0])}>
        {icon}
      </div>
    </Card>
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
