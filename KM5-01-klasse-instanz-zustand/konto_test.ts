import { assertEquals } from "jsr:@std/assert";
import { Konto } from "./konto.ts";

// Vorhersagen (erst hingeschrieben, dann per Test geprüft):
// a) `const c = a;` -> Es gibt 1 Konto-Objekt und 2 Variablen (a und c zeigen
//    auf denselben Speicher). Es gilt `c === a` === true, weil `===` bei
//    Objekten Identität (gleicher Speicherplatz) vergleicht.
// b) Nach `a.einzahlen(100)` (Start 500) liefert `c.kontostand` 600, nicht 500,
//    weil c und a dasselbe Objekt referenzieren: `einzahlen` ändert den Zustand
//    DIESER einen Instanz (`this._kontostand += ...`), die Klasse und andere
//    Instanzen bleiben unberührt.

Deno.test("Vorhersage a: const c = a teilt die Identität", () => {
  const a = new Konto("AT12 0001", 500);
  const c = a;
  assertEquals(c === a, true);
});

Deno.test("Vorhersage b: a.einzahlen ändert auch c (gleiches Objekt)", () => {
  const a = new Konto("AT12 0001", 500);
  const c = a;
  a.einzahlen(100);
  assertEquals(c.kontostand, 600);
});

Deno.test("equals: gleiche IBAN, verschiedener Stand -> true", () => {
  const a = new Konto("AT12 0001", 500);
  const b = new Konto("AT12 0001", 9999);
  assertEquals(a.equals(b), true);
});

Deno.test("equals: verschiedene IBAN, gleicher Stand -> false", () => {
  const a = new Konto("AT12 0001", 500);
  const b = new Konto("AT99 9999", 500);
  assertEquals(a.equals(b), false);
});

Deno.test("Identität ungleich Zustand: zwei new sind nie ===", () => {
  const a = new Konto("AT12 0001", 500);
  const b = new Konto("AT12 0001", 500);
  assertEquals(a === b, false);
  // Zustand gleich, Identität verschieden -> equals() vergleicht Zustand/IBAN.
  assertEquals(a.equals(b), true);
});
