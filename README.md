# TaskFlow Press | Matbaa & Süreç Yönetim Portalı

Bu proje, **Girişimcilik ve Proje Yönetimi** dersi kapsamında geliştirilmiş; geleneksel ve modern basımevi (matbaa) estetiğine (**CMYK Press House**) dayalı, çoklu sayfalı bir **İş Planlama ve Süreç Takip Sistemidir**.

`https://tech-fix-service-portal.vercel.app/` portalının fonksiyonel yapısı ve ayrı sayfalar üzerinden veri ekleme, takip ve yönetim paneli akışları temel alınmış; ancak arayüz tasarımı o portaldan ve standart modern tasarımlardan **tamamen farklı ve özgün** bir basılı katalog/ofset bülten stiliyle şekillendirilmiştir.

---

## 🚀 Proje Klasör Yapısı

```bash
girisimcilik_proje/
│
├── index.html              # Ana Sayfa (Hizmetler ve Yönlendirmeler)
├── plan_ekle.html          # İş Emri Ekleme Sayfası (Kayıt ve damgalı onay)
├── durum_sorgula.html      # Baskı Durumu Sorgulama (CMYK dikey silindir stepper/timeline)
├── admin_paneli.html       # Yönetici Konsolu (Kalıp Aşamaları İş Defteri)
│
├── styles.css              # Geleneksel matbaa tasarım dili (Ivory kâğıt dokusu, serif yazı tipleri, CMYK şeritleri)
├── app.js                  # Süreç mantığı, sayfa yönlendirici ve LocalStorage depolama kodları
│
├── jira_import_data.csv    # Jira'ya doğrudan aktarılabilecek Agile Backlog verisi
├── jira_import_data.json   # Backlog verisinin JSON tabanlı alternatif formatı
│
└── README.md               # Proje kullanım rehberi (Bu dosya)
```

---

## 🎨 Matbaa Tasarım Dili ve Özellikleri

*   **Fildişi Kâğıt ve Kömür Mürekkep**: Arka planda aydınlık, pürüzsüz krem rengi kâğıt tonu (`#FAF6EE`), yazı rengi olarak ise karbon siyahı mürekkep kömürü (`#22201E`) tercih edilmiştir.
*   **Klasik Mizanpaj**: Başlıklarda basılı kitap ve gazete yazı karakteri olan şık **Playfair Display** (Serif), gövde yazılarında ise okunaklı **Inter** yazı tipi kullanılmıştır. Çerçevelerde basımevi el ilanlarında sıklıkla görülen çift çizgiler (`double border`) yer alır.
*   **CMYK Kalibrasyon Şeridi**: Sayfaların en üstünde, basım aşamasında renk doğruluğunu kontrol etmek için kullanılan geleneksel 4 renk (Mavi, Kırmızı, Sarı, Siyah) kontrol barları bulunmaktadır.
*   **CMYK Zaman Tüneli (Stepper)**: Sorgulama sayfasındaki dikey zaman tünelindeki yuvarlak adımlar ofset baskı silindirlerini temsil eder ve durumlarına göre parlar:
    *   **C (Cyan - Mavi)** ➔ Planlama Süreci (Kalıp hazırlanıyor)
    *   **M (Magenta - Kırmızı)** ➔ Düzenleme (Baskı Öncesi/Pre-press)
    *   **Y (Yellow - Sarı)** ➔ Planı Devreye Sokma (Baskı Aşaması)
    *   **K (Key/Black - Siyah)** ➔ Tamamlandı (Mücellithane/Ciltleme)
*   **Damgalı Onay Paneli**: Süreç başarıyla eklendiğinde, kâğıt üzerine kırmızı bir mürekkeple *"ONAYLANDI"* damgası basılmış gibi tasarlanmış bir tebrik paneli görüntülenir.

---

## 🏃‍♂️ Adım Adım Çalıştırma ve Test Senaryosu

### 1. Adım: Yeni İş Emri (Plan) Ekleyin
1.  [index.html](file:///c:/Users/Ozan/OneDrive/Masaüstü/girisimcilik_proje/index.html) sayfasını açın ve **Yeni Baskı Başlat** butonuna tıklayın (veya doğrudan [plan_ekle.html](file:///c:/Users/Ozan/OneDrive/Masaüstü/girisimcilik_proje/plan_ekle.html) sayfasına gidin).
2.  Plan/İş Emri Başlığı, Sorumlu Baskı Ustası ve İş Talimatlarını doldurup **İş Emrini Kaydet ve Kalıba Gönder** butonuna tıklayın.
3.  Sayfa üzerinde kırmızı *"ONAYLANDI"* damgasının çıktığını görün ve üretilen takip kodunu (Örn: `PLN-84729`) kopyalayın.

### 2. Adım: İlk Baskı Durumunu Sorgulayın
1.  Üst menüden **Baskı Durumu Sorgula** sayfasına gidin ([durum_sorgula.html](file:///c:/Users/Ozan/OneDrive/Masaüstü/girisimcilik_proje/durum_sorgula.html)).
2.  Kopyaladığınız kodu arama kutusuna yapıştırıp **Durumu Sorgula** butonuna basın.
3.  Detayların bir "Sevk İrsaliyesi" makbuzu şeklinde listelendiğini ve zaman tünelinde sadece 1. Adım olan **"C (Cyan Kalıp)"** adımının mavi renkte parladığını (Aktif), diğer adımların ise beklemede olduğunu doğrulayın.

### 3. Adım: Yönetici Konsolundan Kalıp Durumunu Değiştirin
1.  Üst menüden **Yönetici Konsolu**'na gidin ([admin_paneli.html](file:///c:/Users/Ozan/OneDrive/Masaüstü/girisimcilik_proje/admin_paneli.html)).
2.  Eklediğiniz iş emrini tabloda bulun ve Kalıp Durumu dropdown menüsünü değiştirerek **"3. Planı Devreye Sokma"** (Yellow Kalıp) yapın.
3.  Ekranın sağ altında *"durumu güncellendi"* şeklinde matbaa pres emri toast bildiriminin belirdiğini gözlemleyin.

### 4. Adım: Değişiklikleri Canlı Olarak İzleyin
1.  Tekrar **Baskı Durumu Sorgula** sayfasına dönün ve aynı kodu sorgulayın.
2.  Merdaneler üzerindeki **C** ve **M** silindirlerinin yeşile döndüğünü (**Tamamlandı**), 3. adım olan **Y (Yellow Kalıp - Baskıda)** adımının sarı renkte parlayarak **Aktif** olduğunu canlı olarak doğrulayın.
