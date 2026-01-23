# Copilot Studio kurs

Det här är en praktisk guide där du bygger en IT supportagent i Copilot Studio. Du går från grundsetup till en agent som kan svara på frågor, guida användaren i en styrd dialog, använda adaptiva kort, anropa Agent Flows och agera mer självgående vid händelser.

## Konventioner i guiden
* UI etiketter, menyer och knappar skrivs i fetstil
* Roller och koncept skrivs i kursiv
* Tekniska namn, variabler och fältnamn skrivs som inline code
* Text som du ska kopiera skrivs i kodblock

## Kapitel och mål

### 0. Förberedelser och miljö
Mål: skapa en utvecklingsmiljö med Dataverse och verifiera att allt fungerar innan vi bygger.

### 1. Förbered SharePoint
Mål: skapa SharePoint sajten med mallen IT Help Desk, komplettera listan Devices och lägga in testdata.  
Läs: [01-prepare-sharepoint.md](01-prepare-sharepoint.md)

### 2. Hitta rätt i Copilot Studio
Mål: förstå var Agents, Flows och Tools bor och alltid säkra att du jobbar i rätt miljö.  
Läs: [02-tour-interface.md](02-tour-interface.md)

### 3. Skapa en lösning
Mål: skapa en Solution och sätt den som preferred så allt hamnar samlat och går att flytta senare.  
Läs: [03-create-solution.md](03-create-solution.md)

### 4. Skapa agenten
Mål: skapa IT Support Helper, fyll i instruktioner och gör första testet i testpanelen.  
Läs: [04-create-agent.md](04-create-agent.md)

### 5. Lägg till kunskap
Mål: koppla in datakällor så agenten kan svara baserat på innehåll ni äger.  
Läs: [05-add-knowledge.md](05-add-knowledge.md)

### 6. Skapa en styrd dialog
Mål: bygg en Topic som samlar in behov, gör villkorslogik och hämtar tillgängliga enheter från SharePoint.  
Läs: [06-create-topic.md](06-create-topic.md)

### 7. Skapa ett adaptivt kort
Mål: bygg ett formulär i chatten som fångar val och kommentarer på ett strukturerat sätt.  
Läs: [07-adaptive-card.md](07-adaptive-card.md)

### 8. Skapa ett Agent Flow
Mål: bygg ett Agent Flow som tar emot data från chatten, hämtar detaljer från SharePoint och skickar ett beställningsmejl.  
Läs: [08-create-flow.md](08-create-flow.md)

### 9. Autonomi
Mål: låt agenten reagera på händelser, till exempel när ett nytt ärende skapas, utan att användaren måste starta en chatt.  
Läs: [09-autonomy.md](09-autonomy.md)

### 10. Multi Agent Orchestration
Mål: delegera arbete till en specialistagent och koppla på notifieringar och verktyg.  
Läs: [10-multi-agent.md](10-multi-agent.md)
