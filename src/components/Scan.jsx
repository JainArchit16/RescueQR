import React, { useState } from 'react';
import image from '../assets/upload_image.png'

const Scan = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(image);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = () => {
        if (selectedFile) {
            const formData = new FormData();
            formData.append('file', selectedFile);
            console.log('Uploading file:', selectedFile);
        } else {
            console.log('No file selected');
        }
    };

    return (
        <div className='text-white flex'>
            <div className="text-white mx-[100px]  my-[50px] w-[40%] text-lg">
                <ul className="list-disc">

                    <li className="my-6">
                        <strong>Image Upload Feature : </strong>
                        <span>This is a feature on the website that allows you to upload images for scanning via an advanced AI system.</span>
                    </li>
                    <li className="my-6">
                        <strong>Comprehensive Analysis : </strong>
                        <span>Once you've submitted your image, it undergoes comprehensive analysis by the AI algorithm.</span>
                    </li>
                    <li className="my-6">
                        <strong>Access Granted : </strong>
                        <span>If your uploaded image meets the acceptance criteria set by the AI, you'll gain access to the required information.</span>
                    </li>
                    <li className="my-6">
                        <strong>Redirection on Failure : </strong>
                        <span>However, if your uploaded image doesn't meet the acceptance criteria, you'll be automatically redirected to an alternative page.</span>
                    </li>

                </ul>

            </div>

            <div className='flex mx-[30px] my-[100px] w-fit  h-fit border border-white py-10 rounded-lg'>
                {previewUrl && (
                    <img src={previewUrl} alt="Preview" className="mx-8" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                )}
                <div>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className='my-10'
                    />
                    <button onClick={handleUpload} className='mx-5 bg-blue-700 p-2 rounded-lg'>Upload</button>
                </div>
            </div>
        </div>
    );
};

export default Scan;

