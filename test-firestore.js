import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function test() {
  try {
    await setDoc(doc(db, 'settings', 'test'), { hello: 'world' });
    console.log('Success');
  } catch(e) {
    console.error('Error:', e);
  }
}
test();
