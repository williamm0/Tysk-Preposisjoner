#!/bin/bash
# Tyske Preposisjoner — Start script (Mac / Linux / ChromeOS)

cd "$(dirname "$0")"

# Kill any existing server on port 8080
lsof -ti:8080 | xargs kill -9 2>/dev/null
fuser -k 8080/tcp 2>/dev/null

echo ""
echo "╔══════════════════════════════════════╗"
echo "║   Tyske Preposisjoner — Starter...   ║"
echo "╚══════════════════════════════════════╝"
echo ""
echo "→ Åpner http://localhost:8080"
echo "   Trykk Ctrl+C for å stoppe serveren."
echo ""

python3 -m http.server 8080 &
SERVER_PID=$!

sleep 0.8

# Open browser — supports Mac, Linux, and ChromeOS
if command -v xdg-open &>/dev/null; then
  xdg-open http://localhost:8080
elif command -v open &>/dev/null; then
  open http://localhost:8080
elif command -v chromium-browser &>/dev/null; then
  chromium-browser http://localhost:8080 &
elif command -v google-chrome &>/dev/null; then
  google-chrome http://localhost:8080 &
else
  echo "Åpne nettleseren manuelt: http://localhost:8080"
fi

trap "kill $SERVER_PID 2>/dev/null; echo ''; echo 'Server stoppet.'; exit 0" INT
wait $SERVER_PID
