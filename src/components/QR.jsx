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
      <QRCode value={qrvalue} />
      <form onSubmit={handleSubmit}>
        <input type="text" name="textInput" />
        <button type="submit">Generate QR Code</button>
      </form>
    </div>
  );
};

export default QR;
