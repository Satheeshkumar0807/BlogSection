import React, { useState, useEffect } from 'react';
import { db, storage } from './utils/firebase';
import './App.css';

function Demo() {
  const [image, setImage] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      const res = await storage.ref("images").listAll();
      const imageList = await Promise.all(
        res.items.map(async (itemRef) => {
          const url = await itemRef.getDownloadURL();
          return {
            name: itemRef.name,
            url: url
          };
        })
      );
      setImages(imageList);
    };

    fetchImages();
  }, []);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = async (image) => {
    try {
      const uploadTask = storage.ref(`images/${image.name}`).put(image);
      await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // You can add progress logic here
          },
          (error) => reject(error),
          () => {
            storage.ref("images").child(image.name).getDownloadURL().then((url) => {
              resolve({ name: image.name, url });
            }).catch(reject);
          }
        );
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleSave = async () => {
    if (image) {
      try {
        const uploadedImage = await handleUpload(image);
        setImages((prevImages) => [...prevImages, uploadedImage]);
        setImage(null);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  return (
    <div className="App h-full w-full flex flex-col items-center">  
      <input type="file" onChange={handleChange} />
      <button onClick={handleSave} disabled={!image}>Upload</button>
      <div className="flex flex-wrap">
        {images.map((image, index) => (
          <div key={index} className="m-2">
            <img src={image.url} className="h-20 w-20 object-cover" alt={image.name} />
            <p>{image.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Demo;
