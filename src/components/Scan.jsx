import React, { useState } from 'react';

const Scan = () => {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        setSelectedFile(file);
    };

    const handleUpload = () => {
        if (selectedFile) {

            console.log('Uploading file:', selectedFile);
        } else {
            console.log('No file selected');
        }
    };

    return (
        <div>
            
            <div className='text-white my-[2%] mx-[30%] w-[70%] h-[80%]'>
                {selectedFile && (
                    <div className='my-2 px-5 py-3 w-[60%] h-[30%] rounded-lg  border border-blue-700'>
                        <h2 className='text-3xl my-2'>Selected Image:</h2>
                        <img src={URL.createObjectURL(selectedFile)} alt="Selected" className='my-2 ' />
                    </div>
                )}
                <div className='flex my-4'>
                    <input type="file" onChange={handleFileChange} className='border px-2 py-2 w-fit mx-6 rounded-lg' />
                    <button onClick={handleUpload} className='bg-blue-700 px-3 py-2 border rounded-lg'>Scan</button>
                </div>
            </div>
            <div className='text-white my-[6%] mx-[30%] w-[550px] h-[80%] text-center text-lg'>
                To upload an image, simply click on the "Upload Image" button, then select your desired image file from your device. After choosing the image, wait for it to upload. Once uploaded, you can preview the image if available. Follow any further instructions provided on the website, as additional actions may be required. Please note that information associated with the uploaded image will only become available after our AI system scans and approves it. Once the process is complete, you will be direct to uour desired location!

            </div>
        </div>
    );
};

export default Scan;
