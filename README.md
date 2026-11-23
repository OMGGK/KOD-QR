# QR Label Studio — NIIMBOT B3S_P

GitHub Pages: `https://omggk.github.io/KOD-QR/`

Etykieta: duży, niezależny kod QR po lewej (koduje dokładnie SN), SN u góry po prawej, Manufactured u dołu po prawej, wydłużone czarne logo baterii w prawym dolnym rogu. Nie ma pomarańczowej ikony, napisu Li-PRO 95 ani ręcznego wgrywania logo.

## Aktualizacja

Rozpakuj ZIP i skopiuj **zawartość** do katalogu repozytorium `KOD-QR`, nadpisując pliki. W Git Bash, w tym katalogu:

```bash
git add -A
git commit -m "Powiekszony uklad i czarne logo baterii"
git push
```

W GitHub Actions sprawdź zielony status publikacji, a potem odśwież stronę `Ctrl+F5`.

## Technicznie

`npm install` i `npm run dev` uruchamiają stronę lokalnie, a `npm run build` ją buduje. Web Bluetooth wymaga Chrome / Edge, HTTPS i urządzenia z Bluetooth przy drukarce. Rzeczywisty wydruk na NIIMBOT B3S_P wymaga sprawdzenia na urządzeniu.
