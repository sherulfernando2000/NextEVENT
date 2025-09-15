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
