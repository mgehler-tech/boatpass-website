---
title: "Gezeiten berechnen mit der Zwölftelregel – einfach erklärt"
seoTitle: "Zwölftelregel: Gezeiten berechnen"
description: "Tidenhub, Hoch- und Niedrigwasser, Tiefe unter dem Kiel: Mit der Zwölftelregel schätzt du den Wasserstand ab – mit Rechenbeispiel für den SBF See."
date: 2026-06-02
tags: ["Navigation"]
readingTime: 7
lang: de
author: "Marius Gehler"
altSlug: "tides-rule-of-twelfths"
faq:
  - question: "Was ist die Zwölftelregel?"
    answer: "Die Zwölftelregel teilt den Tidenhub in zwölf gleiche Teile auf, um den Wasserstand zwischen Hoch- und Niedrigwasser abzuschätzen. Sie folgt der Reihenfolge 1 – 2 – 3 – 3 – 2 – 1 Zwölftel pro Stunde über die rund sechs Stunden zwischen den Wenden."
  - question: "Wie berechne ich den Wasserstand mit der Zwölftelregel?"
    answer: "Zunächst wird der Tidenhub, also die Differenz zwischen Hoch- und Niedrigwasserhöhe, durch zwölf geteilt. Dieser Wert wird dann für jede Stunde mit dem passenden Anteil aus der Reihenfolge 1 – 2 – 3 – 3 – 2 – 1 multipliziert und zur Niedrigwasserhöhe addiert bzw. beim Fallen abgezogen."
  - question: "Wie berechne ich das Wasser unter dem Kiel?"
    answer: "Die Wassertiefe ergibt sich aus der Kartentiefe bezogen auf Seekartennull plus der aktuellen Gezeitenhöhe, minus dem Tiefgang des Bootes. Dabei sollte immer eine Sicherheitsreserve eingeplant werden, da Wind und Luftdruck den realen Wasserstand von der Vorhersage abweichen lassen können."
  - question: "Wie genau ist die Zwölftelregel?"
    answer: "Sie ist eine Näherung, die einen gleichmäßigen, sinusähnlichen Tidenverlauf unterstellt und meist unter 2,5 % vom Tidenhub abweicht. Für Törnplanung und SBF-See-Prüfung reicht diese Genauigkeit aus, bei unregelmäßigem Tidenverlauf wie Doppelhochwasser stößt sie aber an ihre Grenzen."
howTo:
  name: "Wasserstand mit der Zwölftelregel berechnen"
  description: "So schätzt du mit der Zwölftelregel den Wasserstand zwischen Niedrig- und Hochwasser ab und ermittelst daraus das Wasser unter dem Kiel – so wie es die SBF-See-Prüfung und die Törnplanung verlangen."
  steps:
    - name: "Hoch- und Niedrigwasserzeiten und -höhen ablesen"
      text: "Entnimm dem Gezeitenkalender oder der Tidentafel für dein Revier die Zeiten und Höhen von Niedrig- und Hochwasser, zum Beispiel Niedrigwasser 08:00 Uhr mit 1,0 m und Hochwasser 14:00 Uhr mit 4,0 m."
    - name: "Tidenhub bestimmen und durch zwölf teilen"
      text: "Zieh die Niedrigwasserhöhe von der Hochwasserhöhe ab, um den Tidenhub zu erhalten (4,0 m − 1,0 m = 3,0 m). Teile ihn durch zwölf; das ergibt ein Zwölftel, hier 0,25 m."
    - name: "Zwölftel für die vergangenen Stunden addieren"
      text: "Zähle die Anteile der Merkfolge 1 – 2 – 3 – 3 – 2 – 1 für die seit der Wende vergangenen Stunden zusammen. Drei Stunden nach Niedrigwasser sind das 1 + 2 + 3 = 6 Zwölftel."
    - name: "Wasserstand ausrechnen"
      text: "Multipliziere die Anzahl der Zwölftel mit dem Wert eines Zwölftels (6 × 0,25 m = 1,5 m) und addiere das Ergebnis zur Niedrigwasserhöhe: 1,0 m + 1,5 m = 2,5 m über Seekartennull. Bei fallendem Wasser ziehst du den Betrag stattdessen von der Hochwasserhöhe ab."
    - name: "Wasser unter dem Kiel prüfen"
      text: "Rechne Kartentiefe plus Gezeitenhöhe minus Tiefgang deines Bootes. Plane zusätzlich eine Sicherheitsreserve ein, weil Wind und Luftdruck den realen Wasserstand von der Vorhersage abweichen lassen können."
---

Wer auf Nord- oder Ostsee unterwegs ist, kommt an den Gezeiten nicht vorbei. Besonders im Wattenmeer entscheidet der richtige Zeitpunkt darüber, ob unter dem Kiel noch genug Wasser steht. Mit der **Zwölftelregel** lässt sich der Wasserstand zwischen Hoch- und Niedrigwasser einfach abschätzen – ganz ohne aufwendige Tabellen. So funktioniert sie.

## Die Grundbegriffe

Bevor es ans Rechnen geht, klären wir die wichtigsten Begriffe:

- **Hochwasser (HW):** der höchste Wasserstand einer Tide.
- **Niedrigwasser (NW):** der niedrigste Wasserstand einer Tide.
- **Tidenhub:** der Höhenunterschied zwischen Hoch- und Niedrigwasser (Tidenhub = HW-Höhe − NW-Höhe).
- **Seekartennull (SKN):** das Bezugsniveau, auf das sich die Tiefenangaben in der Seekarte beziehen. Die Gezeitenhöhe wird dazu addiert, um die tatsächliche Wassertiefe zu erhalten.

An den meisten deutschen Küsten gibt es zwei Hoch- und zwei Niedrigwasser pro Tag. Zwischen einem Hoch- und dem folgenden Niedrigwasser liegen rund **sechs Stunden**.

## Die Zwölftelregel

Die Idee dahinter: Das Wasser steigt (oder fällt) nicht gleichmäßig, sondern in der Mitte der Tide am schnellsten und an den „Wendepunkten" bei Hoch- und Niedrigwasser am langsamsten. Die Zwölftelregel bildet das in einfachen Bruchteilen ab.

Du teilst den Tidenhub gedanklich in **zwölf gleiche Teile** auf. In den sechs Stunden zwischen Niedrig- und Hochwasser ändert sich der Wasserstand pro Stunde um:

| Stunde | Änderung | Anteil am Tidenhub |
| --- | --- | --- |
| 1. Stunde | 1 Zwölftel | 1/12 |
| 2. Stunde | 2 Zwölftel | 2/12 |
| 3. Stunde | 3 Zwölftel | 3/12 |
| 4. Stunde | 3 Zwölftel | 3/12 |
| 5. Stunde | 2 Zwölftel | 2/12 |
| 6. Stunde | 1 Zwölftel | 1/12 |

Die Merkfolge lautet also **1 – 2 – 3 – 3 – 2 – 1**. Zusammengezählt ergeben diese Anteile genau 12 Zwölftel, also den vollen Tidenhub. Beim Fallen des Wassers gilt dieselbe Reihenfolge – nur dass die Beträge dann abgezogen werden.

## Rechenbeispiel

Nehmen wir an:

- Niedrigwasser um **08:00 Uhr** mit einer Höhe von **1,0 m**
- Hochwasser um **14:00 Uhr** mit einer Höhe von **4,0 m**

Der **Tidenhub** beträgt 4,0 m − 1,0 m = **3,0 m**. Ein Zwölftel davon sind 3,0 m ÷ 12 = **0,25 m**.

Frage: Wie hoch steht das Wasser um **11:00 Uhr**, also drei Stunden nach Niedrigwasser?

In den ersten drei Stunden steigt das Wasser um 1 + 2 + 3 = **6 Zwölftel**, also um die Hälfte des Tidenhubs:

6 × 0,25 m = **1,5 m**

Diesen Anstieg addierst du zur Niedrigwasserhöhe:

1,0 m + 1,5 m = **2,5 m**

Um 11:00 Uhr steht das Wasser also etwa **2,5 m** über Seekartennull.

## Wie viel Wasser steht unter dem Kiel?

Für die Praxis zählt die tatsächliche Wassertiefe an einer Stelle. Sie ergibt sich aus der **Kartentiefe** (bezogen auf Seekartennull) plus der **aktuellen Gezeitenhöhe**. Ziehst du davon den **Tiefgang** deines Bootes ab, erhältst du das Wasser unter dem Kiel:

> Wassertiefe = Kartentiefe + Gezeitenhöhe − Tiefgang

Plane dabei immer eine **Sicherheitsreserve** ein – Wind und Luftdruck können den realen Wasserstand von der Vorhersage abweichen lassen.

## Wie genau ist die Zwölftelregel?

Die Zwölftelregel ist eine Näherung. Sie unterstellt einen gleichmäßigen, sinusähnlichen Tidenverlauf und rund sechs Stunden zwischen den Wenden. Die Abweichung von der idealen Kurve bleibt klein – meist unter 2,5 % des Tidenhubs. Für die Törnplanung und die SBF-See-Prüfung ist diese Genauigkeit völlig ausreichend. In Revieren mit unregelmäßigem Tidenverlauf (z. B. mit Doppelhochwasser) stößt die Regel allerdings an ihre Grenzen.

## So bereitest du dich vor

Gezeitenfragen tauchen im theoretischen Teil des [SBF See](/sbf-see/) auf und sind eng mit der [Navigationsaufgabe](/blog/sbf-see-navigationsaufgaben-erklaert/) verknüpft. Wer die Zwölftelregel und die Begriffe rund um Tidenhub und Seekartennull sicher beherrscht, sammelt hier verlässlich Punkte. In der Boatpass-App kannst du die passenden Fragen gezielt und getrennt vom restlichen Katalog üben.

## Fazit

Die Zwölftelregel macht die Gezeitenrechnung erstaunlich einfach: Tidenhub durch zwölf teilen, die Reihenfolge **1 – 2 – 3 – 3 – 2 – 1** anwenden und das Ergebnis zur Niedrigwasserhöhe addieren (oder beim Fallen abziehen). Zusammen mit der Formel für das Wasser unter dem Kiel hast du damit ein praxistaugliches Werkzeug – an Bord wie in der Prüfung.
