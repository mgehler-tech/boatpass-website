---
title: "Kursumrechnung beim SBF See: rwK, mwK & MgK einfach erklärt"
description: "Missweisung, Ablenkung und Beschickung sicher umrechnen: So wandelst du beim SBF See rechtweisenden, missweisenden und Magnetkompasskurs fehlerfrei ineinander um – mit Vorzeichen-Regel und Rechenbeispiel."
date: 2026-06-05
tags: ["Navigation"]
readingTime: 8
lang: de
author: "Marius Gehler"
altSlug: "course-conversion-sbf-coastal"
howTo:
  name: "Kurs beim SBF See umrechnen: MgK, mwK und rwK"
  description: "So rechnest du den Magnetkompasskurs (MgK) mithilfe von Ablenkung und Missweisung fehlerfrei in den rechtweisenden Kurs (rwK) um, wie in der Navigationsaufgabe des SBF See gefordert."
  steps:
    - name: "Missweisung und Ablenkung mit Vorzeichen notieren"
      text: "Lies Missweisung (aus der Kompassrose der Seekarte) und Ablenkung (aus der Ablenkungstabelle für den anliegenden Kurs) ab und setze sie mit Vorzeichen: Ost = plus, West = minus."
    - name: "Richtung der Umrechnung festlegen"
      text: "Entscheide, ob du vom Kompass zur Karte rechnest (rwK = MgK + Ablenkung + Missweisung) oder von der Karte zum Kompass (MgK = rwK − Missweisung − Ablenkung)."
    - name: "Formel anwenden und Ergebnis prüfen"
      text: "Setze die Werte mit ihrem Vorzeichen in die Formel ein und rechne das Ergebnis aus. Liegt es über 360°, ziehe 360° ab; ist es negativ, addiere 360°."
---

Kaum ein Thema kostet Prüflingen beim Sportbootführerschein See so viele Nerven wie die Kursumrechnung. Dabei steckt dahinter nur eine einzige Formel und eine klare Vorzeichen-Regel. Wer beides verstanden hat, löst die Kursfragen der Navigationsaufgabe schnell und sicher. Dieser Artikel erklärt die Umrechnung von **rwK, mwK und MgK** Schritt für Schritt – inklusive Beschickung für Wind und Strom.

## Warum es überhaupt verschiedene Kurse gibt

Dein Magnetkompass an Bord zeigt nicht den geografischen Norden an, sondern wird von zwei Effekten gestört:

- **Missweisung (MW):** Der magnetische Nordpol liegt nicht am geografischen Nordpol. Die Abweichung ist ortsabhängig und steht in der Kompassrose der Seekarte.
- **Ablenkung (Abl), auch Deviation:** Das eigene Schiff (Motor, Stahlteile, Elektronik) lenkt die Kompassnadel zusätzlich ab. Die Ablenkung ist schiffs- und kursabhängig und steht in einer Ablenkungstabelle.

Deshalb unterscheiden wir drei Kurse:

| Kürzel | Kurs | Bezug |
| --- | --- | --- |
| **rwK** | rechtweisender Kurs | geografischer Nordpol (die "wahre" Richtung in der Karte) |
| **mwK** | missweisender Kurs | magnetischer Nordpol |
| **MgK** | Magnetkompasskurs | Anzeige deines Bordkompasses |

## Die eine Formel, die du brauchst

Vom Kompass zur Karte rechnest du beide Störungen **dazu**:

> **rwK = MgK + Ablenkung + Missweisung**

Umgekehrt – von der Karte zum Kompass – ziehst du beide wieder **ab**:

> **MgK = rwK − Missweisung − Ablenkung**

Dazwischen liegt jeweils der missweisende Kurs:

- MgK **+ Ablenkung** = mwK
- mwK **+ Missweisung** = rwK

Merke dir die Reihenfolge von innen nach außen: **MgK → (Ablenkung) → mwK → (Missweisung) → rwK.** Die Ablenkung sitzt immer direkt am Kompass, die Missweisung außen Richtung Karte.

## Die Vorzeichen-Regel: Ost plus, West minus

Der häufigste Fehler sind die Vorzeichen. Es gilt durchgängig:

- **Ost (E) = positiv (+)**
- **West (W) = negativ (−)**

Eine Missweisung von „4° E" rechnest du also als **+4°**, eine Ablenkung von „3° W" als **−3°**. Setze die Werte einfach mit ihrem Vorzeichen in die Formel ein – dann stimmt das Ergebnis automatisch, egal in welche Richtung gerechnet wird.

## Rechenbeispiel 1: vom Kompass zur Karte

Dein Kompass zeigt **MgK = 120°**. Die Karte gibt eine Missweisung von **3° W** an, die Ablenkungstabelle für diesen Kurs **2° E**.

1. Vorzeichen setzen: Missweisung = −3°, Ablenkung = +2°
2. rwK = MgK + Ablenkung + Missweisung
3. rwK = 120° + 2° + (−3°) = **119°**

Der rechtweisende Kurs, den du in die Seekarte einträgst, beträgt also **119°**.

## Rechenbeispiel 2: von der Karte zum Kompass

Du hast aus der Karte einen Kurs **rwK = 075°** abgegriffen und willst wissen, was du steuern musst. Missweisung **2° E**, Ablenkung **4° W**.

1. Vorzeichen setzen: Missweisung = +2°, Ablenkung = −4°
2. MgK = rwK − Missweisung − Ablenkung
3. MgK = 075° − 2° − (−4°) = 075° − 2° + 4° = **077°**

Du steuerst also **077°** am Kompass, um über Grund den Kartenkurs zu halten – Wind und Strom noch nicht eingerechnet.

## Beschickung für Wind und Strom

Der rwK bringt dich nur dann ans Ziel, wenn weder Wind noch Strom das Boot versetzen. In der Praxis – und in einigen Navigationsaufgaben – kommt deshalb die **Beschickung** dazu:

- **Beschickung für Strom (BS):** korrigiert den Stromversatz.
- **Beschickung für Wind (BW):** korrigiert die Windabdrift (Abdrift).

Der Kurs, den du tatsächlich über Grund machst, heißt **Kurs über Grund (KüG)**. Schematisch:

> rwK + Beschickung (Wind/Strom) → **KüG** (bzw. umgekehrt der zu steuernde Kurs, um einen gewünschten KüG zu erreichen)

Auch hier gilt die Ost-plus-West-minus-Logik für die Richtung der Versetzung. Wichtig fürs Verständnis: Missweisung und Ablenkung sind **Kompassfehler**, Wind und Strom sind **äußere Kräfte** – beides wird aber nach demselben Vorzeichen-Prinzip verrechnet.

## Die häufigsten Fehler – und wie du sie vermeidest

- **Vorzeichen vertauscht:** Schreibe MW und Abl immer zuerst mit Vorzeichen auf, bevor du rechnest. Ost +, West −.
- **Falsche Richtung:** Kläre vor dem Rechnen, ob du vom Kompass zur Karte (+) oder von der Karte zum Kompass (−) rechnest.
- **Ablenkungstabelle falsch abgelesen:** Die Ablenkung hängt vom anliegenden Kurs ab – lies den Wert für den richtigen Kurs ab, nicht pauschal.
- **Über 360° hinaus:** Liegt das Ergebnis über 360°, ziehe 360° ab; ist es negativ, addiere 360°.

## So übst du es richtig

Die Kursumrechnung ist reine Routine – sie muss sitzen, bis du sie ohne Nachdenken kannst. Am besten rechnest du Dutzende Varianten mit wechselnden Vorzeichen durch, bis die Formel automatisch abläuft. Genau dafür kannst du in der [Boatpass-App den Navigationsteil](/sbf-see-pruefungsfragen/) getrennt vom restlichen Fragenkatalog trainieren – mit echten Aufgaben wie in der Prüfung.

Wie die Kursumrechnung in die komplette Navigationsaufgabe eingebettet ist, liest du im Überblicksartikel [SBF See Navigationsaufgaben erklärt](/blog/sbf-see-navigationsaufgaben-erklaert/). Und wenn du noch unsicher bist, ob der SBF See überhaupt der richtige Schein für dich ist, hilft dir der Vergleich [SBF Binnen vs. SBF See](/blog/sbf-binnen-vs-see/).

## Fazit

Die Kursumrechnung beim SBF See ist kein Hexenwerk: Eine Formel (**rwK = MgK + Ablenkung + Missweisung**), eine Vorzeichen-Regel (**Ost +, West −**) und etwas Übung reichen aus. Wer beides verinnerlicht hat, löst die Kursfragen der Navigationsaufgabe in Sekunden – und geht entspannt in den Prüfungstag.
