export interface Event {
  // We'll let Firestore generate the document ID,
  // but if you need an internal ID, you can keep this field
  id?: string;
  title: string;
  imageUrl: string; // Storing the URL here
  date: Date; // Firestore will convert this to a Timestamp
  startingTime?: Date;
  description?: string;
  location?: string;
  ticketprice?: number;
  type?: string;
  ticketQuantity: number;
  userId?: string; 
}

export interface EventDbModel {
  title: string;
  imageUrl: string;
  date: Timestamp;
  startingTime: Timestamp;
  description: string | null;
  location: string | null;
  ticketprice: number | null;
  type: string | null;
  ticketQuantity: number;
}


export interface TicketPurchase {
  id?: string;             // Firestore document ID (optional for new)
  userId: string;          // FK to User(id) - The user who bought the ticket
  eventId: string | undefined;         // FK to Event(id) - The event the ticket is for
  bookingId: string;       // Unique ID, e.g., for QR code (will be generated)
  purchaseDate: Date;      // When the ticket was purchased
  quantity: number;        // Number of tickets purchased in this transaction (default 1)
}