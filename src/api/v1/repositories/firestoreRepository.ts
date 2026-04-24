import { getFirestore } from "../../../config/firebaseAdmin";

/** Firestore field values (plain objects you pass to add/update). */
type FirestoreFields = Record<string, unknown>;

/** One document from a query (id + data). */
type DocSnap = {
    id: string;
    data: () => Record<string, unknown>;
};

const COUNTERS_COLLECTION = "_counters";
const memoryStore = new Map<string, Map<string, FirestoreFields>>();
const memoryCounters = new Map<string, number>();

const getMemoryCollection = (collection: string): Map<string, FirestoreFields> => {
    const existing = memoryStore.get(collection);
    if (existing) {
        return existing;
    }
    const created = new Map<string, FirestoreFields>();
    memoryStore.set(collection, created);
    return created;
};

const tryGetFirestore = () => {
    try {
        return getFirestore();
    } catch {
        return null;
    }
};

/** Next numeric id as a string ("1", "2", …). Stored in `_counters/{counterDocId}`. */
export const allocateSequentialId = async (counterDocId: string): Promise<string> => {
    const db = tryGetFirestore();
    if (!db) {
        const current = memoryCounters.get(counterDocId) ?? 0;
        const next = current + 1;
        memoryCounters.set(counterDocId, next);
        return String(next);
    }
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
    const db = tryGetFirestore();
    if (!db) {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const col = getMemoryCollection(collection);
        col.set(id, { ...data });
        return id;
    }
    const ref = await db.collection(collection).add(data);
    return ref.id;
};

/** Creates a document with a fixed id. Fails if that id already exists. */
export const createDocumentWithId = async (
    collection: string,
    id: string,
    data: FirestoreFields,
): Promise<string> => {
    const db = tryGetFirestore();
    if (!db) {
        const col = getMemoryCollection(collection);
        if (col.has(id)) {
            throw new Error(`Document already exists: ${collection}/${id}`);
        }
        col.set(id, { ...data });
        return id;
    }
    const ref = db.collection(collection).doc(id);
    await ref.create(data);
    return ref.id;
};

/**
 * Same id rules for every collection: `_counters/{collection}` gives "1", "2", …
 * within that collection only (categories, products, and orders each start at "1").
 */
export const createWithSequentialId = async (
    collection: string,
    data: FirestoreFields,
): Promise<string> => {
    const id = await allocateSequentialId(collection);
    await createDocumentWithId(collection, id, data);
    return id;
};

export const getAllDocuments = async <T extends { id: string }>(
    collection: string,
): Promise<T[]> => {
    const db = tryGetFirestore();
    if (!db) {
        const col = getMemoryCollection(collection);
        return Array.from(col.entries()).map(([id, data]) => ({
            id,
            ...data,
        })) as T[];
    }
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
    const db = tryGetFirestore();
    if (!db) {
        const col = getMemoryCollection(collection);
        const doc = col.get(id);
        if (!doc) {
            return null;
        }
        return { id, ...doc } as T;
    }
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
    const db = tryGetFirestore();
    if (!db) {
        const col = getMemoryCollection(collection);
        const existing = col.get(id);
        if (!existing) {
            throw new Error("Document not found");
        }
        col.set(id, { ...existing, ...data });
        return;
    }
    await db.collection(collection).doc(id).update(data);
};

export const deleteDocument = async (
    collection: string,
    id: string,
): Promise<void> => {
    const db = tryGetFirestore();
    if (!db) {
        const col = getMemoryCollection(collection);
        col.delete(id);
        return;
    }
    await db.collection(collection).doc(id).delete();
};
