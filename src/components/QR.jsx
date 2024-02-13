import React, { useState } from 'react';
import QRCode from 'react-qr-code';

const QR = () => {

  const [qrvalue, setQRvalue] = useState('');
  const [text, setText] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setText(event.target.elements.textInput.value);
    setQRvalue('http://localhost:3000/dashboard/my-profile');
  };

  return (

    <div>
      <div className='text-white h-fit w-full mx-[36%] '>
        <h1 className='text-4xl'>Create a QR for your Car</h1>
      </div>
      <div className='px-16  border border-solid rounded-lg w-1/4 h-1/2 mx-auto my-14'>
        <div className='my-11'>
          <QRCode value={qrvalue} />
        </div>
        <form onSubmit={handleSubmit} className='my-8'>
          <input type="text" name="textInput" placeholder='Enter your Emial ID' />
          <button type="submit" className='my-4 text-white border border-blue-500 rounded-lg px-2 py-2 bg-blue-500'>Generate QR Code</button>
        </form>
      </div>

    </div>
  );
};

export default QR;
