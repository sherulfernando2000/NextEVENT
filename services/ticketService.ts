import { auth, db } from '@/firebase';
import { Event, TicketPurchase } from '@/types/types';
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
  documentId,
  where
} from 'firebase/firestore';
import { eventCollectionRef } from './eventService';

// --- NEW TICKET PURCHASE RELATED CODE ---

// Interface for how TicketPurchase data will be stored in Firestore
interface TicketPurchaseDbModel {
  userId: string;
  eventId: string;
  bookingId: string;
  purchaseDate: Timestamp;
  quantity: number;
  event?: Event;  
}

// Function to generate a simple unique booking ID (for demonstration)
// For production, consider a UUID library or a Cloud Function to ensure global uniqueness and prevent collisions.
function generateBookingId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// Create the FirestoreDataConverter for TicketPurchases
const ticketPurchaseConverter: FirestoreDataConverter<TicketPurchase, TicketPurchaseDbModel> = {
  toFirestore(purchase: WithFieldValue<TicketPurchase>): WithFieldValue<TicketPurchaseDbModel> {
    return {
      userId: purchase.userId,
      eventId: purchase.eventId,
      bookingId: purchase.bookingId,
      purchaseDate: Timestamp.fromDate(purchase.purchaseDate),
      quantity: purchase.quantity,
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot<TicketPurchaseDbModel>,
    options: SnapshotOptions
  ): TicketPurchase {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      userId: data.userId,
      eventId: data.eventId,
      bookingId: data.bookingId,
      purchaseDate: data.purchaseDate.toDate(),
      quantity: data.quantity,
    };
  },
};

export const ticketPurchaseCollectionRef = collection(db, "ticketPurchases").withConverter(ticketPurchaseConverter);


/**
 * Adds a new ticket purchase record to Firestore.
 * Automatically assigns the current user's ID and generates a bookingId and purchaseDate.
 */
export async function addTicketPurchase(
  purchaseData: Omit<TicketPurchase, 'id' | 'userId' | 'bookingId' | 'purchaseDate'>
): Promise<DocumentReference<TicketPurchase, TicketPurchaseDbModel>> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("User must be logged in to purchase tickets.");
    }

    const newTicketPurchase: Omit<TicketPurchase, 'id'> = {
      ...purchaseData,
      userId: currentUser.uid,
      bookingId: generateBookingId(), // Generate a unique booking ID
      purchaseDate: new Date(),       // Set current purchase date
      quantity: purchaseData.quantity || 1 // Default to 1 if not provided
    };

    const docRef = await addDoc(ticketPurchaseCollectionRef, newTicketPurchase);
    console.log("Ticket purchase document written with ID: ", docRef.id);
    return docRef;
  } catch (e) {
    console.error("Error adding ticket purchase: ", e);
    throw e;
  }
}

/**
 * Retrieves a single ticket purchase by its Firestore document ID.
 */
export async function getTicketPurchaseById(id: string): Promise<TicketPurchase | null> {
  try {
    const docRef = doc(db, "ticketPurchases", id).withConverter(ticketPurchaseConverter);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log(`No ticket purchase document with ID: ${id}`);
      return null;
    }
  } catch (e) {
    console.error(`Error getting ticket purchase with ID ${id}: `, e);
    throw e;
  }
}

/**
 * Retrieves all ticket purchases made by a specific user.
 */
// export async function getTicketPurchasesByUser(userId: string): Promise<TicketPurchase[]> {
//   try {
//     const q = query(
//       ticketPurchaseCollectionRef,
//       where("userId", "==", userId),
//       orderBy("purchaseDate", "desc") // Order by most recent purchases
//     );
//     const querySnapshot = await getDocs(q);
//     const purchases: TicketPurchase[] = [];
//     querySnapshot.forEach((doc) => { purchases.push(doc.data()); });
//     return purchases;
//   } catch (e) {
//     console.error(`Error getting ticket purchases for user ${userId}: `, e);
//     throw e;
//   }
// }

export async function getTicketPurchasesByUser(userId: string): Promise<TicketPurchase[]> {
  try {
    // 1. Fetch the TicketPurchase documents
    const purchasesQuery = query(
      ticketPurchaseCollectionRef,
      where("userId", "==", userId),
      orderBy("purchaseDate", "desc")
    );
    const purchaseSnapshot = await getDocs(purchasesQuery);

    const purchases: TicketPurchase[] = [];
    const eventIds: Set<string> = new Set(); // To store unique event IDs

    purchaseSnapshot.forEach((purchaseDoc) => {
      const purchase = purchaseDoc.data();
      purchases.push(purchase);
      eventIds.add(purchase.eventId); // Collect event IDs
    });

    // If no purchases or no event IDs, return early
    if (eventIds.size === 0) {
      return purchases;
    }

    // 2. Fetch the corresponding Event documents
    const uniqueEventIds = Array.from(eventIds);
    const eventsMap = new Map<string, Event>();

    // Firestore 'in' query has a limit of 10 values.
    // If you expect more than 10 unique event IDs, you'll need to batch these queries.
    // For simplicity, assuming less than or equal to 10 unique event IDs here.
    // If you have more, you'd loop and query in chunks of 10.
    if (uniqueEventIds.length > 0) {
        const eventsQuery = query(
            eventCollectionRef,
            where(documentId(), 'in', uniqueEventIds)
        );
        const eventSnapshot = await getDocs(eventsQuery);
        eventSnapshot.forEach((eventDoc) => {
            const event = eventDoc.data();
            eventsMap.set(event.id, event);
        });
    }


    // 3. Combine purchases with their respective event data
    const purchasesWithEvents = purchases.map((purchase) => {
      return {
        ...purchase,
        event: eventsMap.get(purchase.eventId), // Attach the event object
      };
    });

    return purchasesWithEvents;
  } catch (e) {
    console.error(`Error getting ticket purchases for user ${userId}: `, e);
    throw e;
  }
}



/**
 * Retrieves all ticket purchases for a specific event.
 */
export async function getTicketPurchasesByEvent(eventId: string): Promise<TicketPurchase[]> {
  try {
    const q = query(
      ticketPurchaseCollectionRef,
      where("eventId", "==", eventId),
      orderBy("purchaseDate", "asc") // Order by purchase date
    );
    const querySnapshot = await getDocs(q);
    const purchases: TicketPurchase[] = [];
    querySnapshot.forEach((doc) => { purchases.push(doc.data()); });
    return purchases;
  } catch (e) {
    console.error(`Error getting ticket purchases for event ${eventId}: `, e);
    throw e;
  }
}


export async function getTicketPurchasesByEvents(eventIds: string[]): Promise<TicketPurchase[]> {
  if (eventIds.length === 0) {
    return []; // Return empty array if no event IDs are provided
  }

  try {
    const allPurchases: TicketPurchase[] = [];
    const BATCH_SIZE = 10; // Firestore 'in' query limit

    // Process eventIds in batches of 10
    for (let i = 0; i < eventIds.length; i += BATCH_SIZE) {
      const batchEventIds = eventIds.slice(i, i + BATCH_SIZE);

      const q = query(
        ticketPurchaseCollectionRef,
        where("eventId", "in", batchEventIds), // Use 'in' operator for multiple eventIds
        orderBy("purchaseDate", "asc")         // Order by purchase date
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        allPurchases.push(doc.data());
      });
    }

    // You might want to deduplicate here if an eventId could appear in multiple batches
    // (though 'in' queries generally handle this if the initial eventIds array is unique)
    // A Set could be used if strict uniqueness is required after combining results from batches.

    return allPurchases;
  } catch (e) {
    console.error(`Error getting ticket purchases for multiple events: `, e);
    throw e;
  }
}

// Helper for updateTicketPurchase (assuming some fields might be updated, though less common for purchases)
function prepareUpdateTicketPurchaseData(
  purchaseData: Partial<Omit<TicketPurchase, 'id' | 'userId' | 'eventId' | 'bookingId' | 'purchaseDate'>>
): Partial<TicketPurchaseDbModel> {
  const dbModelUpdate: Partial<TicketPurchaseDbModel> = {};

  // For ticket purchases, updates are less common, but we'll include fields for completeness.
  // userId, eventId, bookingId are usually immutable. purchaseDate is also typically set once.
  if (purchaseData.quantity !== undefined) {
    dbModelUpdate.quantity = purchaseData.quantity;
  }

  return dbModelUpdate;
}


/**
 * Updates an existing ticket purchase record.
 * Note: Ticket purchases are often considered immutable, so update functionality might be limited
 * or handled by specific business logic (e.g., ticket cancellation logic that might mark a purchase invalid).
 */
export async function updateTicketPurchase(
  id: string,
  dataToUpdate: Partial<Omit<TicketPurchase, 'id' | 'userId' | 'eventId' | 'bookingId' | 'purchaseDate'>>
): Promise<void> {
  try {
    const ticketPurchaseDocRef = doc(db, "ticketPurchases", id);
    const formattedData = prepareUpdateTicketPurchaseData(dataToUpdate);

    if (Object.keys(formattedData).length > 0) { // Only update if there's actual data to update
      await updateDoc(ticketPurchaseDocRef, formattedData as DocumentData);
      console.log(`Ticket purchase document with ID ${id} successfully updated!`);
    } else {
      console.log(`No valid data provided to update ticket purchase with ID ${id}.`);
    }
  } catch (e) {
    console.error(`Error updating ticket purchase document with ID ${id}: `, e);
    throw e;
  }
}

/**
 * Deletes a ticket purchase record.
 * Similar to updates, deletions for purchases are often managed by business logic (e.g., refunds).
 * Ensure your Firestore Security Rules protect this carefully.
 */
export async function deleteTicketPurchase(id: string): Promise<void> {
  try {
    const ticketPurchaseDocRef = doc(db, "ticketPurchases", id);
    await deleteDoc(ticketPurchaseDocRef);
    console.log(`Ticket purchase document with ID ${id} successfully deleted!`);
  } catch (e) {
    console.error(`Error deleting ticket purchase document with ID ${id}: `, e);
    throw e;
  }
}

// --- OPTIONAL REAL-TIME LISTENERS FOR TICKET PURCHASES ---

export function subscribeToTicketPurchasesByUser(
  userId: string,
  callback: (purchases: TicketPurchase[]) => void,
  onError: (error: Error) => void
): () => void {
  const q = query(
    ticketPurchaseCollectionRef,
    where("userId", "==", userId),
    orderBy("purchaseDate", "desc")
  );

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const purchases: TicketPurchase[] = [];
    querySnapshot.forEach((doc) => { purchases.push(doc.data()); });
    callback(purchases);
  }, (error) => {
    console.error(`Error subscribing to ticket purchases for user ${userId}: `, error);
    onError(error);
  });
  return unsubscribe;
}

export function subscribeToTicketPurchasesByEvent(
  eventId: string,
  callback: (purchases: TicketPurchase[]) => void,
  onError: (error: Error) => void
): () => void {
  const q = query(
    ticketPurchaseCollectionRef,
    where("eventId", "==", eventId),
    orderBy("purchaseDate", "asc")
  );

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const purchases: TicketPurchase[] = [];
    querySnapshot.forEach((doc) => { purchases.push(doc.data()); });
    callback(purchases);
  }, (error) => {
    console.error(`Error subscribing to ticket purchases for event ${eventId}: `, error);
    onError(error);
  });
  return unsubscribe;
}   