import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(config);
const storage = getStorage(app);

async function test() {
  try {
    const storageRef = ref(storage, 'test.txt');
    await uploadString(storageRef, 'Hello World');
    const url = await getDownloadURL(storageRef);
    console.log('Success:', url);
  } catch(e) {
    console.error('Error:', e);
  }
}
test();
