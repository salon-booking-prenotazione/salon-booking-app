import Link from "next/link";

export default function Home() {
  return (
    <div>
      <p>Benvenuta nel sistema di prenotazione.</p>

      <ul>
        <li>
          <Link href="/s/dashboard">📅 Vai alla dashboard</Link>
        </li>
        <li>
          <Link href="/s/appointments/new">➕ Aggiungi appuntamento</Link>
        </li>
      </ul>
    </div>
  );
}
