import { storage, db , updateDoc, doc } from './firebase';
import firebase from 'firebase/compat/app';

// Function to get the Blog ID for the next blog
const getBlogId = async () => {
    try {
      const maxRef = await db.collection('images').orderBy('id', 'desc').limit(1).get();
      const dataRef = maxRef.docs? maxRef.docs[0] : null;
      return dataRef? dataRef.data().id : 1;
    } catch (error) {
      console.error('Error getting document count:', error);
      throw error;
    }
  };

// Function to update the document with the specified id
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

  // Function to update the blog with the specified id
  const updateBlog = async (id,image,newData) => {

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
                // Get the download URL of the newly updated image
                const downloadURL = await fileRef.getDownloadURL();
                newData.url = downloadURL;
                newData.id = id;
                const oldblog = await getBlogById(id);
                // If the image is updated then delete the old image
                if (oldblog.url) {
                const oldfileRef = storage.refFromURL(oldblog.url);
                    oldfileRef.delete().then(() => {
                    console.log("File Deleted")
                }).catch((error) => {
                    console.log("Error in deleting file")
                })
                await updateDocumentById(id, newData);
                resolve(downloadURL);
              }
              // If the image is not updated then update the document with new data
              else{
                await updateDocumentById(id, newData);
                resolve(downloadURL);
              }
            } catch (error) {
                console.error('Error saving to Firestore:', error);
                reject(error);
            }
            }
        );
        }

    );
  };

  // Function to update the blog with the specified id without image
  const updateBlogWithoutImage = async (id,newData) => {
        try{
            await updateDocumentById(id, newData);
        }
        catch(error){
            console.error('Error updating to Firestore:', error);
        }
  }

  // Function to get the blog by the specified id
  const getBlogById = async (id) => {
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
  
// Function to get all the blogs
const getBlogs = async () => {
    const res = await db.collection('images').get();
    const blogList = res.docs.map((doc) => doc.data());
    return blogList;
  };

// Function to upload the draft
const uploadDraft = async (image, additionalData) => {
  //
  if (image){
    const storageRef = storage.ref();
    const fileRef = storageRef.child(`images/${image.name}`);
    const uploadTask = fileRef.put(image);

    uploadTask.on(
      'state_changed',
      (snapshot) => {},
      (error) => {
        console.error('Upload error:', error);
      },
      async () => {
        try {
          const downloadURL = await fileRef.getDownloadURL();
          await db.collection('images').add({
            url: downloadURL,
            id: await getBlogId()+1,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            ...additionalData,
          });
          return "Draft Uploaded Successfully..!"
        } catch (error) {
          console.error('Error saving to Firestore:', error);
          return "Error in uploading draft..! Please try again..!"
        }
      }
    );
  }
  else{
    await db.collection('images').add({
    id: await getBlogId()+1,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    url:"",
    ...additionalData,
  })
    return "Draft Uploaded Successfully..!"
  ;
}
};

// Function to get the upload blog 
const uploadBlog = async (image, additionalData) => {
    return new Promise( (resolve, reject) => {
      if (image){
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
              id: await getBlogId()+1,
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
    }
    });
  };
  // Function to delete the blog with the specified id
  const deleteBlog = async (id) => {
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
      if (document.data().url!==""){
      const fileRef = storage.refFromURL(document.data().url);
        fileRef.delete().then(() => {
            console.log("File Deleted")
        }
        ).catch((error) => {
            console.log("Error in deleting file")
        })
      }

      await db.collection('images').doc(docRef.id).delete();
  
      console.log('Document deleted successfully');
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }

  // Function to approve the blog with the specified id
  const approveBlog = async (id) => {
    try {
      // Step 1: Query the document with the specified id
      const querySnapshot = await db.collection('images').where('id', '==', id).get();
  
      if (querySnapshot.empty) {
        console.log('No matching documents.');
        return null;
      }
  
      // Step 2: Update the document with new data
      const document = querySnapshot.docs[0];
      const docRef = doc(db, 'images', document.id); // Get a reference to the document
      await updateDoc(docRef, {status: "approved"});
  
      console.log('Document approved successfully');
    } catch (error) {
      console.error('Error approving document:', error);
      throw error;
    }
  }

  // Function to rework the blog with the specified id
  const reworkBlog = async (id) => {
    try {
      // Step 1: Query the document with the specified id
      const querySnapshot = await db.collection('images').where('id', '==', id).get();
  
      if (querySnapshot.empty) {
        console.log('No matching documents.');
        return null;
      }
  
      // Step 2: Update the document with new data
      const document = querySnapshot.docs[0];
      const docRef = doc(db, 'images', document.id); // Get a reference to the document
      await updateDoc(docRef, {status: "rework"});
  
      console.log('Document reworked successfully');
    } catch (error) {
      console.error('Error reworking document:', error);
      throw error;
    }
  }

  // Function to make the blog pending with the specified id
  const pendingBlog = async (id) => {
    try {
      // Step 1: Query the document with the specified id
      const querySnapshot = await db.collection('images').where('id', '==', id).get();
  
      if (querySnapshot.empty) {
        console.log('No matching documents.');
        return null;
      }
  
      // Step 2: Update the document with new data
      const document = querySnapshot.docs[0];
      const docRef = doc(db, 'images', document.id); // Get a reference to the document
      await updateDoc(docRef, {status: "pending"});
  
      console.log('Document pending successfully');
    } catch (error) {
      console.error('Error pending document:', error);
      throw error;
    }
  }

export  {uploadBlog, getBlogs, getBlogById, getBlogId, updateBlog, updateBlogWithoutImage, deleteBlog, uploadDraft, approveBlog, reworkBlog, pendingBlog};