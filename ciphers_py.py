from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import padding
from cryptography.hazmat.backends import default_backend
import os
import base64

# Generate a random key and IV (Initialization Vector)
key = os.urandom(32)  # 256-bit key for AES-256
iv = os.urandom(16)   # AES block size is 16 bytes

# Function to encrypt a message
def encrypt_message(message, key, iv):
    # Pad the message to be a multiple of the block size
    padder = padding.PKCS7(algorithms.AES.block_size).padder()
    padded_data = padder.update(message.encode()) + padder.finalize()
    
    # Encrypt the padded message
    cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
    encryptor = cipher.encryptor()
    ciphertext = encryptor.update(padded_data) + encryptor.finalize()
    
    # Encode the ciphertext and IV as Base64 for easier transmission
    return base64.b64encode(iv + ciphertext).decode()

# Function to decrypt a message
def decrypt_message(encoded_ciphertext, key):
    # Decode the base64-encoded ciphertext and extract IV
    data = base64.b64decode(encoded_ciphertext)
    iv = data[:16]  # Extract the first 16 bytes as IV
    ciphertext = data[16:]  # Rest is the actual ciphertext
    
    # Decrypt the message
    cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
    decryptor = cipher.decryptor()
    padded_message = decryptor.update(ciphertext) + decryptor.finalize()
    
    # Unpad the decrypted message
    unpadder = padding.PKCS7(algorithms.AES.block_size).unpadder()
    message = unpadder.update(padded_message) + unpadder.finalize()
    
    return message.decode()

# Example usage
message = "Hello, this is a secret message!"
print("Original message:", message)

encrypted_message = encrypt_message(message, key, iv)
print("Encrypted message:", encrypted_message)

decrypted_message = decrypt_message(encrypted_message, key)
print("Decrypted message:", decrypted_message)
