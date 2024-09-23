import { Injectable } from '@angular/core';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class ChatAreaService {
  constructor() {}

  setNoteObject(obj: any, id: string) {
    return {
      id: id,
      uid: obj.uid || '',
      message: obj.message || '',
      weekday: obj.weekday || '',
      year: obj.year || '',
      month: obj.month || '',
      day: obj.day || '',
      hour: obj.hour || '',
      minute: obj.minute || '',
      seconds: obj.seconds || '',
      milliseconds: obj.milliseconds || '',
      user: obj.user || '',
      fileUrl: obj.fileUrl || '',
      fileName: obj.fileName || '',
      threadCount: obj.threadCount || '',
      checkMark: obj.checkMark || '',
      handshake: obj.handshake || '',
      thumbsUp: obj.thumbsUp || '',
      thumbsDown: obj.thumbsDown || '',
      rocket: obj.rocket || '',
      nerdFace: obj.nerdFace || '',
      noted: obj.noted || '',
      shushingFace: obj.shushingFace || '',
    };
  }

  setNoteChannel(obj: any, id: string) {
    return {
      id: id,
      channelCreatorUid: obj.channelCreatorUid || '',
      creationsDate: obj.creationsDate || '',
      description: obj.description || '',
      images: obj.images || '',
      name: obj.name || '',
      uids: obj.uids || '',
    };
  }

  setNoteObjectUser(obj: any, id: string) {
    return {
      email: obj.email || '',
      image: obj.image || '',
      name: obj.name || '',
      uid: obj.uid || '',
    };
  }

  getMonthName(monthNumber: number): string {
    const months: string[] = [
      'Januar',
      'Februar',
      'März',
      'April',
      'Mai',
      'Juni',
      'Juli',
      'August',
      'September',
      'Oktober',
      'November',
      'Dezember',
    ];

    if (monthNumber < 1 || monthNumber > 12) {
      throw new Error(
        'Ungültige Monatszahl. Bitte geben Sie eine Zahl zwischen 1 und 12 ein.'
      );
    }

    return months[monthNumber - 1];
  }

  getFormattedTime(hour: any, minute: any): any {
    const hours = hour.toString().padStart(2, '0');
    const minutes = minute.toString().padStart(2, '0');
    return `${hours}:${minutes} Uhr`;
  }

  async updateMessageVariable(
    messageId: any,
    newValue: any,
    variableName: any,
    src: any
  ) {
    const [firestoreInstance, ...pathSegments] = src;

    const messageRef = doc(firestoreInstance, ...pathSegments);
    try {
      // Get the current value of the variable
      const messageSnapshot = await getDoc(messageRef);
      if (messageSnapshot.exists()) {
        // Typisieren des zurückgegebenen Objekts als ein einfaches Dictionary
        const currentData = messageSnapshot.data() as { [key: string]: any };

        let currentValue = currentData[variableName] || '';

        // Convert currentValue to an array of values
        let valuesArray = currentValue.split(' ').filter((value: any) => value);

        if (valuesArray.includes(newValue)) {
          // Remove the newValue if it exists
          valuesArray = valuesArray.filter((value: any) => value !== newValue);
        } else {
          // Append the new value with a space if it doesn't exist
          valuesArray.push(newValue);
        }

        // Join the array back to a string
        const updatedValue = valuesArray.join(' ');

        // Update the document with the new value
        await updateDoc(messageRef, {
          [variableName]: updatedValue,
        });
        console.log('Document successfully updated!');
      } else {
        console.log('No such document!');
      }
    } catch (err) {
      console.error('Error updating document: ', err);
    }
  }
}
