export class Konto {
  readonly iban: string;
  private _kontostand: number;

  constructor(iban: string, startBetrag: number) {
    if (iban.trim().length === 0) {
      throw new Error("IBAN darf nicht leer sein");
    }
    // Invariante I1 beim Entstehen: Kontostand nie negativ.
    if (startBetrag < 0) {
      throw new Error(
        `Startbetrag darf nicht negativ sein (war ${startBetrag})`,
      );
    }
    this.iban = iban;
    this._kontostand = startBetrag;
  }

  // Lesen über getter — kein setter, damit niemand die Prüfung umgeht.
  get kontostand(): number {
    return this._kontostand;
  }

  einzahlen(betrag: number): void {
    // Invariante I2: nur positive Beträge.
    if (betrag <= 0) {
      throw new Error(`Betrag muss positiv sein (war ${betrag})`);
    }
    this._kontostand += betrag;
  }

  abheben(betrag: number): void {
    // Invariante I2: positiv ...
    if (betrag <= 0) {
      throw new Error(`Betrag muss positiv sein (war ${betrag})`);
    }
    // ... und gedeckt (I1 bleibt erhalten: Kontostand >= 0).
    if (betrag > this._kontostand) {
      throw new Error(
        `Nicht gedeckt: ${betrag} > Kontostand ${this._kontostand} (kein Dispo)`,
      );
    }
    this._kontostand -= betrag;
  }

  ueberweisen(auf: Konto, betrag: number): void {
    // Fail-Fast: erst ALLES prüfen, dann erst buchen.
    // So bleiben entweder beide Konten korrekt oder gar keines
    // (kein halb-verändertes Objektpaar).
    if (betrag <= 0) {
      throw new Error(`Betrag muss positiv sein (war ${betrag})`);
    }
    if (betrag > this._kontostand) {
      throw new Error(
        `Nicht gedeckt: ${betrag} > Kontostand ${this._kontostand} (kein Dispo)`,
      );
    }
    this._kontostand -= betrag;
    auf._kontostand += betrag;
  }
}
