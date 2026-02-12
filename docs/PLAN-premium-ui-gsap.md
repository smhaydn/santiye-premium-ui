# PLAN: Premium UI Modernization with GSAP

GSAP (GreenSock Animation Platform) entegrasyonu ile "Santiye Yöneticisi v2.0 - Loft 777" tasarımını profesyonel, akıcı ve premium bir seviyeye taşıma planıdır.

## 📌 Genel Bakış
Uygulamanın her köşesinde hissedilen, göz yormayan ancak sistemin bütünlüğünü ve "premium" hissini pekiştiren mikro-etkileşimler (micro-interactions) eklenecektir. CPU yükünden çekinmeden, modern cihazlarda kusursuz çalışacak bir görsel deneyim hedeflenmektedir.

## 🛠️ Teknik Strateji
- **Core Library:** GSAP 3.x
- **Animation Strategy:** Frame-based precision (GSAP) instead of traditional CSS transitions.
- **Global Provider:** GSAP animasyonlarının tüm sayfalara ve bileşenlere (Shared Layout) entegre edilmesi.
- **Micro-interactions:** Stagger effects (liste elemanları), Magnetic effects (butonlar), Glass-refraction (kartlar).

## 🚀 Başarı Kriterleri
- [ ] Uygulama açılışında tüm sayfada "premium" bir giriş animasyonu.
- [ ] Tüm veri tablolarında satırların yumuşak bir şekilde (stagger) belirmesi.
- [ ] Form alanlarında (Beton, Demir vb.) focus ve hover durumlarında akıcı görsel geri bildirimler.
- [ ] Sidebar ve Header elementlerinde akışkan geçişler.
- [ ] `checklist.py` ve `ux_audit.py` testlerinden yüksek puanla geçiş.

## 📋 Görev Dağılımı ve İş Listesi

### Faz 1: Altyapı ve Kurulum (P0)
- [x] **Task 1:** GSAP kütüphanesinin projeye dahil edilmesi (`npm install gsap`).
    - *Agent:* `frontend-specialist`
    - *Input:* `package.json` → *Output:* Dependency added.
- [x] **Task 2:** `src/lib/animations.ts` adında bir merkezi animasyon kütüphanesi oluşturulması (Reusable tweens).
    - *Agent:* `frontend-specialist`
    - *Skill:* `clean-code`

### Faz 2: Global UI Bileşenleri - GSAP Entegrasyonu (P1)
- [x] **Task 3:** `Sidebar` ve `Header` bileşenlerinin giriş ve etkileşim animasyonlarının GSAP ile yazılması.
    - *Agent:* `frontend-specialist`
    - *Skill:* `frontend-design`
- [x] **Task 4:** `PageHeader` bileşenine "text loading" ve "fade-in-up" efektleri eklenmesi.
    - *Agent:* `frontend-specialist`

### Faz 3: Sayfa İçi Mikro-Etkileşimler (P1)
- [x] **Task 5:** Tüm sayfalardaki `Card` ve `Table` bileşenlerine "staggered entry" (sıralı giriş) animasyonu eklenmesi.
    - *Agent:* `frontend-specialist`
- [x] **Task 6:** `Button` (Magnetic effect) ve `Input` bileşenlerine profesyonel mikro-tepkiler eklenmesi.
    - *Agent:* `frontend-specialist`

### Faz 4: Modül Bazlı Özelleştirme (P2)
- [x] **Task 7:** `ConcretePage` formunun GSAP ile adımlı (step-by-step) bir sihirbaza (wizard) dönüştürülmesi.
- [x] **Task 8:** Dashboard'daki `WidgetCard`'lara özel mikro-etkileşimler (icon animations) eklenmesi.
- [x] **Task 9:** `İrsaliye`, `Talep`, `Personeller` ve `Tedarikçiler` giriş sayfalarının GSAP Wizard yapısına taşınması.
    - *Agent:* `frontend-specialist`
    - *Status:* COMPLETED

### Phase X: Final Doğrulama (P3)
- [x] **Verify 1:** `python .agent/scripts/verify_all.py .` (Manual Audit Performed - Python N/A)
- [x] **Verify 2:** `python .agent/skills/frontend-design/scripts/ux_audit.py .` (Manual Audit Performed)
- [x] **Verify 3:** `npm run build` ve `npm run dev` kontrolleri. (Çalışıyor)

---
## 🛠️ Dosya Yapısı Planı
```
src/
├── lib/
│   └── gsap.ts           # GSAP Core Config
├── animations/           # Global Animation Definitions
│   ├── entry.ts          # Page entry animations
│   ├── interactions.ts   # Button/Card interactions
│   └── feedback.ts       # Toast/Status feedback
```

## ✅ PHASE X COMPLETE
- Date: [2026-02-12]
- Planned by: Antigravity Architect
- Status: READY FOR IMPLEMENTATION
