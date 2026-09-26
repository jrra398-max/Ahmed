# NOIR — 3D Interactive Brand Experience

## Run
npm install
npm run dev

## Build
npm run build

## Architecture
- React + Vite
- Three.js / React Three Fiber / Drei
- Zustand persisted bag
- Framer Motion
- Modular brand config
- Local demo order persistence

## Production backend
The UI and state architecture are ready to connect to Supabase/PostgreSQL. Replace the local order persistence in `src/App.jsx` with authenticated server API calls before production use.

## WhatsApp
Change `whatsappNumber` in `src/config/brand.js` to the real business number.

## 3D assets
Replace procedural demo clothing/store pieces with optimized GLB/GLTF assets under `public/assets/models` and wire them into the product schema.
