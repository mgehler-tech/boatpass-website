---
title: "Magnetic Compass, Variation and Deviation Explained Simply"
seoTitle: "Compass Variation & Deviation Explained"
description: "Why doesn't a boat compass point exactly north? Variation and deviation explained clearly: causes, compass rose and deviation table for the SBF Coastal exam."
date: 2026-07-04
tags: ["Navigation"]
readingTime: 8
lang: en
author: "Marius Gehler"
altSlug: "kompass-missweisung-deviation-erklaert"
faq:
  - question: "What is the difference between variation and deviation?"
    answer: "Variation is the difference between true north and magnetic north, caused by the magnetic north pole not sitting at the geographic north pole, and it is location-dependent. Deviation is the difference between magnetic north and compass north, caused by disturbing fields on board, and it depends on the boat and the heading being steered."
  - question: "Why doesn't a boat compass point exactly north?"
    answer: "Because two systematic errors shift the reading: variation, caused by the distance between the geographic and magnetic north poles, and deviation, caused by magnetic disturbing fields on board such as the engine, anchor chain, or electronics near the compass."
  - question: "Where do you find the value for variation and for deviation?"
    answer: "Variation is shown in the compass rose of the nautical chart for that chart section. Deviation is recorded in the boat's own deviation table, determined separately for each compass heading and valid only for that exact compass in that exact mounting position."
  - question: "Why does deviation change with heading while variation doesn't?"
    answer: "Deviation is caused by disturbing fields on board that rotate relative to the Earth's magnetic field as the boat turns, so it is heading-dependent. Variation, on the other hand, depends only on location on Earth and stays unchanged when the heading changes."
---

The magnetic compass is one of the oldest navigation instruments there is, and it is still found on practically every boat today. Yet its needle almost never points exactly at the geographic north pole. Understanding why requires telling apart two concepts: **variation** and **deviation**. Both are foundational knowledge for the [SBF Coastal exam (SBF See)](/en/sbf-coastal/), the German powerboat licence for coastal waters, and the basis for every course conversion. This article explains how a magnetic compass works and where its two systematic errors come from.

## How a magnetic compass actually works

At its core, a magnetic compass consists of a freely pivoted, magnetized needle or compass card that aligns itself with the Earth's magnetic field. Most recreational boats use a **liquid-filled compass**: the compass card floats in a damping fluid so it does not swing wildly in a seaway and settles quickly. A fixed mark on the compass housing, the **lubber line**, indicates the direction of travel and therefore the heading currently being steered. The compass card itself is graduated over the full 360° circle, so you can always read the lubber line against a precise number of degrees.

For the reading to stay reliable, the compass needs to sit level and free of vibration. A good mounting spot also sits directly in the helmsman's line of sight, so you never have to twist around to read it, because a compass card read at an angle quickly introduces small but avoidable course errors.

That would be straightforward, if it were not for two effects that keep the needle from pointing exactly at the geographic north pole.

## Three different norths

To understand variation and deviation, it helps to clearly separate three different reference directions for north:

- **True north:** the geographic north pole, the "real" north as drawn on every nautical chart. In the German exam this is called rechtweisend Nord (rwN).
- **Magnetic north:** the direction in which the Earth's magnetic north pole actually lies. German: missweisend Nord (mwN).
- **Compass north:** the direction your on-board compass actually shows once the disturbances caused by your own vessel are included. German: Kompass Nord (KN).

The difference between true north and magnetic north is called **variation**, and the difference between magnetic north and compass north is called **deviation**. Both angles are given in degrees, with the suffix **east (E)** or **west (W)**, depending on which side of true north the respective direction falls.

## Variation: the geographic and magnetic poles do not coincide

The Earth's magnetic north pole is not located at the geographic north pole, and it slowly drifts over the years. Depending on where on Earth you are, a compass needle therefore does not point exactly at true north but is offset by a certain angle. This offset is called **variation** (German: Missweisung).

Key properties of variation:

- It is **location-dependent**: it takes different values at different points on Earth.
- It is **independent of the vessel**: it does not matter whether you are on a motorboat or a sailboat.
- It changes **slowly over time**, because the magnetic north pole itself is moving.

Every nautical chart shows the variation that applies to that particular chart section in its **compass rose**. A compass rose typically consists of two concentric circles: the outer one marks true north, the inner one is rotated by the variation to mark magnetic north. How to read this compass rose as part of chart work is explained in detail in [How to Read a Nautical Chart](/en/blog/how-to-read-a-nautical-chart/).

### Variation keeps shifting over the years

Because the magnetic north pole keeps moving, variation is not a fixed constant but drifts slowly over time. Charts therefore usually state not only the current value but also the year it refers to and roughly how much the variation changes per year. If you are working from an older chart, you should account for that annual change and adjust the printed value accordingly, rather than using it as is. Up-to-date, regularly corrected charts save you this step, one more reason to sail with the most current chart material available.

## Deviation: when your own vessel disturbs the compass

Besides variation, there is a second, vessel-specific source of error: **deviation**. It arises because materials and equipment on board create their own magnetic field or distort the Earth's magnetic field, for example:

- **Ferromagnetic components** such as the engine, tools, the anchor or anchor chain near the compass.
- **Electrical and electronic equipment**, such as radios, speakers or current-carrying cables, which generate their own magnetic field.
- The vessel's **own induced magnetism**, particularly on steel or aluminium hulls.

Unlike variation, deviation is **not location-dependent but vessel- and heading-dependent**: it is different for every boat and additionally changes with the heading being steered, because the disturbing components rotate relative to the compass and the Earth's field as the boat turns.

### Two kinds of disturbing fields on board

The magnetic disturbances on board roughly fall into two groups: **fixed magnetism already built into the installed material**, which barely changes over time, and **disturbing fields that only arise from the boat's current orientation in the Earth's magnetic field**, which therefore change with every change of heading. It is this second group that explains why deviation is not the same on every heading and has to be determined separately for each one.

It is also worth knowing that deviation depends not only on the boat but on the exact **mounting position of the compass**. The same compass placed at a different spot on the same boat, closer to the engine or further from the on-board electronics, would show a different deviation. A deviation table therefore only applies to that one compass in that one exact location. If the compass is moved, the table has to be re-established.

## The deviation table: a different value for every heading

Because deviation depends on heading, a single value is not enough. Instead, every boat gets its own **deviation table**, listing the deviation value that applies to each compass heading. In practice this means: before converting a course, you have to look up the value for the heading actually being steered, not apply one fixed number across the board.

A deviation table is established by comparing the boat's compass heading on a series of different headings against a known, true reference direction. The difference gives the deviation value for each heading tested. If deviation on a boat cannot be reduced enough, a specialist can **compensate** the compass, reducing the disturbance with small correcting magnets fitted to the compass housing. Deviation usually cannot be eliminated completely this way, so a smaller residual deviation typically remains, which continues to be recorded in an up-to-date table.

A compensated table should not be treated as valid forever. If the boat's load changes, new equipment is fitted, or the boat sits moored in one orientation in the Earth's field for a long time, deviation can shift slightly. Checking the readings periodically, for example against known landmarks or another reliable course reference, gives you confidence that the recorded values still hold.

## Why you need both values for course conversion

Variation and deviation are both **systematic errors** that sit between what is drawn on the chart and what your compass actually shows. To convert between true course, magnetic course and compass course, you need to account for both corrections, each with its own sign (east = plus, west = minus).

This conversion is a core part of the navigation task in the SBF Coastal exam. The exact formula, the sign rule and worked examples are covered in [Course Conversion for the SBF Coastal: True, Magnetic & Compass Course Explained](/en/blog/course-conversion-sbf-coastal/). How course conversion fits into the full navigation task is shown in the overview article [SBF Coastal Navigation Tasks Explained](/en/blog/sbf-coastal-navigation-tasks-explained/).

## Placing the compass correctly on board

To keep deviation as small as possible, it is worth following a few basic rules when installing and using a compass:

- Keep **sufficient distance** from the engine, speakers, radios and larger metal parts.
- Do not place **magnetic objects** such as tools, phones or drink cans right next to the compass.
- After refits, installing new electronics or major repairs, **check the deviation table and have it re-established if necessary**, since the disturbing fields on board may have changed.

## Variation and deviation side by side

The two sources of error are easy to mix up in exam preparation, since they sound similar and, at first glance, seem to describe the same problem. This overview sums up the key differences:

| Feature | Variation | Deviation |
| --- | --- | --- |
| Cause | Distance between the geographic and magnetic north poles | Magnetic disturbing fields on board your own boat |
| Depends on | Location on Earth | The boat and the heading being steered |
| Where to find the value | The chart's compass rose | The boat's deviation table |
| Change over time | Slowly, over years | Can shift with refits or new electronics |

## Typical exam questions on variation and deviation

The theory part of the SBF Coastal exam regularly tests whether you understand the difference between variation and deviation: which one is location-dependent and which is vessel-dependent? Where does each value come from (the chart's compass rose versus the boat's deviation table)? How does a change of heading affect deviation, and why does variation stay unchanged in that case? And how are both values correctly combined when converting between the three course types? In the [Boatpass app](/en/sbf-coastal-exam-questions/) you can train exactly these questions from the official ELWIS question catalogue in exam mode.

## Conclusion

Variation and deviation are two distinct but related sources of error in a magnetic compass: variation arises from the distance between the geographic and magnetic poles and is location-dependent, while deviation arises from the vessel itself and is boat- and heading-dependent. Knowing both causes, and knowing where to find each value, variation in the chart's compass rose and deviation in the boat's own deviation table, gives you the essential foundation for course conversion in the SBF Coastal exam.
