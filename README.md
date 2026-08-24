# Microsoft AI-utbildningar

Detta är huvudprojektet för webbplatsen och utbildningsmaterialet. GitHub Pages publiceras från samma repository.

## Struktur

```text
docs/
  copilot-studio/
    standard/          Den etablerade Copilot Studio-utbildningen
    nextgen/           Den instruktionsdrivna utbildningen
  assets/
    shared/            Gemensamma webbplatsbilder
    standard/          Bilder för standardutbildningen
    nextgen/           Bilder för den nya utbildningen
  downloads/nextgen/   PDF- och Excel-filer för deltagare
presentations/
  concepts-and-theory/ PowerPoint och tillhörande källmaterial
data/nextgen/          Strukturerad data för produktkatalogen
scripts/nextgen/       Skript som bygger kursartefakter
source-assets/nextgen/ Originalbilder och arbetsmaterial
```

Endast innehåll under `docs/` publiceras på webbplatsen. Övriga mappar innehåller redigerbart källmaterial.

## Lokal förhandsvisning

```powershell
mkdocs serve
```

## Publicering

En push till `main` kör `.github/workflows/publish.yml` och publicerar webbplatsen till:

`https://tyto-official.github.io/copilot-studio-course/`
