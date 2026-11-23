# QR Label Studio – NIIMBOT B3S_P

Aplikacja WWW do ręcznego generowania etykiet, drukowania Bluetooth i pobierania PNG.

- QR koduje **dokładnie zawartość pola SN**, bez tekstu "SN:".
- Po prawej: SN, Manufactured, własne logo.
- Dane i logo są zapisywane tylko w przeglądarce (`localStorage`), nie w GitHubie.
- Web Bluetooth wymaga Chrome/Edge i HTTPS, drukarka musi być w zasięgu Bluetooth urządzenia z otwartą stroną.
- Fizyczny wydruk na B3S_P wymaga przetestowania na drukarce; sterownik/protokół może wymagać dostrojenia.

## GitHub Pages – konfiguracja

1. Załóż na GitHubie **puste repozytorium**, np. `qr-label-studio`, najlepiej publiczne.
2. Rozpakuj ZIP, a **zawartość katalogu `QR Studio-Label`** (wraz z ukrytym `.github`) dodaj do repo.
3. W terminalu w tym katalogu wykonaj:

   ```bash
   git init
   git add .
   git commit -m "QR Label Studio"
   git branch -M main
   git remote add origin https://github.com/TWOJ-LOGIN/qr-label-studio.git
   git push -u origin main
   ```

4. W GitHub wejdź w **Settings → Pages → Build and deployment → Source: GitHub Actions**.
5. W **Actions** sprawdź workflow `Publish QR Label Studio`.
6. Link będzie w formacie `https://TWOJ-LOGIN.github.io/qr-label-studio/`.

Po kolejnych `git push` strona przebuduje się automatycznie.

## Uruchamianie lokalne (opcjonalne)

```bash
npm install
npm run dev
```

Otwórz adres podany przez Vite.

## Ważne

Strona jest publiczna, jeśli repozytorium i witryna Pages są publiczne, ale **wpisywany SN, producent i logo pozostają w przeglądarce**, nie są zapisywane do repo. GitHub Pages nie zastępuje Bluetooth: komputer/telefon z otwartą witryną musi być w pobliżu drukarki.
