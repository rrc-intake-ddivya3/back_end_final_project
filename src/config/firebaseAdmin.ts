import fs from "fs";
import path from "path";
import admin from "firebase-admin";
 
let firebaseInitError: string | null = null;

function initializeFirebaseAdmin(): void {
    if (admin.apps.length) {
        return;
    }
 
    console.log("FIREBASE_SERVICE_ACCOUNT_PATH:", process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
 
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH?.trim();
 
    if (serviceAccountPath) {
        const resolvedPath = path.isAbsolute(serviceAccountPath)
            ? serviceAccountPath
            : path.resolve(__dirname, "../../", serviceAccountPath);
 
        console.log("Resolved Firebase path:", resolvedPath);
 
        if (fs.existsSync(resolvedPath)) {
            const serviceAccount = JSON.parse(
                fs.readFileSync(resolvedPath, "utf8"),
            ) as admin.ServiceAccount;
 
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
 
            console.log(`Firebase Admin initialized using JSON file: ${resolvedPath}`);
            return;
        }
 
        console.warn(`Firebase service account file not found at: ${resolvedPath}`);
    }
 
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
 
        console.log("Firebase Admin initialized using environment variables");
        return;
    }
 
    firebaseInitError =
        "Firebase Admin is not initialized. Provide FIREBASE_SERVICE_ACCOUNT_PATH or FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.";
    console.warn(firebaseInitError);
}
 
initializeFirebaseAdmin();
 
export function getFirestore(): admin.firestore.Firestore {
    if (!admin.apps.length) {
        throw new Error(
            firebaseInitError ?? "Firebase Admin is not initialized. Cannot access Firestore.",
        );
    }
 
    return admin.firestore();
}
 
export function getAuth(): admin.auth.Auth {
    if (!admin.apps.length) {
        throw new Error(
            firebaseInitError ?? "Firebase Admin is not initialized. Cannot access Auth.",
        );
    }
 
    return admin.auth();
}

export function isFirebaseAdminInitialized(): boolean {
    return admin.apps.length > 0;
}
 
export default admin;