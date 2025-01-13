import React from "react";

const uploadProfilePhoto = async (file) =>{
    const formData = new FormData();
    formData.append('profilePhoto', file);

    try{
        const response = await fetch('http://localhost:3000/upload',{
            method : 'POST',
            body: formData,
        });

        if(!response.ok){
            throw new Error('Failed to Upload')
        }

        const data = await response.join();
        return data;
    } catch(error){
        console.error('Error uploading file', error)
        throw error;
    }
}

export default uploadProfilePhoto;