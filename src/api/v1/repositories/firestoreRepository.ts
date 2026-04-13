import { getFirestore } from "../../../config/firebaseAdmin";

/** Firestore field values (plain objects you pass to add/update). */
type FirestoreFields = Record<string, unknown>;

/** One document from a query (id + data). */
type DocSnap = {
    id: string;
    data: () => Record<string, unknown>;
};

const COUNTERS_COLLECTION = "_counters";

/** Next numeric id as a string ("1", "2", …). Stored in `_counters/{counterDocId}`. */
export const allocateSequentialId = async (counterDocId: string): Promise<string> => {
    const db = getFirestore();
    const counterRef = db.collection(COUNTERS_COLLECTION).doc(counterDocId);
    return db.runTransaction(async (tx) => {
        const snap = await tx.get(counterRef);
        const current = snap.exists ? Number(snap.data()?.next ?? 0) : 0;
        const next = current + 1;
        tx.set(counterRef, { next }, { merge: true });
        return String(next);
    });
};

export const createDocument = async (
    collection: string,
    data: FirestoreFields,
): Promise<string> => {
    const db = getFirestore();
    const ref = await db.collection(collection).add(data);
    return ref.id;
};

/** Creates a document with a fixed id. Fails if that id already exists. */
export const createDocumentWithId = async (
    collection: string,
    id: string,
    data: FirestoreFields,
): Promise<string> => {
    const db = getFirestore();
    const ref = db.collection(collection).doc(id);
    await ref.create(data);
    return ref.id;
};

export const getAllDocuments = async <T extends { id: string }>(
    collection: string,
): Promise<T[]> => {
    const db = getFirestore();
    const snapshot = await db.collection(collection).get();
    const docs = snapshot.docs as unknown as DocSnap[];
    return docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
    })) as T[];
};

export const getDocById = async <T extends { id: string }>(
    collection: string,
    id: string,
): Promise<T | null> => {
    const db = getFirestore();
    const doc = await db.collection(collection).doc(id).get();
    if (!doc.exists) {
        return null;
    }
    return { id: doc.id, ...doc.data() } as T;
};

export const updateDocument = async (
    collection: string,
    id: string,
    data: FirestoreFields,
): Promise<void> => {
    const db = getFirestore();
    await db.collection(collection).doc(id).update(data);
};

export const deleteDocument = async (
    collection: string,
    id: string,
): Promise<void> => {
    const db = getFirestore();
    await db.collection(collection).doc(id).delete();
};
