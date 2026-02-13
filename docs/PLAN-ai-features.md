# PLAN: AI Asistan & Çakışma Dedektörü Entegrasyonu

Bu plan, projeye akıllı bir yardımcı chatbot ve fatura tarama sırasında mükerrer kayıtları önleyecek bir dedektör eklemeyi amaçlar.

## 1. AI Chatbot (Akıllı Asistan)
Sertan'ın verileriyle konuşabilmesini sağlayacak yüzen asistan.

### Teknik Detaylar
- **Bileşen:** `AssistantChat.tsx` (Yüzen Kabarcık + Chat Penceresi)
- **Animasyon:** GSAP & Framer Motion (Cam efekti, magnetic bubble)
- **Zeka:** Google Gemini 1.5 Flash
- **Veri Kaynağı:** Supabase (Cari toplamlar, son ödemeler, bütçe durumu)

### Yol Haritası
- [ ] `src/components/shared/assistant-chat.tsx` dosyasını oluştur.
- [ ] Gemini API entegrasyonu için istemci taraflı servis yaz.
- [ ] Layout seviyesine ekle (tüm sayfalarda görünsün).
- [ ] Sesli komut (opsiyonel) veya hızlı soru önerileri ekle.

## 2. Çakışma Dedektörü (Duplicate Scanner)
Yanlışlıkla aynı faturanın iki kez girilmesini engelleme.

### Teknik Detaylar
- **Bileşen:** `ai-tarama/page.tsx` güncellemesi.
- **Mantık:** AI veriyi okuduktan sonra `invoice_number` + `supplier` kombinasyonunu DB'de arat.
- **UI:** Eğer çakışma varsa "Kritik Uyarı" penceresi göster.

### Yol Haritası
- [ ] `ai-tarama` sayfasında `checkDuplicates` fonksiyonunu yaz.
- [ ] Çakışma durumunda "Sisteme Kaydet" butonunu sarı/kırmızı uyarı moduna al.
- [ ] Mevcut kaydın linkini göster (Sertan gidip bakabilsin).

## 3. Doğrulama
- [ ] Manuel test (Aynı fatura nosuyla iki kez tarama).
- [ ] Chatbot'un bütçe verilerini doğru okuduğunu doğrula.
