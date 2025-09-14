import React from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../Firebase/config';

const UploadImage = async (imageUrl, setUploading, handleAddMain) => {
    setUploading(true);
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const storageRef = ref(storage, `images/${Date.now()}`);
    const uploadTask = uploadBytesResumable(storageRef, blob);
  
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        console.log(
          `Progress: ${(snapshot.bytesTransferred / snapshot.totalBytes) * 100}%`
        );
      },
      (error) => {
        console.log(error);
        setUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
        
          handleAddMain(downloadURL)
          setUploading(false);
          console.log(downloadURL)
          
        });
      }
    );
};

export default UploadImage;
