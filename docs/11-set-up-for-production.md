# 00 Sätta upp Azure pay as you go för Copilot Studio och Dataverse

## Mission brief
Målet är att kunna bygga och publicera agenter i en separat Power Platform miljö med betala per användning via Azure, utan att blockeras av Dataverse kapacitetskrav och utan att riskera oväntade kostnader i fel miljö.

Den här guiden beskriver exakt vad vi gjorde, varför vi gjorde det, samt hur du verifierar att allt hamnar rätt.

## Resultat du ska ha när du är klar
1. En Azure prenumeration som kan ta emot debitering.
2. En resursgrupp i Azure för tydlig kostnadsuppföljning.
3. En faktureringsplan i Power Platform som pekar på Azure prenumerationen och resursgruppen.
4. En ny Power Platform miljö med Dataverse där betala per användning är aktivt redan vid skapandet.
5. En Azure budget med aviseringar så du ser kostnad tidigt.

## Förutsättningar
1. Du är global administratör i din tenant.
2. Du har åtkomst till Power Platform admin center.
3. Du kan skapa Azure konto eller prenumeration.
4. Du vet vilken region du vill använda, exempel Sverige eller Europa.

## Viktig princip
Dataverse måste provisioneras med betala per användning aktivt redan vid skapandet av miljön.  
Annars försöker systemet ta minst 1 GB från tenantens kapacitetspool, vilket ofta stoppar skapandet med kapacitetsfel.

## Vanliga fel vi löste
1. No Azure subscriptions available i Power Platform.
2. Det går inte att skapa miljön eftersom klientorganisationen behöver minst 1 GB databaskapacitet.
3. Faktureringsplanen kräver att en miljö kopplas direkt, även om man helst vill vänta.

---

# Steg 1 Skapa Azure prenumeration genom Azure Free Account

## Var görs det
Azure portalen eller Azure sign up flödet.

## Gör så här
1. Starta skapandet av ett Azure free account.
2. Slutför registreringen.
3. Logga in i Azure portalen och verifiera att du ser en prenumeration, exempel Azure subscription 1.

## Verifiera
1. Gå till Subscriptions i Azure portalen.
2. Du ska se din prenumeration i listan.

---

# Steg 2 Säkerställ rätt behörighet på prenumerationen

## Varför
Det här är den vanligaste orsaken till att Power Platform inte kan lista din Azure prenumeration.

## Var görs det
Azure portal, inne på din prenumeration.

## Gör så här
1. Öppna Subscriptions.
2. Klicka på Azure subscription 1.
3. Välj Access control IAM.
4. Öppna Role assignments.
5. Kontrollera att du har rollen Owner. Contributor fungerar ofta men Owner är säkrast för setup.

## Verifiera
Du ska se ditt konto listat med Owner på scope för prenumerationen.

---

# Steg 3 Skapa resursgrupp i Azure

## Varför
Resursgruppen gör det enkelt att filtrera och förstå kostnader.

## Var görs det
Azure portal, Resource groups.

## Gör så här
1. Gå till Resource groups.
2. Klicka Create.
3. Prenumeration: Azure subscription 1.
4. Resource group name: rg pp paygo copilot.
5. Region: exempel Sweden Central.

## Taggar som är bra att lägga direkt
Du kan lägga taggar direkt vid skapandet. Det är best practice och biter dig inte senare.
1. purpose: pp paygo
2. env: demo
3. owner: joel

## Verifiera
1. Öppna resursgruppen efter skapandet.
2. Kontrollera att taggarna finns.

---

# Steg 4 Skapa faktureringsplan i Power Platform och koppla till Azure

## Var görs det
Power Platform admin center.

## Navigering
Power Platform admin center  
Licensing  
Billing plans  
New billing plan

## Mätare du valde
1. Dataverse
2. Copilot Studio
3. Power Automate

Du kan lägga till fler senare, exempel Power Apps, Power Pages, Windows 365 för agenter, om du faktiskt behöver dem.

## Problem vi fick
Vi kunde inte skapa faktureringsplanen utan att koppla en miljö direkt.  
Därför kopplade vi default miljön temporärt.

## Steg 4A Skapa faktureringsplanen med default miljön temporärt
1. Gå till Power Platform admin center, Billing plans, New.
2. Name: DemoPublish Billing.
3. Azure subscription: Azure subscription 1.
4. Resource group: rg pp paygo copilot.
5. Meter: välj Dataverse, Copilot Studio, Power Automate.
6. Gå vidare till Välj miljöer.
7. Välj Joel Thyberg default.
8. Spara.

## Kontroll direkt efter
1. Öppna billing planen du nyss skapade.
2. Verifiera att endast Joel Thyberg default är kopplad.
3. Verifiera att CopilotLab inte är kopplad.

## Varför detta var ok
Default miljön hade ingen Dataverse konsumtion i praktiken och vi byggde inget där.  
Risken för kostnad var därför nära noll så länge vi höll disciplin på vilken miljö vi använder.

---

# Steg 5 Skapa miljön DemoPublish med Dataverse och betala per användning aktivt

## Var görs det
Power Platform admin center.

## Navigering
Power Platform admin center  
Environments  
New

## Fyll i så här
1. Name: DemoPublish.
2. Region: välj Sverige om den finns, annars fungerar Europa Standard.
3. Managed environment: Nej för start om du vill hålla det enkelt.
4. Early access features: Nej för start.
5. Environment type: välj Utvärdering eller Produktion. Undvik Begränsat läge om du vill minimera friktion initialt.
6. Add Dataverse: Ja.
7. Pay as you go with Azure: Ja.
8. Välj billing plan: DemoPublish Billing.
9. Dynamics 365 apps: Nej.
10. Sample data: Nej.
11. Security group: välj Inga om du är ensam, eller skapa en security group med bara dig om du vill vara strikt.

## Dataverse inställningar
1. Språk: svenska Sverige.
2. Valuta: SEK.
3. URL: låt den genereras automatiskt om du inte behöver anpassad domän.

## Den kritiska punkten
Pay as you go måste vara på redan när Dataverse provisioneras.  
Om du försöker lägga på pay as you go efteråt kan skapandet falla på 1 GB kravet.

---

# Steg 6 Flytta kopplingen i faktureringsplanen från default till DemoPublish

## Varför
Du vill inte ha default miljön kopplad längre, även om det var en temporär workaround.

## Gör så här
1. Gå till Power Platform admin center, Billing plans.
2. Öppna DemoPublish Billing.
3. Ta bort Joel Thyberg default från miljölistan.
4. Lägg till DemoPublish.
5. Spara.

## Verifiera
Billing planen ska nu endast vara kopplad till DemoPublish.

---

# Steg 7 Förläng Copilot Studio trial om du får prompten

## Varför
Det ger dig mer tid att testa innan du behöver köpa eller gå fullt betala per användning för agentförbrukning i större skala.

## Gör så här
1. Följ prompten i Copilot Studio när den erbjuds.
2. Bekräfta förlängningen.

Notera att du kan ha trial aktiv och ändå ha betala per användning setup redo.  
Det viktiga är att du har kontroll på vilken miljö som är kopplad till billing planen.

---

# Steg 8 Sätt upp budget och aviseringar i Azure

## Var görs det
Azure portal, Cost Management.

## Navigering
Cost Management  
Budgets  
Create

## Rekommenderat upplägg för enkel kontroll
Scope: Azure subscription 1.

## Exempel på budget och trösklar
1. Budgetbelopp: välj ett belopp du är trygg med.
2. Alerts för faktisk kostnad: 50 procent, 80 procent, 100 procent.
3. Alerts för prognos: 50 procent.

## Mottagare
Lägg in både din onmicrosoft adress och din riktiga e post, om du vill.

## Viktigt om filter
Det kan ta timmar innan kostnader syns och innan filter som resursgrupp går att välja.  
Det är normalt.

---

# Miljötyper och hur de mappar mot det du ser i UI

## Begrepp
Begränsat läge motsvarar ofta Sandbox.
Produktion motsvarar Production.
Utvecklare är Developer environment som hör ihop med Developer Plan och har egna begränsningar.
Utvärdering är Trial miljö som normalt löper ut.
Utvärdering prenumerationsbaserad är en annan trial variant som Microsoft beskriver separat.

---

# Snabb verifiering efter setup

## 1 Verifiera miljö och billing koppling
1. Power Platform admin center, Billing plans.
2. Öppna planen.
3. Kontrollera att DemoPublish är kopplad och inget annat.

## 2 Verifiera att DemoPublish har Dataverse
1. Power Platform admin center, Environments.
2. Öppna DemoPublish.
3. Kontrollera att Dataverse är provisionerat.

## 3 Verifiera kostnadsflöde i Azure
1. Vänta några timmar.
2. Azure portal, Cost Management, Cost analysis.
3. Group by service name och byt period till This month.

---

# Nästa steg för praktisk test

## Målet med testet
Bevisa att du kan bygga, paketera och publicera i DemoPublish.

## Rekommenderad ordning
1. Öppna Copilot Studio och byt miljö till DemoPublish.
2. Skapa en enkel agent och testa i test chat.
3. Skapa en solution i Power Apps maker portal i DemoPublish.
4. Lägg agenten i solution och exportera.
5. Publicera agenten till Teams eller annan kanal och verifiera att den svarar.

---

# Troubleshooting

## Problem No Azure subscriptions available
1. Kontrollera IAM på prenumerationen.
2. Du ska vara Owner.
3. Logga ut och in igen i Power Platform admin center efter rolländring.

## Problem 1 GB databaskapacitet vid skapande av miljö
1. Se till att Pay as you go with Azure är aktiverat redan vid skapandet.
2. Se till att du väljer billing planen i skapandet.
3. Försök inte skapa Dataverse först och koppla billing efteråt.

## Problem att developer miljön inte syns i listor
Det kan bero på regionfilter, rättigheter eller hur miljön är klassad.  
Det viktiga här är att DemoPublish fungerar och är kopplad till billing planen.

