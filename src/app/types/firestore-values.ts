export interface FirestoreString {
  stringValue: string;
}

export interface FirestoreTimestamp {
  timestampValue: string;
}

export interface FirestoreArray {
  arrayValue: {
    values: FirestoreString[];
  };
}
