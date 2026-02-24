/**
 * Knowledge base articles.
 * Articles are tagged by substance/topic for personalized filtering.
 */
export const ARTICLES = [
    // --- Avhengighet generelt ---
    {
        id: 'a1',
        title: 'Hva er avhengighet?',
        category: 'avhengighet',
        tags: [],
        summary: 'Avhengighet er en kompleks tilstand som påvirker hjernen og atferd.',
        body: `Avhengighet er ikke et tegn på svakhet — det er en medisinsk tilstand som endrer hjernens belønningssystem.\n\nNår vi gjentatte ganger bruker rusmidler, tilpasser hjernen seg ved å redusere produksjonen av naturlige "feel-good"-stoffer som dopamin. Resultatet er at vi trenger mer av rusmiddelet for å føle oss «normalt».\n\n**Nøkkelpunkter:**\n- Avhengighet påvirker hjernens prefrontale cortex (beslutningstaking)\n- Det er IKKE et moralsk problem — det er et medisinsk problem\n- Recovery er mulig i alle stadier\n- Tilbakefall er normalt og betyr ikke at behandling har feilet`
    },
    {
        id: 'a2',
        title: 'Hva skjer i hjernen under sug?',
        category: 'avhengighet',
        tags: [],
        summary: 'Sug er hjernens måte å fortelle deg at den savner noe — men det er midlertidig.',
        body: `Sug aktiverer de samme hjernebaner som sult og tørst. Det føles desperat, men det er **midlertidig**.\n\n**Sug-kurven:**\n1. Trigger (situasjon, følelse, sted)\n2. Sug bygger seg opp (5-10 min)\n3. Topp intensitet (10-15 min)\n4. Avtar gradvis (15-30 min)\n\nJobben din er å «surfe» over toppen. Bruk verktøy som sug-timeren, pusteøvelser eller grounding for å holde ut.\n\n**Tips:** Husk at hvert sug du mestrer, gjør det neste litt lettere. Hjernen lærer at den kan klare seg uten.`
    },
    {
        id: 'a3',
        title: 'Tilbakefall er ikke det samme som å feile',
        category: 'recovery',
        tags: [],
        summary: 'Et tilbakefall er en mulighet til å lære, ikke et bevis på at du har feilet.',
        body: `Tilbakefall er en vanlig del av recovery-prosessen. Forskning viser at de fleste som oppnår varig rusfrihet har opplevd tilbakefall underveis.\n\n**Viktig forskjell:**\n- **Glipp** (lapse): En enkelt hendelse der du bruker\n- **Tilbakefall** (relapse): Tilbakevending til gammelt mønster\n\nEn glipp trenger ikke bli et tilbakefall.\n\n**Hva du bør gjøre:**\n1. Vær ærlig med deg selv\n2. Loggfør hendelsen (bruk hendelsesloggen)\n3. Identifiser triggeren\n4. Lag en plan for neste gang\n5. Søk støtte — snakk med noen\n\nDu har IKKE mistet alt du har jobbet for.`
    },
    // --- Alkohol ---
    {
        id: 'a4',
        title: 'Alkohol og kroppen',
        category: 'rusmidler',
        tags: ['Alkohol'],
        summary: 'Hva skjer i kroppen din når du drikker — og når du slutter.',
        body: `**Kortsiktig:**\n- Senker hemninger og reaksjonstid\n- Dehydrerer kroppen\n- Forstyrrer søvnkvaliteten\n\n**Langsiktig bruk:**\n- Lever: Fettlever → betennelse → skrumplever\n- Hjerne: Skader hukommelse og beslutningstaking\n- Psykisk: Forverrer angst og depresjon over tid\n\n**Når du slutter:**\nKroppen begynner å helbrede seg raskt:\n- 24 timer: Blodsukker stabiliserer seg\n- 1 uke: Søvnen forbedrer seg\n- 1 måned: Leveren begynner å reparere seg\n- 3 måneder: Mental klarhet og energi øker merkbart`
    },
    // --- Cannabis ---
    {
        id: 'a5',
        title: 'Cannabis: Myte vs. fakta',
        category: 'rusmidler',
        tags: ['Cannabis'],
        summary: 'Vanlige misforståelser om cannabis — hva sier forskningen?',
        body: `**Myte:** «Cannabis er ikke avhengighetsskapende»\n**Fakta:** Ca. 9% av brukere utvikler avhengighet (30% blant daglige brukere)\n\n**Myte:** «Det er naturlig, så det er trygt»\n**Fakta:** Naturlig ≠ risikofritt. Styrken (THC-nivå) har økt dramatisk de siste 20 årene.\n\n**Myte:** «Cannabis hjelper mot angst»\n**Fakta:** Kort sikt kanskje, men langvarig bruk kan *forverre* angst og utløse paranoia.\n\n**Fakta om abstinens:**\n- Søvnforstyrrelser (1-3 uker)\n- Irritabilitet og uro\n- Redusert appetitt\n- Symptomene er vanligvis over innen 1-2 uker`
    },
    // --- Stimulanter ---
    {
        id: 'a6',
        title: 'Stimulanter og dopamin',
        category: 'rusmidler',
        tags: ['Stimulanter (Kokain/Amfetamin)'],
        summary: 'Hvordan kokain og amfetamin kaprer hjernens belønningssystem.',
        body: `Stimulanter som kokain og amfetamin øker dopaminnivået i hjernen dramatisk — opptil 10x normalt.\n\n**Hva skjer:**\n- Intens eufori → kraftig nedtur (crash)\n- Hjernen tilpasser seg → trenger mer for samme effekt\n- Naturlige gleder (mat, sosial kontakt) føles kjedelig\n\n**Recovery:**\nDopaminsystemet bruker tid på å normalisere seg:\n- 1-2 uker: Crash-periode med fatigue og depresjon\n- 1-3 måneder: Gradvis bedring i humør\n- 6-12 måneder: Dopaminsystemet nærmer seg normalt\n\n**Viktig:** Vær tålmodig med deg selv. Anhedoni (manglende evne til å føle glede) er NORMALT i tidlig recovery og vil bli bedre.`
    },
    // --- Recovery-verktøy ---
    {
        id: 'a7',
        title: 'HALT: Fire advarsler du bør lytte til',
        category: 'recovery',
        tags: [],
        summary: 'Hungry, Angry, Lonely, Tired — fire tilstander som øker risiko for tilbakefall.',
        body: `**H**ungry (Sulten): Lavt blodsukker gjør deg impulsiv. Spis regelmessig.\n\n**A**ngry (Sint): Ubearbeidet sinne fører ofte til dårlige valg. Finn en ventil — snakk, skriv, tren.\n\n**L**onely (Ensom): Isolasjon er en av de sterkeste triggerne. Ring noen, selv om det er vanskelig.\n\n**T**ired (Trøtt): Utslitthet svekker viljestyrken. Prioriter søvn.\n\n**Bruk av HALT:**\nNeste gang du kjenner et sterkt sug, spør deg selv:\n- Er jeg sulten?\n- Er jeg sint?\n- Er jeg ensom?\n- Er jeg trøtt?\n\nOfte kan du løse suget ved å dekke det underliggende behovet.`
    },
    {
        id: 'a8',
        title: 'Hvordan bygge en støttekontakt-liste',
        category: 'recovery',
        tags: [],
        summary: 'En plan for hvem du kan ringe i vanskelige øyeblikk.',
        body: `Ha en liste klar FØR du trenger den:\n\n1. **Person 1:** Noen du stoler på 100% (familie/venn)\n2. **Person 2:** Noen som forstår recovery (behandler, NAV-kontakt, mentor)\n3. **Person 3:** Krisehjelp (se Krisehjelp-siden i appen)\n\n**Tips for å snakke med noen:**\n- Du trenger ikke forklar alt — bare si «Jeg har det vanskelig nå»\n- Be om å bli distrahert, ikke nødvendigvis om råd\n- Ring FØRST, tenk etterpå\n\nHusk: Å be om hjelp er IKKE svakhet. Det er en mestringstrategi.`
    },
];
