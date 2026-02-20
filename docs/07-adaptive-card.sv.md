# 7. Skapa ett Adaptivt Kort för Beställning

Vi har nu en agent som kan hitta datorer. Nästa steg är att låta användaren **beställa** en av dem.
För att göra detta snyggt och användarvänligt ska vi använda ett **Adaptive Card**. Det är ett litet formulär direkt i chatten där användaren kan välja en dator och skriva en kommentar.

---

## 7.1 Skapa Ämne för Beställning

Vi skapar ett separat ämne för själva beställningen för att hålla logiken ren.

1.  Navigera till dina **Ämnen** i Copilot Studio.

    ![Navigera till Ämnen](assets/images-sv/chap07/1.png)

2.  Välj **+ Lägg till ett ämne** -> **Från tom**.

    ![Välj Lägg till ett ämne](assets/images-sv/chap07/2.png)

3.  Döp ämnet till:
    ```text
    Beställ enhet
    ```

    ![Skapa ämne](assets/images-sv/chap07/3.png)

3.  I rutan **Beskrivning** (under Utlösare), klistra in följande beskrivning:
    ```text
    Detta ämne hjälper användare att beställa en enhet när de svarar ja på frågan om de vill göra en beställning av en av de visade enheterna.
    ```

    ![Beskrivning](assets/images-sv/chap07/4.png)

---

## 7.2 Bygga Kortet (Visuell redigerare)

Nu ska vi lägga till själva kortet.

1.  Klicka på **plus-tecknet (+)** under Utlösare-noden.
2.  Välj **Fråga med adaptivt kort**.

    ![Välj Adaptivt kort](assets/images-sv/chap07/5.png)

3.  Klicka på de tre prickarna på kort-noden och välj **Egenskaper**.

    ![Kort Egenskaper](assets/images-sv/chap07/6.png)

4.  I panelen till höger, klicka på knappen **Redigera adaptivt kort**.

    ![Redigera kort](assets/images-sv/chap07/7.png)

### Testa verktyget (Valfritt men lärorikt)
Nu öppnas en stor editor. Till vänster har du komponenter (text, bilder, inputs) och i mitten ser du ditt kort.

![Editor](assets/images-sv/chap07/8.png)

1.  Prova att dra in ett **TextBlock** från vänstermenyn till kortet.

    ![Dra in text](assets/images-sv/chap07/9.png)

2.  Ändra texten till "Tillgängliga enheter" i menyn till höger.

    ![Text](assets/images-sv/chap07/10.png)

3.  Ändra **Horisontell justering** till **Centrerat**.

    ![Horisontell justering](assets/images-sv/chap07/11.png)

4.  Prova att dra in en **Input.ChoiceSet** under texten.

    ![Dra in val](assets/images-sv/chap07/12.png)

5.  Ändra **Format** till **Expanderat** för att se hur det ser ut som en lista med radioknappar.

    ![Format](assets/images-sv/chap07/13.png)

6.  Klicka på **Förhandsgranskningsläge** högst upp för att se hur det skulle se ut i chatten.

    ![Förhandsgranskning](assets/images-sv/chap07/14.png)

7.  Klicka på **Förhandsgranskningsläge** igen för att gå tillbaka.

---

## 7.3 Klistra in JSON (Snabbvägen)

Att bygga hela kortet för hand tar tid. Vi ska använda färdig kod (JSON) för att få en snygg grundstruktur.

1.  Längst ner i fönstret ser du **Card Payload Editor**. (Dra upp kanten om den är liten).

    ![Payload Editor](assets/images-sv/chap07/15.png)

2.  Radera **allt** som står i editorn.
3.  Kopiera och klistra in följande kod:

    ```json
    {
        "type": "AdaptiveCard",
        "$schema": "https://adaptivecards.io/schemas/adaptive-card.json",
        "version": "1.5",
        "backgroundImage": {
            "url": "https://adaptivecards.io/content/backgroundImage.png",
            "verticalAlignment": "Center"
        },
        "body": [
            {
                "type": "Container",
                "style": "emphasis",
                "bleed": true,
                "items": [
                    {
                        "type": "TextBlock",
                        "weight": "Bolder",
                        "size": "Large",
                        "wrap": true,
                        "text": "Enhetsval",
                        "horizontalAlignment": "Center"
                    }
                ]
            },
            {
                "type": "Container",
                "style": "default",
                "items": [
                    {
                        "type": "TextBlock",
                        "wrap": true,
                        "size": "Medium",
                        "text": "Vänligen välj vilken enhet du vill begära:"
                    }
                ],
                "spacing": "None"
            },
            {
                "type": "Container",
                "spacing": "None",
                "items": [
                    {
                        "type": "Input.ChoiceSet",
                        "id": "deviceSelectionId",
                        "style": "expanded",
                        "choices": [
                            {
                                "title": "Surface Laptop 13",
                                "value": "1"
                            },
                            {
                                "title": "Surface Laptop 15",
                                "value": "2"
                            },
                            {
                                "title": "Surface Studio",
                                "value": "3"
                            },
                            {
                                "title": "Surface Pro",
                                "value": "4"
                            }
                        ]
                    }
                ]
            },
            {
                "type": "Container",
                "spacing": "None",
                "style": "emphasis",
                "items": [
                    {
                        "type": "TextBlock",
                        "wrap": true,
                        "text": "Ytterligare information"
                    }
                ]
            },
            {
                "type": "Input.Text",
                "id": "commentsId",
                "placeholder": "Vänligen ange eventuella specifika krav eller övriga kommentarer",
                "isMultiline": true,
                "spacing": "Small"
            },
            {
                "type": "FactSet",
                "facts": [
                    {
                        "title": "Typ av förfrågan",
                        "value": "Ny enhet"
                    },
                    {
                        "title": "Svarstid:",
                        "value": "3-5 arbetsdagar"
                    }
                ],
                "spacing": "Small"
            }
        ],
        "actions": [
            {
                "type": "Action.Submit",
                "title": "Skicka"
            }
        ]
    }
    ```

4.  Klicka på **Förhandsgranskningsläge** för att se ditt snygga kort!
    *Just nu är listan på datorer "Hårdkodad" (Surface Laptop 13, 15 etc). Det ska vi ändra på nu.*

    ![Förhandsgranskning](assets/images-sv/chap07/16.png)

---

## 7.4 Göra kortet Dynamiskt (Power Fx)

Vi vill att listan i kortet ska baseras på vad vi faktiskt hittade i SharePoint (i föregående kapitel). För att göra det måste vi byta från statisk JSON till dynamisk **Power Fx**.

1.  Stäng Förhandsgranskningsläge.
2.  Längst upp till höger i editor-fönstret (ovanför koden), klicka på **JSON** och ändra till **Formel**.

    ![Ändra till Formel](assets/images-sv/chap07/17.png)

3.  Klicka på **Expandera**-ikonen (pilarna) för att göra formelfältet större.

    ![Expandera formel](assets/images-sv/chap07/18.png)

4.  Radera all kod i fönstret.
5.  Klistra in denna Power Fx-kod istället:

    ```powerfx
    {
      type: "AdaptiveCard",
      '$schema': "https://adaptivecards.io/schemas/adaptive-card.json",
      version: "1.5",
      backgroundImage: {
        url: "https://adaptivecards.io/content/backgroundImage.png",
        verticalAlignment: "Center"
      },
      body: [
        {
          type: "Container",
          style: "emphasis",
          bleed: true,
          items: [
            {
              type: "TextBlock",
              text: "Enhetsval",
              weight: "Bolder",
              size: "Large",
              wrap: true,
              horizontalAlignment: "Center"
            }
          ]
        },
        {
          type: "Container",
          style: "default",
          items: [
            {
              type: "TextBlock",
              text: "Vänligen välj vilken enhet du vill begära:",
              wrap: true,
              size: "Medium"
            }
          ],
          spacing: "None"
        },
        {
          type: "Container",
          spacing: "None",
          items: [
            {
              type: "Input.ChoiceSet",
              id: "deviceSelectionId",
              style: "expanded",
              choices: ForAll(
                Global.VarDevices.value,
                {
                  title: If(IsBlank(Model), "Okänd modell", Model),
                  value: If(IsBlank(ID), "NA", Text(ID))
                }
              )
            }
          ]
        },
        {
          type: "Container",
          spacing: "None",
          style: "emphasis",
          items: [
            {
              type: "TextBlock",
              text: "Ytterligare information",
              wrap: true
            },
            {
              type: "Input.Text",
              id: "commentsId",
              placeholder: "Vänligen ange eventuella specifika krav eller övriga kommentarer",
              isMultiline: true,
              spacing: "Small"
            }
          ]
        },
        {
          type: "Container",
          spacing: "Medium",
          items: [
            {
              type: "FactSet",
              facts: [
                {
                  title: "Typ av förfrågan:",
                  value: "Ny enhet"
                },
                {
                  title: "Svarstid:",
                  value: "3 till 5 arbetsdagar"
                }
              ],
              spacing: "Small"
            }
          ]
        }
      ],
      actions: [
        {
          type: "Action.Submit",
          title: "Skicka",
          id: "deviceSubmittedId"
        }
      ]
    }
    ```

    !!! info "Vad hände nu?"
        Titta på delen med `choices: ForAll(...)`.
        Istället för en fast lista säger vi nu: "Loopa igenom vår globala variabel `Global.VarDevices.value`. För varje rad, skapa ett val där titeln är modellnamnet och värdet är ID:t."
        Detta gör kortet levande!

6.  Kontrollera att du har en **grön bock** nere i hörnet (inga syntaxfel).

    ![Grön bock](assets/images-sv/chap07/19.png)

7.  Klicka på **Spara kort** (eller stäng krysset om knappen saknas, det sparas ofta automatiskt) och stäng sedan det adaptiva kortets egenskaper.

    ![Spara och stäng](assets/images-sv/chap07/20.png)

### Viktigt: Utdatavariabler
Om du tittar längst ner i Egenskapspanelen för din kort-nod, ser du sektionen **Utdata**.
Här bör du se två variabler:
* `deviceSelectionId` (Vad användaren valde)
* `commentsId` (Vad användaren skrev)

Dessa skapades automatiskt baserat på ID:n i koden vi klistrade in. Vi kommer att använda dessa i nästa kapitel för att genomföra beställningen.

![Utdatavariabler](assets/images-sv/chap07/21.png)

8.  Klicka **Spara** för att spara ditt ämne.

---

## 7.5 Uppdatera Agentens Instruktioner

Nu har vi ett ämne för att visa enheter (Tillgängliga Enheter) och ett för att beställa (Beställ enhet). Vi måste lära agenten hur de hänger ihop.

1.  Gå till fliken **Översikt**.

    ![Översikt](assets/images-sv/chap07/22.png)

2.  Vid **Instruktioner**, klicka på **Redigera**.

    ![Redigera instruktioner](assets/images-sv/chap07/23.png)

3.  Leta upp raden du lade till sist. Vi ska uppdatera den så att den länkar vidare till vårt nya ämne.
    
    *Ändra den sista punkten till följande:*

    ```text
    - Om användaren svarar ja på frågan om att beställa en enhet, trigga [Beställ enhet]. Om de svarar nej, avsluta på ett vänligt vis.
    ```

4.  **Viktigt:** Du måste göra länkarna "blåa".
    * Sudda ut `[Beställ enhet]`. Skriv `/Best` och välj **Beställ enhet** från listan.

5.  Klicka **Spara**.

    ![Spara](assets/images-sv/chap07/24.png)

### Testa flödet
Nu är det dags att se magin hända!

1.  Öppna **Testa**-panelen. Klicka på ikonen för **Karta** (Aktivitetskarta) och slå på **Spåra mellan ämnen**.
2.  Skriv: `Jag behöver en bärbar dator`
    *Agenten bör visa listan och fråga om du vill beställa.*
3.  Svara: `Ja tack`
    *Nu ska agenten automatiskt hoppa över till ditt nya ämne **Beställ enhet** och visa det snygga formuläret.*

!!! success "Snyggt!"
    Du har nu byggt ett dynamiskt formulär som anpassar sig efter vad som finns i lagret. I nästa kapitel ska vi se till att det faktiskt händer något när man klickar på "Skicka"!
