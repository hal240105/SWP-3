import { assertEquals } from "jsr:@std/assert";
import { Brief, Paket, sendeAlle, Versendbar, versendeAn } from "./vertrag.ts";

// Vorhersagen (erst hingeschrieben, dann per deno check / Test geprüft):
// a) `class X implements Verzinsbar` ohne `jahresZins()`: kompiliert NICHT.
//    TypeScript meckert direkt an der Klassendeklaration ("Class 'X' incorrectly
//    implements interface 'Verzinsbar'. Property 'jahresZins' is missing").
// b) Objekt MIT `jahresZins`, aber OHNE `implements`, an `Verzinsbar`-Variable
//    zuweisen: ERLAUBT. TypeScript nutzt structural typing — es zählt die Form
//    (geforderte Mitglieder vorhanden?), nicht die Abstammung/`implements`
//    (das ist nur Dokumentation).

Deno.test("beide Klassen erfüllen den Vertrag (Funktion akzeptiert beide)", () => {
  const brief = new Brief("B-001", "Zeugnis");
  const paket = new Paket("P-001", 2.5);

  // Derselbe Aufruf mit beiden Klassen — die Funktion kennt nur Versendbar.
  sendeAlle([brief, paket], "Wien");

  assertEquals(brief.protokoll.length, 1);
  assertEquals(paket.protokoll.length, 1);
  assertEquals(brief.protokoll[0], 'Brief B-001 ("Zeugnis") an Wien');
  assertEquals(paket.protokoll[0], "Paket P-001 (2.5 kg) an Wien");
});

Deno.test("versendeAn kennt nur den Vertragstyp", () => {
  const brief = new Brief("B-002", "Einladung");
  const paket = new Paket("P-002", 1);

  versendeAn(brief, "Graz");
  versendeAn(paket, "Linz");

  assertEquals(brief.protokoll[0], 'Brief B-002 ("Einladung") an Graz');
  assertEquals(paket.protokoll[0], "Paket P-002 (1 kg) an Linz");
});

Deno.test("structural typing: Form ohne implements wird akzeptiert", () => {
  const erhalten: string[] = [];
  // Kein `implements`, keine Klasse — trotzdem ein Versendbar, weil die Form stimmt.
  const ohneKlasse: Versendbar = {
    id: "X-1",
    versende(an: string): void {
      erhalten.push(`manuell ${an}`);
    },
  };

  versendeAn(ohneKlasse, "Wien");
  sendeAlle([ohneKlasse], "Graz");

  assertEquals(erhalten, ["manuell Wien", "manuell Graz"]);
  assertEquals(ohneKlasse.id, "X-1");
});
