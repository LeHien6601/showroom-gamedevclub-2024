# Showroom GameDevClub 2024

## Firebase setup (local dev)

This project can load and store Unity game entries from Firestore. Thumbnails can be uploaded either to Firebase Storage or to an external image host (imgbb) to avoid Storage billing.

1. If you want to use Firebase Storage (not recommended if you're avoiding potential billing), enable Storage in Firebase and add the Storage-related env vars.

2. Alternatively you can use imgbb for image uploads (free tier). Add the following environment variables to a `.env` file at the project root (Vite will expose env vars prefixed with `VITE_`):

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...

# admin credentials used by the front-end submit form (simple client-side check)
VITE_ADMIN_USER=admin
VITE_ADMIN_PASS=changeme

# optional: imgbb API key for uploading thumbnails (see https://imgbb.com)
VITE_IMGBB_API_KEY=your_imgbb_api_key
```

If you set `VITE_IMGBB_API_KEY` the app will upload images to imgbb and store the returned URL in Firestore. If you leave it empty, the app will show a message telling you to configure it.

3. Install dependencies:

```
npm install
```

3. Install dependencies:

```
npm install
```

4. Run the dev server:

```
npm run dev
```

Security note: This example uses a simple client-side credential check (Vite env variables). For production, use Firebase Authentication and server-side rules. Also configure Firestore security rules to limit writes.


