QR LABEL STUDIO — LOKALNY PANEL ETYKIET / WINDOWS

1. Zainstaluj Node.js LTS z https://nodejs.org/ (raz).
2. Rozpakuj archiwum ZIP do folderu.
3. Kliknij dwukrotnie START.bat.
4. Pierwszy start pobiera biblioteki (wymaga internetu). Kolejne działają lokalnie.
5. Otwórz http://localhost:5173 w Chrome lub Microsoft Edge (jeżeli samo się nie otworzy).
6. Wpisz SN i Manufactured, wgraj własne logo, sprawdź podgląd.
7. Włącz NIIMBOT B3S_P, Bluetooth w Windows; rozłącz drukarkę z aplikacją telefonu.
8. Kliknij "Połącz Bluetooth", wybierz B3S_P z okienka przeglądarki.
9. Kliknij "Drukuj etykietę". W razie problemu zmień "Tryb wydruku" lub gęstość.

QR ZAWIERA DOKŁADNIE TEKST Z POLA SN. Nie dodajemy napisu "SN:" do kodu.

UWAGI:
- Etykieta powstaje w rozdzielczości ustawionej w panelu. Dostosuj wysokość do rolki.
- Szerokość B3S_P według publicznego katalogu urządzeń to 576 punktów.
- Połączenie i wydruk korzystają z otwartego protokołu biblioteki @mmote/niimbluelib.
- Nie testowano z konkretnym egzemplarzem B3S_P; Bluetooth i wydruk mogą wymagać dostrojenia.
- Logo i ostatnie dane zapamiętywane są w pamięci przeglądarki na tym komputerze.
- Brak arkuszy, serwera zewnętrznego, kont, synchronizacji i przesyłania danych do chmury.
- Zamknięcie okna konsoli zatrzymuje aplikację.

TERMINAL (zamiast START.bat):
  cd sciezka_do_folderu
  npm install
  npm run dev

Kod źródłowy biblioteki drukarki: https://github.com/MultiMote/niimbluelib
