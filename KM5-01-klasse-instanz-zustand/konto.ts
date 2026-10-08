export class Konto {
  readonly iban: string;
  private _kontostand: number;

  constructor(iban: string, startBetrag: number) {
    this.iban = iban;
    this._kontostand = startBetrag;
  }

  get kontostand(): number {
    return this._kontostand;
  }

  einzahlen(betrag: number): void {
    this._kontostand += betrag;
  }

  equals(other: Konto): boolean {
    return this.iban === other.iban;
  }
}
