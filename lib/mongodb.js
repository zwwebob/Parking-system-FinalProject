import { MongoClient } from 'mongodb';

const uri = 'mongodb://localhost:27017';
const options = {};

let client;
let clientPromise;

if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export async function connectToDatabase() {
    const client = await clientPromise;
    const db = client.db('parking_system');
    return { db, client };
}