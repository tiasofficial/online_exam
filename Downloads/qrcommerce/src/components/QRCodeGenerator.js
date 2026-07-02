import React from 'react';
import QRCode from 'qrcode.react';

const QRCodeGenerator = ({ data }) => {
  return (
    <div>
      <h2>QR Code</h2>
      <QRCode value={data} />
    </div>
  );
};

export default QRCodeGenerator;

