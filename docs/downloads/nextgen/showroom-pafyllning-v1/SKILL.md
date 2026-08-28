---
name: showroom-pafyllning
description: >-
  Använd denna skill när en Lyserno-medarbetare vill hitta produkter eller
  förbereda en intern påfyllnadsbegäran till ett showroom. Skillen hjälper
  agenten att identifiera rätt showroom, förstå produktbehovet och föreslå
  passande produkter från Lysernos aktuella sortiment. Använd inte skillen
  för allmänna produktfrågor som saknar koppling till showroompåfyllning.
metadata:
  version: 1.0.0
---

# Showroompåfyllning

Använd denna process när en medarbetare behöver hitta produkter eller förbereda en intern påfyllnadsbegäran till ett av Lysernos showrooms.

## Steg

1. **Identifiera showroomet**
   - Använd Lysernos publika webbplats för att verifiera showroomets namn, typ, region och adress.
   - Om flera showroom matchar användarens beskrivning, ställ en kort följdfråga och be användaren precisera vilket showroom som avses innan du går vidare.

2. **Förstå produktbehovet**
   - Kontrollera om användningsområde, produkttyp, färg och önskat antal framgår.
   - Fråga endast efter information som saknas och som behövs för att ge ett relevant förslag.

3. **Hitta passande produkter**
   - Använd `Lyserno Lighting Collection 2026` som primär källa för modeller, varianter, användningsområden och produktegenskaper.
   - Börja med den produkt som bäst matchar behovet och presentera högst två relevanta alternativ.
   - Förklara kort varför varje presenterad produkt passar användarens behov.

4. **Redovisa vad som kan verifieras**
   - Skilj tydligt mellan uppgifter som har verifierats i källorna och agentens rekommendationer.
   - Hitta inte på aktuellt pris, lagersaldo, reserverad kvantitet eller leveranstid.
   - Om aktuell lagerinformation behövs, förklara att den ännu inte kan verifieras och att en aktuell lagerkälla behöver kontrolleras.

## Svarsformat

Presentera resultatet kortfattat med följande delar:

- **Showroom**
- **Tolkat behov**
- **Huvudrekommendation**
- **Alternativ**, endast när de hjälper användaren att välja
- **Behöver verifieras**, för information som saknas i de tillgängliga källorna

## Klart när

Uppgiften är klar när användaren har fått ett källgrundat produktförslag för rätt showroom, eller när agenten tydligt har förklarat vilken information som behöver kompletteras eller verifieras.
