import type { DocumentData } from "firebase-admin/firestore";
import { getFirestore } from "../../../config/firebaseAdmin";

export const createDocument = async <T extends DocumentData>(
    collection: string,
    data: T,
): Promise<string> => {
    const db = getFirestore();
    const ref = await db.collection(collection).add(data);
    return ref.id;
};

export const getAllDocuments = async <T extends { id: string }>(
    collection: string,
): Promise<T[]> => {
    const db = getFirestore();
    const snapshot = await db.collection(collection).get();
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
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
    data: DocumentData,
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
