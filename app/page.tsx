"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
const [isAdmin, setIsAdmin] = useState(false);

useEffect(() => {
  if (typeof window !== "undefined") {
    setIsAdmin(localStorage.getItem("isAdmin") === "true");
  }
}, []);

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
   {isAdmin && (
     <div style={{ marginTop: 24, borderTop: "1px solid #ccc", paddingTop: 12 }}>
      <strong>👩‍💼 Area staff</strong>
      <ul>
        <li>
          <a href="/admin/manual">Prenotazioni manuali</a>
       </li>
    </ul>
  </div>
)}

    </div>
  );
}
