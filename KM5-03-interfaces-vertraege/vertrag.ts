// Vertrag: "was, nicht wie" — wer Versendbar ist, kann versendet werden.
// Die readonly-Eigenschaft ist Teil des Vertrags (Identität, nach Entstehen fix).
export interface Versendbar {
  readonly id: string;
  versende(an: string): void;
}

// Umsetzung 1: Brief — versendet per Post (eigene Logik, eigenes Protokoll).
export class Brief implements Versendbar {
  readonly id: string;
  private zustellungen: string[] = [];

  constructor(id: string, private betreff: string) {
    this.id = id;
  }

  versende(an: string): void {
    this.zustellungen.push(`Brief ${this.id} ("${this.betreff}") an ${an}`);
  }

  get protokoll(): readonly string[] {
    return this.zustellungen;
  }
}

// Umsetzung 2: Paket — versendet per Paketdienst (andere Logik).
export class Paket implements Versendbar {
  readonly id: string;
  private zustellungen: string[] = [];

  constructor(id: string, private gewichtKg: number) {
    this.id = id;
  }

  versende(an: string): void {
    this.zustellungen.push(`Paket ${this.id} (${this.gewichtKg} kg) an ${an}`);
  }

  get protokoll(): readonly string[] {
    return this.zustellungen;
  }
}

// Die Funktion kennt NUR den Vertragstyp — keine der beiden Klassen.
export function versendeAn(item: Versendbar, an: string): void {
  item.versende(an);
}

export function sendeAlle(items: Versendbar[], an: string): void {
  for (const item of items) {
    item.versende(an);
  }
}
