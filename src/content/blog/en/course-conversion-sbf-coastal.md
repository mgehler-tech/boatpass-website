---
title: "Course Conversion for the SBF Coastal: True, Magnetic & Compass Course Explained"
seoTitle: "Course Conversion for the SBF Coastal"
description: "True, magnetic and compass course made simple: the formula, the East/West sign rule and three worked examples for the SBF Coastal navigation task."
date: 2026-06-05
updated: 2026-08-20
tags: ["Navigation"]
readingTime: 9
lang: en
author: "Marius Gehler"
altSlug: "kursumrechnung-sbf-see"
image: "/images/blog/kursumrechnung-sbf-see.jpg"
imageAlt: "Nautical chart on a chart table with a parallel course plotter, pencil, and a boat compass in morning light"
faq:
  - question: "What is the formula for course conversion in the SBF Coastal exam?"
    answer: "The formula is TC = CC + Deviation + Variation when converting from compass to chart. The other way round, from chart to compass, it is CC = TC − Variation − Deviation."
  - question: "What does the East plus, West minus sign rule mean?"
    answer: "Variation and deviation are plugged into the formula with a sign: values to the East count as positive, values to the West as negative. That way the result is correct automatically, no matter which direction you convert."
  - question: "What is the difference between true, magnetic and compass course?"
    answer: "True course is referenced to the geographic north pole, magnetic course to the magnetic north pole, and compass course is simply what your on-board compass reads. Deviation and variation are the corrections that connect them."
  - question: "What is the offset for wind and current?"
    answer: "The offset corrects for the set caused by wind (leeway) or current so you reach your actual course over ground. It is calculated using the same East-plus, West-minus sign logic as variation and deviation."
  - question: "How many of the navigation task questions do I need to get right for the SBF Coastal?"
    answer: "The navigation task has 9 sub-questions, and you need at least 7 correct to pass. It is graded separately from the rest of the question catalogue, and course conversion is one of several task types it can include."
howTo:
  name: "Convert a course for the SBF Coastal: CC, MC and TC"
  description: "How to convert your compass course (CC) into the true course (TC) using deviation and variation, correctly and without mistakes, as required in the SBF Coastal navigation task."
  steps:
    - name: "Write down variation and deviation with their sign"
      text: "Read the variation (from the chart's compass rose) and the deviation (from the deviation table for the current heading) and apply the sign: East is plus, West is minus."
    - name: "Decide which direction you are converting"
      text: "Decide whether you are converting from compass to chart (TC = CC + Deviation + Variation) or from chart to compass (CC = TC − Variation − Deviation)."
    - name: "Apply the formula and check the result"
      text: "Plug the signed values into the formula and calculate the result. If it exceeds 360°, subtract 360°; if it is negative, add 360°."
---

Few topics cause [SBF Coastal](/en/sbf-coastal/) (SBF See) candidates more stress than course conversion. Yet behind it lies just one formula and a clear sign rule. Once you understand both, the course questions in the navigation task become quick and reliable – and that pays off: the navigation task has 9 sub-questions, and you need at least 7 correct to pass, even with a perfect score on the rest of the exam. This article explains converting between **true course, magnetic course and compass course** step by step, including the offset for wind and current and three fully worked examples.

## Why there are different courses at all

Your magnetic compass on board does not point to geographic north. Two effects disturb it:

- **Variation (Var):** The magnetic north pole is not at the geographic north pole. This deviation depends on location and is printed in the chart's compass rose.
- **Deviation (Dev):** Your own vessel (engine, steel parts, electronics) deflects the compass needle further. Deviation depends on the ship and the heading and is read from a deviation table.

That is why we distinguish three courses:

| Abbr. | Course | Reference |
| --- | --- | --- |
| **TC** (rwK) | true course | geographic north pole (the "real" direction on the chart) |
| **MC** (mwK) | magnetic course | magnetic north pole |
| **CC** (MgK) | compass course | the reading of your on-board compass |

> Note: In the German exam the labels are **rwK** (rechtweisender Kurs = true), **mwK** (missweisender Kurs = magnetic) and **MgK** (Magnetkompasskurs = compass). The logic is identical.

## The one formula you need

From compass to chart you **add** both disturbances:

> **TC = CC + Deviation + Variation**

The other way round – from chart to compass – you **subtract** both again:

> **CC = TC − Variation − Deviation**

The magnetic course sits in between:

- CC **+ Deviation** = MC
- MC **+ Variation** = TC

Remember the order from inside out: **CC → (Deviation) → MC → (Variation) → TC.** Deviation always sits closest to the compass, variation on the outside toward the chart.

## The sign rule: East plus, West minus

The most common mistake is the sign. The rule is always:

- **East (E) = positive (+)**
- **West (W) = negative (−)**

So a variation of "4° E" is **+4°**, a deviation of "3° W" is **−3°**. Just plug the values in with their sign – the result is then correct automatically, no matter which direction you convert.

## Worked example 1: from compass to chart

Your compass reads **CC = 120°**. The chart gives a variation of **3° W**, the deviation table for this heading **2° E**.

1. Apply signs: variation = −3°, deviation = +2°
2. TC = CC + Deviation + Variation
3. TC = 120° + 2° + (−3°) = **119°**

The true course you draw on the chart is therefore **119°**.

## Worked example 2: from chart to compass

You picked a course of **TC = 075°** off the chart and want to know what to steer. Variation **2° E**, deviation **4° W**.

1. Apply signs: variation = +2°, deviation = −4°
2. CC = TC − Variation − Deviation
3. CC = 075° − 2° − (−4°) = 075° − 2° + 4° = **077°**

So you steer **077°** on the compass to hold the chart course over ground – wind and current not yet included.

## Offset for wind and current

The true course only gets you to your destination if neither wind nor current sets the boat off track. In practice – and in some navigation tasks – you therefore add the **offset**:

- **Current offset:** corrects for the set caused by current.
- **Wind offset (leeway):** corrects for wind drift.

The course you actually make over the seabed is the **course over ground (COG)**. Schematically:

> TC + offset (wind/current) → **COG** (or, in reverse, the course to steer in order to achieve a desired COG)

The East-plus, West-minus logic applies here too for the direction of the set. One thing to keep clear: variation and deviation are **compass errors**, while wind and current are **external forces** – but both are handled with the same sign principle.

## Worked example 3: course over ground with an offset

You are steering a true course of **TC = 090°**. The current sets you off with an offset of **4° W**.

1. Apply the sign: offset = −4°
2. COG = TC + offset
3. COG = 090° + (−4°) = **086°**

Your actual course over ground is therefore **086°**, even though you steered 090° – the current has set you 4° to the west. The same sign principle (East +, West −) applies here as with variation and deviation, except the offset acts between TC and COG, not between chart and compass.

## The most common mistakes – and how to avoid them

- **Signs swapped:** Always write variation and deviation with their sign first, before you calculate. East +, West −.
- **Wrong direction:** Decide before you start whether you are going from compass to chart (+) or from chart to compass (−).
- **Deviation table misread:** Deviation depends on the heading – read the value for the correct course, not a fixed number.
- **Beyond 360°:** If the result exceeds 360°, subtract 360°; if it is negative, add 360°.

## How to practise it properly

Course conversion is pure routine – it has to be second nature, so you can do it without thinking. The best approach is to work through dozens of variants with changing signs until the formula runs automatically. In the [Boatpass app you can train the navigation section](/en/sbf-coastal-exam-questions/) separately from the rest of the question catalogue: with real tasks just like in the exam, immediate feedback, and the option to specifically repeat the task types you are still unsure about.

To see how course conversion fits into the complete navigation task, read the overview article [SBF Coastal Navigation Tasks Explained](/en/blog/sbf-coastal-navigation-tasks-explained/). And if you are still deciding which licence fits you, the comparison [SBF Inland vs. Coastal](/en/blog/sbf-inland-vs-coastal/) helps, or browse every German boating licence on the [licences overview](/en/licenses/).

## Conclusion

Course conversion for the SBF Coastal is no mystery: one formula (**TC = CC + Deviation + Variation**), one sign rule (**East +, West −**) and a bit of practice are enough. Master both and you will solve the course questions in the navigation task in seconds – and walk into exam day relaxed.
