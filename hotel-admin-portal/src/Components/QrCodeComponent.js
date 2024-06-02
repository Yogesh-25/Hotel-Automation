// src/QrCodeComponent.js

import React from 'react';
import QRCode from 'qrcode.react';

const QrCodeComponent = () => {
    return (
        <div style={styles.container}>
            <QRCode value="http://localhost:3000" size={256} />
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f0f0',
    },
};

export default QrCodeComponent;
