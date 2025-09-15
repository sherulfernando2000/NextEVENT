import { auth, db } from '@/firebase';
import {
  collection,
  addDoc,
  getDocs,
  Timestamp,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
  DocumentReference,
  query,
  orderBy,
  onSnapshot, // Added for real-time updates option
  doc, // Added for doc reference by ID
  getDoc, // Added for single document retrieval
  updateDoc, // Added for updating documents
  deleteDoc, // Added for deleting documents
  DocumentData, // Added for updateDoc type hinting
  where
} from 'firebase/firestore';

import { Event } from '@/types/types';

// Dates will be stored as Firestore Timestamps, and optional fields as null if missing.
interface EventDbModel {
  title: string;
  imageUrl: string;
  date: Timestamp;
  startingTime: Timestamp;
  description: string | null;
  location: string | null;
  ticketprice: number | null;
  type: string | null;
  ticketQuantity: number;
  userId: string;
}

 //Create the FirestoreDataConverter
const eventConverter: FirestoreDataConverter<Event, EventDbModel> = {
  // Converts your app's Event object to the FirestoreDbModel for storage
  toFirestore(event: WithFieldValue<Event>): WithFieldValue<EventDbModel> {
    return {
      title: event.title,
      imageUrl: event.imageUrl,
      date: Timestamp.fromDate(event.date), // Convert Date to Timestamp
      startingTime: Timestamp.fromDate(event.startingTime), // Convert Date to Timestamp
      description: event.description ?? null, // Use null for undefined optional fields
      location: event.location ?? null,
      ticketprice: event.ticketprice ?? null,
      type: event.type ?? null,
      ticketQuantity: event.ticketQuantity,
      userId: event.userId ?? '', // Ensure userId is always a string
    };
  },
  // Converts a FirestoreDbModel snapshot back to your app's Event object
  fromFirestore(
    snapshot: QueryDocumentSnapshot<EventDbModel>,
    options: SnapshotOptions
  ): Event {
    const data = snapshot.data(options);
    return {
      id: snapshot.id, // Crucially, add the Firestore document ID to your app model
      title: data.title,
      imageUrl: data.imageUrl,
      date: data.date.toDate(), // Convert Timestamp back to Date
      startingTime: data.startingTime.toDate(), // Convert Timestamp back to Date
      description: data.description ?? undefined, // Convert null back to undefined for optional fields
      location: data.location ?? undefined,
      ticketprice: data.ticketprice ?? undefined,
      type: data.type ?? undefined,
      ticketQuantity: data.ticketQuantity,
      userId: data.userId,
    };
  },
};

// export const eventRef = collection(db,"events")

// This means all operations (addDoc, getDocs, onSnapshot) on this ref will use the converter.
export const eventCollectionRef = collection(db, "events").withConverter(eventConverter);

export async function addEvent(eventData: Omit<Event, 'id' |'startingTime'>) { // Use Omit if 'id' is purely for client-side representation or generated later
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("User must be logged in to add an event.");
    }

    // Combine eventData with the current user's ID
    const eventWithUserId: Omit<Event, 'id'> = {
      ...eventData,
      userId: currentUser.uid, // <--- Here's where the userId is added!
    };
    const docRef = await addDoc(eventCollectionRef, eventWithUserId);
     
    return docRef;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
}

export async function getEvents(): Promise<Event[]> {
  try {
    // Create a query to get all documents, ordered by 'date' (ascending)
    const q = query(eventCollectionRef, orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);

    const events: Event[] = [];
    querySnapshot.forEach((doc) => {
      // Thanks to the converter, doc.data() now directly returns an 'Event' object
      // with 'id', and Dates correctly converted!
      events.push(doc.data());
    });
    return events;
  } catch (e) {
    console.error("Error getting documents: ", e);
    throw e;
  }
}


// 7. New: getEventById function
export async function getEventById(id: string): Promise<Event | null> {
  try {
    // Get a reference to the specific document with the converter applied
    const docRef = doc(db, "events", id).withConverter(eventConverter);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // Thanks to the converter, docSnap.data() directly returns an 'Event' object
      // with 'id', and Dates correctly converted!
      return docSnap.data();
    } else {
      console.log("No such event document!");
      return null;
    }
  } catch (e) {
    console.error(`Error getting document with ID ${id}: `, e);
    throw e;
  }
}

// Helper function to prepare app-model data for Firestore update (DbModel format)
function prepareUpdateData(eventData: Partial<Omit<Event, 'id'>>): Partial<EventDbModel> {
  const dbModelUpdate: Partial<EventDbModel> = {};

  if (eventData.title !== undefined) dbModelUpdate.title = eventData.title;
  if (eventData.imageUrl !== undefined) dbModelUpdate.imageUrl = eventData.imageUrl;
  // Convert Date objects to Firestore Timestamp if they exist in the update
  if (eventData.date !== undefined) dbModelUpdate.date = Timestamp.fromDate(eventData.startingTime);
  if (eventData.startingTime !== undefined) dbModelUpdate.startingTime = Timestamp.fromDate(eventData.startingTime);
  // Convert undefined optional fields to null for Firestore storage
  if (eventData.description !== undefined) dbModelUpdate.description = eventData.description ?? null;
  if (eventData.location !== undefined) dbModelUpdate.location = eventData.location ?? null;
  if (eventData.ticketprice !== undefined) dbModelUpdate.ticketprice = eventData.ticketprice ?? null;
  if (eventData.type !== undefined) dbModelUpdate.type = eventData.type ?? null;
  if (eventData.ticketQuantity !== undefined) dbModelUpdate.ticketQuantity = eventData.ticketQuantity;

  return dbModelUpdate;
}

// 8. New: updateEvent function
export async function updateEvent(id: string, dataToUpdate: Partial<Omit<Event, 'id'>>): Promise<void> {
  try {
    // Get a reference to the specific document without the converter (for updateDoc)
    // The `updateDoc` method expects data that matches the Firestore structure directly,
    // so we need to manually convert Date objects to Timestamps if present in `dataToUpdate`.
    const eventDocRef = doc(db, "events", id);

    // Prepare the data to be in the EventDbModel format for Firestore
    const formattedData = prepareUpdateData(dataToUpdate);

    await updateDoc(eventDocRef, formattedData as DocumentData); // Cast to DocumentData to satisfy types
    console.log(`Document with ID ${id} successfully updated!`);
  } catch (e) {
    console.error(`Error updating document with ID ${id}: `, e);
    throw e;
  }
}

// 9. New: deleteEvent function
export async function deleteEvent(id: string): Promise<void> {
  try {
    // Get a reference to the specific document
    const eventDocRef = doc(db, "events", id);
    await deleteDoc(eventDocRef);
    console.log(`Document with ID ${id} successfully deleted!`);
  } catch (e) {
    console.error(`Error deleting document with ID ${id}: `, e);
    throw e;
  }
}

// Fetch Events by User ---
export async function getEventsByUser(userId: string): Promise<Event[]> {
  try {
    // Create a query that filters events by the 'userId' field
    // and also orders them, for example, by date in descending order.
    const q = query(
      eventCollectionRef,
      where("userId", "==", userId), // Filter by the provided userId
      orderBy("date", "desc")        // Order the results (optional, but good practice)
    );

    const querySnapshot = await getDocs(q);

    const events: Event[] = [];
    querySnapshot.forEach((doc) => {
      // The converter automatically handles mapping Firestore data to your 'Event' type
      events.push(doc.data());
    });
    return events;
  } catch (e) {
    console.error(`Error getting documents for user ${userId}: `, e);
    throw e;
  }
}
