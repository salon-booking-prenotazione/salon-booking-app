@tailwind base;
@tailwind components;
@tailwind utilities;

/* === MotoPress-ish, ma più premium === */
:root{
  --bg: #c7cec7;                 /* sage background */
  --bg2:#bfc7c0;
  --cream:#f6f2ec;               /* card paper */
  --cream2:#f2ede6;

  --plum:#5b2a3f;                /* titles */
  --ink: rgba(28,28,30,0.82);
  --muted: rgba(28,28,30,0.55);

  --sage:#7f8f86;                /* CTA */
  --sage2:#6f8077;

  --rose:#cfa0b2;                /* frame */
  --rose2:#ddb7c5;

  --line: rgba(28,28,30,0.16);
  --line2: rgba(255,255,255,0.45);
}

html, body { height: 100%; }
body{
  background: var(--bg);
  color: var(--ink);
  font-family: ui-sans-serif, system-ui;
}

/* background con “forme” + leggero pattern (solo CSS) */
.lux-bg{
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(900px 700px at 18% 18%, rgba(127,143,134,0.40), transparent 62%),
    radial-gradient(780px 560px at 78% 22%, rgba(207,160,178,0.30), transparent 60%),
    radial-gradient(1000px 780px at 60% 90%, rgba(127,143,134,0.22), transparent 62%),
    linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.03));
}

/* overlay leggero (su tutto schermo) */
.lux-bg::before {
  content: "";
  position: fixed;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.08),
    rgba(255, 255, 255, 0.12)
  );
  pointer-events: none;
  z-index: 0;
}

/* tutto il contenuto sopra l'overlay */
.lux-content{
  position: relative;
  z-index: 1;
}

/* tipografia */
.lux-title{
  font-family: ui-serif, Georgia;
  color: var(--plum);
  font-weight: 500;
  letter-spacing: -0.02em;
}
.lux-subtitle{ color: var(--muted); }

/* badge top */
.lux-badge{
  display:inline-flex;
  align-items:center;
  gap:10px;
  padding:10px 14px;
  border-radius:999px;
  background: rgba(255,255,255,0.55);
  border: 1px solid rgba(28,28,30,0.14);
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
  color: rgba(28,28,30,0.60);
  font-size: 13px;
}

/* CARD premium: bordo interno + carta + ombra morbida */
.lux-card{
  border-radius: 18px;
  background:
    radial-gradient(120% 120% at 20% 0%, rgba(255,255,255,0.70), transparent 55%),
    linear-gradient(180deg, var(--cream), var(--cream2));
  border: 1px solid rgba(28,28,30,0.14);
  box-shadow:
    0 24px 70px rgba(0,0,0,0.14),
    0 0 0 1px rgba(255,255,255,0.55) inset;
}

/* cornice esterna “rosa” */
.lux-frame{
  border: 8px solid rgba(207,160,178,0.60);
  border-radius: 22px;
  box-shadow: 0 18px 55px rgba(0,0,0,0.12);
}

/* bottoni */
.lux-btn{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  border-radius: 14px;
  padding: 11px 18px;
  border: 1px solid rgba(28,28,30,0.16);
  background: rgba(255,255,255,0.65);
  color: rgba(28,28,30,0.78);
  font-weight: 700;
  box-shadow: 0 10px 22px rgba(0,0,0,0.10);
}
.lux-btn:hover{ filter: brightness(1.02); }

.lux-btn-primary{
  background: linear-gradient(180deg, rgba(127,143,134,0.98), rgba(111,128,119,0.98));
  color: rgba(255,255,255,0.95);
  border-color: rgba(0,0,0,0.10);
  box-shadow:
    0 16px 30px rgba(127,143,134,0.22),
    0 10px 20px rgba(0,0,0,0.12);
}
.lux-btn-primary:hover{ transform: translateY(-1px); }

.lux-btn-ghost{
  background: transparent;
  box-shadow: none;
}

/* input */
.lux-input{
  width:100%;
  border-radius: 14px;
  padding: 12px 14px;
  border: 1px solid rgba(28,28,30,0.16);
  background: rgba(255,255,255,0.72);
  color: rgba(28,28,30,0.82);
  outline: none;
  box-shadow: 0 0 0 1px rgba(255,255,255,0.55) inset;
}
.lux-input:focus{
  border-color: rgba(207,160,178,0.85);
  box-shadow: 0 0 0 4px rgba(207,160,178,0.18);
}

/* slots orari */
.lux-slot{
  border-radius: 12px;
  border: 1px solid rgba(28,28,30,0.18);
  background: rgba(255,255,255,0.70);
  padding: 10px 12px;
  text-align: center;
  font-size: 13px;
  color: rgba(28,28,30,0.72);
  box-shadow: 0 8px 18px rgba(0,0,0,0.08);
}
.lux-slot.selected{
  background: linear-gradient(180deg, rgba(91,42,63,0.98), rgba(70,25,45,0.98));
  color: rgba(255,255,255,0.95);
  border-color: rgba(91,42,63,0.55);
}

/* scrittura elegante */
.lux-calligraphy {
  font-family: ui-serif, Georgia;
  font-style: italic;
  font-weight: 400;
  letter-spacing: 0.02em;
  opacity: 0.92;
  color: var(--plum);
  text-shadow: 0 8px 24px rgba(0, 0, 0, 0.10);
}

/* nasconde scrollbar orari */
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

/* ===========================
   CALENDARIO - VERSIONE BELLA
   =========================== */

.lux-cal{
  margin-top: 18px;
  border-radius: 18px;
  border: 1px solid rgba(28,28,30,0.12);
  overflow: hidden;
  background: linear-gradient(180deg, rgba(255,255,255,0.70), rgba(255,255,255,0.45));
  box-shadow: 0 18px 45px rgba(0,0,0,0.10);
}

.lux-cal-head{
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border-bottom: 1px solid rgba(28,28,30,0.12);
  background: linear-gradient(180deg, rgba(255,255,255,0.78), rgba(255,255,255,0.55));
}

.lux-cal-month{
  flex: 1 1 auto;
  text-align: center;
  font-size: 13px;
  font-weight: 900;
  color: rgba(28,28,30,0.60);
  letter-spacing: 0.03em;
  text-transform: capitalize;
}

.lux-cal-grid{
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
}

.lux-cal-dow{
  padding: 10px 0;
  text-align: center;
  font-size: 12px;
  font-weight: 900;
  color: rgba(28,28,30,0.55);
  border-bottom: 1px solid rgba(28,28,30,0.10);
  background: rgba(255,255,255,0.55);
}

.lux-cal-cell{
  border-right: 1px solid rgba(28,28,30,0.10);
  border-bottom: 1px solid rgba(28,28,30,0.10);
  min-height: 70px;
}
.lux-cal-cell:nth-child(7n){
  border-right: none;
}

.lux-cal-btn{
  width: 100%;
  height: 70px;
  display: grid;
  place-items: center;
  background: transparent;
  border: 0;
  cursor: pointer;
  font-weight: 800;
  color: rgba(28,28,30,0.75);
  transition: background 120ms ease, transform 120ms ease, opacity 120ms ease;
}
.lux-cal-btn:hover{
  background: rgba(207,160,178,0.10);
}

.lux-cal-btn.selected{
  background: rgba(91,42,63,0.10);
  box-shadow: inset 0 0 0 2px rgba(91,42,63,0.22);
}

.lux-cal-btn.disabled{
  cursor: not-allowed;
  color: rgba(28,28,30,0.25);
  background: rgba(28,28,30,0.02);
  opacity: 0.65;
}

.lux-closed-tag{
  margin-top: 6px;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.10em;
  opacity: 0.65;
  color: rgba(91,42,63,0.80);
}
