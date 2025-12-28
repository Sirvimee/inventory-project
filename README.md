# Inventari Haldamise Rakendus

Inventari haldamise rakendus ehitatud **Micronaut Java** backendiga ja **Vue** frontendiga.

## Kirjeldus

See rakendus võimaldab hallata erinevate toodete inventari (näiteks jalgrattad, vinüülplaadid jne). Kasutajad saavad lisada, muuta ja kustutada tooteid ning jälgida inventari seisu.

## Eeldused

Installeeri masinasse:
- **Java JDK 17+** - backendi käitamiseks
- **Node.js 18+** ja **npm** - frontendinule

## Juhendid Käivitamiseks

### 1. Backend Käivitamine

Ava käsurida ja mine `inventory-backend` kausta:

```bash
cd inventory-backend
```

Käivita rakendus:

```bash
./gradlew run
```

Windowsil:

```bash
gradlew.bat run
```

Backend käivitatakse tavaliselt aadressil: **http://localhost:8080**

### 2. Frontend Käivitamine

Ava uus käsurida aken ja mine `inventory-frontend` kausta:

```bash
cd inventory-frontend
```

Installeeri sõltuvused:

```bash
npm install
```

Käivita arendusserver:

```bash
npm run dev
```

Frontend käivitatakse tavaliselt aadressil: **http://localhost:5173**

## Rakenduse Kasutamine

Kui mõlemad teenused käivad, ava brauseris frontend aadress (**http://localhost:5173**). Frontend ühendub automaatselt backend serveriga API kutsete kaudu.
