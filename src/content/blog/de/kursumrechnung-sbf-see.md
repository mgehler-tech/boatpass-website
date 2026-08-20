---
title: "Kursumrechnung beim SBF See: rwK, mwK & MgK einfach erklärt"
seoTitle: "Kursumrechnung SBF See: rwK, mwK, MgK"
description: "rwK, mwK und MgK sicher umrechnen: Formel, Vorzeichen-Regel Ost/West und drei Rechenbeispiele für die SBF-See-Navigationsaufgabe – inklusive Beschickung."
date: 2026-06-05
updated: 2026-08-20
tags: ["Navigation"]
readingTime: 9
lang: de
author: "Marius Gehler"
altSlug: "course-conversion-sbf-coastal"
image: "/images/blog/kursumrechnung-sbf-see.jpg"
imageAlt: "Seekarte auf einem Kartentisch mit Kursdreieck-Lineal, Bleistift und Bootskompass in der Morgensonne"
faq:
  - question: "Wie lautet die Formel für die Kursumrechnung beim SBF See?"
    answer: "Die Formel lautet rwK = MgK + Ablenkung + Missweisung, wenn du vom Kompass zur Karte rechnest. Umgekehrt, von der Karte zum Kompass, gilt MgK = rwK − Missweisung − Ablenkung."
  - question: "Was bedeutet die Vorzeichen-Regel Ost plus, West minus?"
    answer: "Missweisung und Ablenkung werden mit Vorzeichen in die Formel eingesetzt: Ost-Werte zählen als positiv, West-Werte als negativ. So stimmt das Ergebnis automatisch, egal in welche Richtung du rechnest."
  - question: "Was ist der Unterschied zwischen rwK, mwK und MgK?"
    answer: "rwK ist der rechtweisende Kurs bezogen auf den geografischen Nordpol, mwK der missweisende Kurs bezogen auf den magnetischen Nordpol, und MgK die Anzeige deines Bordkompasses. Zwischen ihnen liegen die Korrekturen für Missweisung und Ablenkung."
  - question: "Was ist die Beschickung für Wind und Strom?"
    answer: "Die Beschickung korrigiert den Versatz durch Wind (Abdrift) oder Strom, damit der tatsächlich gefahrene Kurs über Grund (KüG) erreicht wird. Sie wird nach derselben Ost-plus-West-minus-Logik wie Missweisung und Ablenkung verrechnet."
  - question: "Wie viele der Navigationsfragen muss ich beim SBF See richtig lösen?"
    answer: "Die Navigationsaufgabe umfasst 9 Teilfragen, von denen du mindestens 7 richtig beantworten musst. Sie wird getrennt vom übrigen Fragenkatalog gewertet, die Kursumrechnung ist einer von mehreren möglichen Aufgabentypen darin."
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

Kaum ein Thema kostet Prüflingen beim [Sportbootführerschein See](/sbf-see/) so viele Nerven wie die Kursumrechnung. Dabei steckt dahinter nur eine einzige Formel und eine klare Vorzeichen-Regel. Wer beides verstanden hat, löst die Kursfragen der Navigationsaufgabe schnell und sicher – und das lohnt sich: Von den 9 Teilfragen der Navigationsaufgabe musst du mindestens 7 richtig lösen, sonst fällst du durch, selbst mit perfektem Ergebnis im restlichen Fragenkatalog. Dieser Artikel erklärt die Umrechnung von **rwK, mwK und MgK** Schritt für Schritt – inklusive Beschickung für Wind und Strom und drei durchgerechneten Beispielen.

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

## Rechenbeispiel 3: Kurs über Grund mit Beschickung

Du steuerst einen rechtweisenden Kurs von **rwK = 090°**. Die Strömung versetzt dich mit einer Beschickung von **4° W**.

1. Vorzeichen setzen: Beschickung = −4°
2. KüG = rwK + Beschickung
3. KüG = 090° + (−4°) = **086°**

Dein tatsächlicher Kurs über Grund beträgt also **086°**, obwohl du 090° gesteuert hast – die Strömung hat dich um 4° nach Westen versetzt. Genau dasselbe Vorzeichen-Prinzip (Ost +, West −) gilt hier wie bei Missweisung und Ablenkung, nur dass die Beschickung zwischen rwK und KüG wirkt, nicht zwischen Karte und Kompass.

## Die häufigsten Fehler – und wie du sie vermeidest

- **Vorzeichen vertauscht:** Schreibe MW und Abl immer zuerst mit Vorzeichen auf, bevor du rechnest. Ost +, West −.
- **Falsche Richtung:** Kläre vor dem Rechnen, ob du vom Kompass zur Karte (+) oder von der Karte zum Kompass (−) rechnest.
- **Ablenkungstabelle falsch abgelesen:** Die Ablenkung hängt vom anliegenden Kurs ab – lies den Wert für den richtigen Kurs ab, nicht pauschal.
- **Über 360° hinaus:** Liegt das Ergebnis über 360°, ziehe 360° ab; ist es negativ, addiere 360°.

## So übst du es richtig

Die Kursumrechnung ist reine Routine – sie muss sitzen, bis du sie ohne Nachdenken kannst. Am besten rechnest du Dutzende Varianten mit wechselnden Vorzeichen durch, bis die Formel automatisch abläuft. Genau dafür kannst du in der [Boatpass-App den Navigationsteil](/sbf-see-pruefungsfragen/) getrennt vom restlichen Fragenkatalog trainieren: mit echten Aufgaben wie in der Prüfung, sofortiger Auswertung und der Möglichkeit, gezielt die Aufgabentypen zu wiederholen, bei denen du noch unsicher bist.

Wie die Kursumrechnung in die komplette Navigationsaufgabe eingebettet ist, liest du im Überblicksartikel [SBF See Navigationsaufgaben erklärt](/blog/sbf-see-navigationsaufgaben-erklaert/). Und wenn du noch unsicher bist, ob der SBF See überhaupt der richtige Schein für dich ist, hilft dir der Vergleich [SBF Binnen vs. SBF See](/blog/sbf-binnen-vs-see/).

## Fazit

Die Kursumrechnung beim SBF See ist kein Hexenwerk: Eine Formel (**rwK = MgK + Ablenkung + Missweisung**), eine Vorzeichen-Regel (**Ost +, West −**) und etwas Übung reichen aus. Wer beides verinnerlicht hat, löst die Kursfragen der Navigationsaufgabe in Sekunden – und geht entspannt in den Prüfungstag.
