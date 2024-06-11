import React from 'react';
import QRCode from 'qrcode.react';

function QRCodeComponent() {
    // Handle redirection after QR code scanning
    const handleRedirect = () => {
        window.location.href = '/home';
    };

    return (
        <div style={styles.container}>
            <QRCode value="http://google.com" size={256} onClick={handleRedirect} />
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f0f0',
    },
};

export default QRCodeComponent;
