<!DOCTYPE html>
<html>
<head>
    <title>AES Encryption and Decryption with CryptoJS</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"></script>
</head>
<body>
    <script>
        // Key and IV (Initialization Vector) - Same as in Python
        var key = CryptoJS.enc.Base64.parse('your_base64_encoded_key_here'); // Use the actual key from Python
        var iv = CryptoJS.enc.Base64.parse('your_base64_encoded_iv_here');   // Use the actual IV from Python

        // Encrypt message
        function encryptMessage(message) {
            var encrypted = CryptoJS.AES.encrypt(message, key, { iv: iv });
            return encrypted.toString();
        }

        // Decrypt message
        function decryptMessage(encryptedMessage) {
            var decrypted = CryptoJS.AES.decrypt(encryptedMessage, key, { iv: iv });
            return decrypted.toString(CryptoJS.enc.Utf8);
        }

        var message = "Hello, this is a secret message!";
        console.log("Original message:", message);

        var encryptedMessage = encryptMessage(message);
        console.log("Encrypted message:", encryptedMessage);

        var decryptedMessage = decryptMessage(encryptedMessage);
        console.log("Decrypted message:", decryptedMessage);
    </script>
</body>
</html>
