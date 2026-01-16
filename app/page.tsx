import Link from "next/link";

export default function Home() {
  const slug = "salon-demo"; // per ora fisso

  return (
    <div>
      <p>Benvenuta nel sistema di prenotazione.</p>

      <ul>
        <li>
          <Link href={`/s/${slug}/dashboard`}>
            📋 Vai alla dashboard
          </Link>
        </li>
        <li>
          <Link href={`/s/${slug}`}>
            ➕ Aggiungi appuntamento
          </Link>
        </li>
      </ul>
    </div>
  );
}
