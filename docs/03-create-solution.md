# 3. Skapa en Lösning (Solution)

Innan vi börjar bygga själva agenten ska vi skapa en "Lösning" (Solution). Tänk på detta som en **digital portfölj** eller en mapp där vi samlar allt som hör till vårt projekt.

Om vi inte gör detta hamnar allt i en stor röra som heter "Default Solution", vilket gör det omöjligt att flytta eller hantera agenten senare.

!!! tip "Varför Solution?"
    * **Ordning:** Allt som hör till din agent (chatboten, flöden, anslutningar) samlas på ett ställe.
    * **Flyttbarhet:** Vill du flytta din agent från din Developer-miljö till företagets riktiga miljö? Då **måste** den ligga i en Solution.

---

## Steg 1: Hitta till Solution Explorer

Vi kan hantera detta direkt inifrån Copilot Studio.

1. I vänstermenyn, klicka på de **tre prickarna (...)**.
2. Klicka på **Solutions** (under rubriken "Explore").

![Hitta Solutions i menyn](assets/images/chap03/sol-menu-find.png)

3. Nu ser du en lista på alla lösningar i miljön. Klicka på **+ New solution**.

![Klicka på New solution](assets/images/chap03/sol-new-button.png)

---

## Steg 2: Skapa en Publisher (Utgivare)

En "Publisher" är din signatur. Det visar vem som byggt agenten och lägger till ett prefix (t.ex. `lab_`) på alla dina tekniska komponenter för att undvika namnkonflikter med Microsofts system.

1. I rutan som dyker upp, leta efter fältet **Publisher**.
2. Klicka på **+ New publisher**.

![Skapa ny publisher](assets/images/chap03/sol-new-publisher.png)

3. Fyll i följande uppgifter under fliken **Properties**:
    * **Display name:** `Agent Lab`
    * **Name:** `AgentLab` *(Inga mellanslag)*
    * **Prefix:** `lab` *(Detta kommer stå framför alla dina databasnamn, t.ex. lab_minTabell)*
    * **Choice value prefix:** Ändra det slumpade numret till `10000`.
      *(Detta styr vilka sifferkoder dina valalternativ får i databasen. 10000 är snyggt och enkelt).*

4. Du behöver **inte** fylla i något under fliken *Contact*.
5. Klicka på **Save**.

![Spara publisher](assets/images/chap03/sol-publisher-save.png)

*(Rutan stängs och du kommer tillbaka till New solution-rutan. Din nya publisher 'Agent Lab' ska nu vara vald).*

---

## Steg 3: Skapa din Solution

Nu skapar vi själva lådan där vår agent ska bo.

1. **Display name:** `IT Helpdesk Agent`
2. **Name:** `ITHelpdeskAgent` (fylls i automatiskt)
3. **Publisher:** Välj den du nyss skapade (`Agent Lab`).
4. **Version:** `1.0.0.0` (Låt det vara).

**Viktigt steg:**
5. Kryssa i rutan: **Set as your preferred solution**.
    * *Varför?* Detta gör att allt du bygger framöver automatiskt sparas i denna lösning, även om du skapar saker från startsidan. Det förhindrar att dina filer hamnar i den stökiga "Default Solution".

![Fyll i solution detaljer](assets/images/chap03/sol-create-details.png)

6. **More options:** Du kan ignorera denna del (lämna fälten tomma). Vi behöver ingen konfigurationssida för denna labb.
7. Klicka på **Create**.

---

## Steg 4: Kontrollera och aktivera

Nu ska vi verifiera att lösningen är skapad och att den är inställd som standard.

1. Klicka på **pilen** (Back) längst upp till vänster (eller på "Solutions" i brödsmulorna) för att komma tillbaka till översikten.

![Gå tillbaka till översikten](assets/images/chap03/sol-verify-back.png)

2. Titta högst upp på sidan. Du ska nu se en ruta där det står **Current preferred solution: IT Helpdesk Agent**.

![Verifiera preferred solution banner](assets/images/chap03/sol-verify-banner.png)

*Eftersom vi kryssade i rutan "Set as preferred" tidigare ser vi nu detta meddelande. Det bekräftar att Copilot Studio vet att alla nya agenter ska läggas i just denna låda.*

!!! success "Klart!"
    Nu har du en professionell grundstruktur på plats. I nästa kapitel ska vi äntligen skapa vår agent!