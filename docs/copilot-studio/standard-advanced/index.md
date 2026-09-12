---
hide:
  - navigation
  - toc
---

<div class="course-landing course-landing--advanced">
  <section class="course-hero course-hero--advanced">
    <div class="course-hero__copy">
      <a class="back-link" href="../../">Alla utbildningar</a>
      <div class="eyebrow">STANDARDHARNESSEN · FÖRDJUPNING</div>
      <h1>Bygg en <span>driftassistent med externa system</span></h1>
      <p>En fördjupningskurs där du kopplar en standardagent till externa system. Du bygger en intern serviceagent som analyserar en bild, verifierar utrustning via ett eget anslutningsprogram, hämtar beslutsunderlag via MCP och skapar en arbetsorder efter användarens godkännande.</p>
      <div class="hero-actions">
        <a class="button button--primary" href="00-course-setup/">Starta kursen</a>
        <a class="button button--ghost" href="#kursresan">Se alla kapitel</a>
      </div>
      <div class="hero-meta"><span>11 kapitel</span><span>Fördjupningsnivå</span><span>Prompt · Connector · MCP</span></div>
    </div>
    <div class="course-hero__visual">
      <div class="product-shot">
        <img src="../../assets/shared/portal/old-hero.png" alt="Startsidan i Copilot Studio med valet mellan agent och arbetsflöde">
      </div>
      <div class="floating-label"><strong>Serviceagent</strong><span>Analys · uppslag · beslut</span></div>
    </div>
  </section>

  <section class="scenario-band" id="scenariot">
    <div><div class="section-label">SCENARIOT</div><h2>Från felanmälan till godkänd arbetsorder</h2></div>
    <p>En anställd rapporterar ett utrustningsfel och bifogar en bild. Agenten analyserar bilden, verifierar objektet mot T-Berg D&amp;U, räknar ut prioriteten, hämtar felhistorik, tekniker och reservdelar via MCP och skapar en arbetsorder efter användarens godkännande.</p>
  </section>

  <section class="capability-grid capability-grid--six" aria-label="Agentens sex steg">
    <article class="capability capability--green"><span>01</span><h3>Bilden identifierar</h3><p>Prompten läser märkskylt och felkod ur ett foto och returnerar strukturerad data.</p></article>
    <article class="capability capability--blue"><span>02</span><h3>Anslutningsprogrammet verifierar</h3><p>Ett fast uppslag mot det externa affärssystemet bekräftar vilket objekt felanmälan gäller.</p></article>
    <article class="capability capability--teal"><span>03</span><h3>Ämnet beslutar</h3><p>Kritikalitet och påverkan ger prioritet enligt en regel som inte varierar.</p></article>
    <article class="capability capability--coral"><span>04</span><h3>MCP:n kompletterar</h3><p>Felhistorik, tillgängliga tekniker och reservdelar hämtas från det externa systemet.</p></article>
    <article class="capability capability--purple"><span>05</span><h3>Användaren granskar</h3><p>Ett adaptivt kort visar underlaget och låter användaren godkänna eller avbryta.</p></article>
    <article class="capability capability--green"><span>06</span><h3>Agentflödet skapar</h3><p>Efter godkännandet skapas arbetsordern och ett bekräftelsemejl skickas.</p></article>
  </section>

  <section class="chapter-section" id="kursresan">
    <div class="chapter-section__heading">
      <div class="section-label">KURSRESAN</div>
      <h2>Bygg hela kedjan</h2>
      <p>Du börjar med kursmiljön och bygger sedan vidare tills felanmälan kan verifieras, kompletteras, godkännas och sparas som en arbetsorder.</p>
    </div>
    <div class="chapter-grid">
      <a href="00-course-setup/"><span>00</span><div><h3>Kursuppsättning</h3><p>Aktivera Copilot Studio, skapa en utvecklingsmiljö och kontrollera att kursens byggblock är tillgängliga.</p></div></a>
      <a href="01-navigate-copilot-studio/"><span>01</span><div><h3>Hitta rätt i Copilot Studio</h3><p>Kontrollera miljön och lär känna agenter, flöden och verktygstyperna.</p></div></a>
      <a href="02-create-solution/"><span>02</span><div><h3>Skapa lösningen</h3><p>Samla dagens komponenter i en egen lösning med eget prefix.</p></div></a>
      <a href="03-create-agent/"><span>03</span><div><h3>Skapa och grundkonfigurera agenten</h3><p>Bygg agenten från grunden, sätt orkestrering, filuppladdning, modell och instruktioner.</p></div></a>
      <a href="04-create-topic-and-prompt/"><span>04</span><div><h3>Skapa ämnet och analysera felbilden</h3><p>Skapa ämnets gränssnitt, be om en bild och returnera strukturerad data från en egen prompt.</p></div></a>
      <a href="05-collect-missing-information/"><span>05</span><div><h3>Samla in objekt och påverkan</h3><p>Använd promptens resultat och ställ bara följdfrågor när objekt-ID eller påverkan saknas.</p></div></a>
      <a href="06-connect-tberg-api/"><span>06</span><div><h3>Anslut T-Berg DU API och verifiera objektet</h3><p>Importera anslutningsprogrammet, skapa en testanslutning och hämta verifierad objektinformation till ämnet.</p></div></a>
      <a href="07-connect-tberg-mcp/"><span>07</span><div><h3>MCP: fördjupa utredningen</h3><p>Anslut en MCP-server och låt uppslagen bygga vidare på varandra.</p></div></a>
      <a href="08-review-and-create-work-order/"><span>08</span><div><h3>Granska och skapa arbetsorder</h3><p>Visa det verifierade underlaget i ett adaptivt kort och fortsätt bara när användaren godkänner.</p></div></a>
      <a href="09-create-work-order-flow/"><span>09</span><div><h3>Skapa arbetsorder med ett agentflöde</h3><p>Bygg och publicera flödet som skapar arbetsordern, skickar bekräftelsemejlet och returnerar resultatet.</p></div></a>
      <a href="10-connect-flow-and-test/"><span>10</span><div><h3>Koppla ihop och testa hela kedjan</h3><p>Koppla flödet till granskningsämnet och verifiera resultatet i chatten, mejlet och T-Berg D&amp;U.</p></div></a>
    </div>
  </section>

  <section class="course-cta course-cta--teal">
    <div><div class="section-label section-label--light">MÅLET</div><h2>En agent som följer samma beslutsregler varje gång och kan visa varför.</h2></div>
    <div><p>Kursen är fristående. Du behöver inte ha gått grundkursen, men den som har det känner igen sig.</p><a class="button button--light button--arrow" href="00-course-setup/">Börja med kursuppsättningen</a></div>
  </section>
</div>
