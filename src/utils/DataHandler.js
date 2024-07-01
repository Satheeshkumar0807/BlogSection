import { storage, db , updateDoc, doc } from './firebase';
import firebase from 'firebase/compat/app';


const getDocumentCount = async () => {
    try {
      const snapshot = await db.collection('images').get();
      return snapshot.size; // returns the number of documents
    } catch (error) {
      console.error('Error getting document count:', error);
      throw error;
    }
  };


  const updateDocumentById = async (id, newData) => {
    try {
      // Ensure that the id is an integer
      if (!Number.isInteger(id)) {
        throw new Error('The provided id is not an integer');
      }
  
      // Step 1: Query the document with the specified id
      
      const querySnapshot = await db.collection('images').where('id', '==', id).get();
  
      if (querySnapshot.empty) {
        console.log('No matching documents.');
        return null;
      }
  
      // Step 2: Update the document with new data
      const document = querySnapshot.docs[0];
      const docRef = doc(db, 'images', document.id); // Get a reference to the document
      await updateDoc(docRef, newData);
  
      console.log('Document updated successfully');
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  };

  const updateData = async (id,image,newData) => {

    new Promise((resolve, reject) => {
        const storageRef = storage.ref();
        const fileRef = storageRef.child(`images/${image.name}`);
        const uploadTask = fileRef.put(image);
    
        uploadTask.on(
            'state_changed',
            (snapshot) => {},
            (error) => {
            console.error('Upload error:', error);
            reject(error);
            },
            async () => {
            try {

                const downloadURL = await fileRef.getDownloadURL();
                newData.url = downloadURL;
                newData.id = id;
                const oldblog = await getDocumentById(id);
                  
                const oldfileRef = storage.refFromURL(oldblog.url);
                    oldfileRef.delete().then(() => {
                    console.log("File Deleted")
                }).catch((error) => {
                    console.log("Error in deleting file")
                })
                await updateDocumentById(id, newData);
                resolve(downloadURL);
            } catch (error) {
                console.error('Error saving to Firestore:', error);
                reject(error);
            }
            }
        );
        }

    );
  };


    const updateWithoutImage = async (id,newData) => {
        try{
            await updateDocumentById(id, newData);
        }
        catch(error){
            console.error('Error updating to Firestore:', error);
        }
    }
  const getDocumentById = async (id) => {
    try {
      const querySnapshot = await db.collection('images').where('id', '==', id).get();
      
      if (querySnapshot.empty) {
        console.log('No matching documents.');
        return null;
      } 
  
      // Assuming there is only one document with the specified id
      const document = querySnapshot.docs[0];
      return document.data();
    } catch (error) {
      console.error('Error getting document by ID:', error);
      throw error;
    }
  };
  

const fetchBlogs = async () => {
    const res = await db.collection('images').get();
    const blogList = res.docs.map((doc) => doc.data());
    return blogList;
  };

const uploadImageAndSaveUrl = (image, additionalData) => {
    return new Promise((resolve, reject) => {
      const storageRef = storage.ref();
      const fileRef = storageRef.child(`images/${image.name}`);
      const uploadTask = fileRef.put(image);
  
      uploadTask.on(
        'state_changed',
        (snapshot) => {},
        (error) => {
          console.error('Upload error:', error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await fileRef.getDownloadURL();
            await db.collection('images').add({
              url: downloadURL,
              id: await getDocumentCount()+1,
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
              ...additionalData,
            });
            resolve(downloadURL);
          } catch (error) {
            console.error('Error saving to Firestore:', error);
            reject(error);
          }
        }
      );
    });
  };

  const deleteDocumentById = async (id) => {
    try {
      // Step 1: Query the document with the specified id
      const querySnapshot = await db.collection('images').where('id', '==', id).get();
  
      if (querySnapshot.empty) {
        console.log('No matching documents.');
        return null;
      }
  
      // Step 2: Delete the document
      const document = querySnapshot.docs[0];
      const docRef = doc(db, 'images', document.id); // Get a reference to the document
      const fileRef = storage.refFromURL(document.data().url);
        fileRef.delete().then(() => {
            console.log("File Deleted")
        }
        ).catch((error) => {
            console.log("Error in deleting file")
        })

      await db.collection('images').doc(docRef.id).delete();
  
      console.log('Document deleted successfully');
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }

export  {uploadImageAndSaveUrl, fetchBlogs, getDocumentById, getDocumentCount , updateData , updateWithoutImage , deleteDocumentById};