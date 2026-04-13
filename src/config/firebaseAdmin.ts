import fs from "fs";
import path from "path";
import admin from "firebase-admin";

function tryInitFromJsonFile(filePath: string): boolean {
    const resolved = path.isAbsolute(filePath)
        ? filePath
        : path.join(process.cwd(), filePath);

    if (!fs.existsSync(resolved)) {
        return false;
    }

    const json = JSON.parse(fs.readFileSync(resolved, "utf8")) as admin.ServiceAccount;
    admin.initializeApp({
        credential: admin.credential.cert(json),
    });
    return true;
}

if (!admin.apps.length) {
    const fromEnv = process.env.FIREBASE_SERVICE_ACCOUNT_PATH?.trim();
    if (fromEnv && tryInitFromJsonFile(fromEnv)) {
        // ok
    } else {
        const defaultJson = path.join(
            process.cwd(),
            "back-end-assignments-2690b-firebase-adminsdk-fbsvc-97ca3ee0c5.json",
        );
        if (fs.existsSync(defaultJson)) {
            tryInitFromJsonFile(defaultJson);
        }
    }
}

if (!admin.apps.length) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

    if (projectId && clientEmail && privateKey) {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId,
                clientEmail,
                privateKey,
            }),
        });
    }
}

export function getFirestore(): admin.firestore.Firestore {
    if (!admin.apps.length) {
        throw new Error(
            "Firebase Admin is not initialized. Add your service account JSON to the project root, or set FIREBASE_SERVICE_ACCOUNT_PATH in .env, or set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.",
        );
    }
    return admin.firestore();
}

export function getAuth(): admin.auth.Auth {
    if (!admin.apps.length) {
        throw new Error(
            "Firebase Admin is not initialized. Cannot access Auth without credentials.",
        );
    }
    return admin.auth();
}
