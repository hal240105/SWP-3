import { assertEquals, assertThrows } from "jsr:@std/assert";
import { Konto } from "./konto.ts";

// Vorhersagen (erst hingeschrieben, dann per Test/Check geprüft):
// a) `k.kontostand = -1` mit `private`: `deno check` schlägt fehl (TS-Fehler
//    "Property is private"), es wird gar nicht erst ausgeführt. Mit `public`
//    kompiliert es und schreibt zur LAUFZEIT Datenmüll (-1) ins Objekt.
//    Zusatz: TS-`private` prüft nur Kompilierzeit, `#feld` wäre auch zur
//    Laufzeit im JS unerreichbar.
// b) Konstruktor wirft bei `new Konto("AT1", -5)`: Es existiert danach NULL
//    fertiges Objekt — `throw` bricht den Konstruktor ab, bevor `this` fertig
//    zugewiesen/übergeben wird; es bleibt kein halbfertiges Objekt zurück.
//    (Die Referenz wird nie zugewiesen.)
//
// Invarianten dieser Klasse:
//   I1: kontostand >= 0 (nie negativ, kein Dispo).
//   I2: jede Buchung mit betrag > 0; Abgänge nur gedeckt (betrag <= kontostand).

Deno.test("I1: Konstruktor wirft bei negativem Startwert", () => {
  assertThrows(() => new Konto("AT12 0001", -5), Error, "negativ");
});

Deno.test("I2: einzahlen(0/negativ) wirft", () => {
  const k = new Konto("AT12 0001", 500);
  assertThrows(() => k.einzahlen(0), Error, "positiv");
  assertThrows(() => k.einzahlen(-100), Error, "positiv");
  assertEquals(k.kontostand, 500); // unverändert (fail-fast)
});

Deno.test("I1+I2: abheben über Stand wirft und ändert nichts", () => {
  const k = new Konto("AT12 0001", 500);
  assertThrows(() => k.abheben(600), Error, "gedeckt");
  assertEquals(k.kontostand, 500);
});

Deno.test("grüner Pfad: einzahlen/abheben/ueberweisen gültig", () => {
  const a = new Konto("AT12 0001", 500);
  const b = new Konto("AT99 9999", 100);
  a.einzahlen(100);
  assertEquals(a.kontostand, 600);
  a.abheben(200);
  assertEquals(a.kontostand, 400);
  a.ueberweisen(b, 150);
  assertEquals(a.kontostand, 250);
  assertEquals(b.kontostand, 250);
});

Deno.test("ueberweisen ist atomar: bei Fehler stimmt kein Konto", () => {
  const a = new Konto("AT12 0001", 500);
  const b = new Konto("AT99 9999", 100);
  assertThrows(() => a.ueberweisen(b, 9999), Error, "gedeckt");
  assertEquals(a.kontostand, 500);
  assertEquals(b.kontostand, 100);
});
