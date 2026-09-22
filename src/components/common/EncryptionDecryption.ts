import CryptoJS from "crypto-js";

const secretKey: string | undefined = import.meta.env.VITE_SECRET_KEY;

// Encryption stays DISABLED until a secret key is provided via .env:
//   VITE_SECRET_KEY=your-secret-here
// Without it, these helpers pass values through untouched (plain localStorage),
// so login and every decryptData/decryptId call site keeps working.
const isEncryptionEnabled: boolean = Boolean(secretKey);

if (!isEncryptionEnabled) {
  console.warn(
    "VITE_SECRET_KEY is not set - localStorage encryption is disabled."
  );
}

export const encryptId = (id: string | number | null | undefined): string => {
  if (!id) {
    console.error("ID is missing");
    return "";
  }
  if (!isEncryptionEnabled) return id.toString();
  return CryptoJS.AES.encrypt(id.toString(), secretKey as string).toString();
};

export const decryptId = (
  encryptedId: string | null | undefined
): string => {
  try {
    if (!encryptedId) {
      console.error("Encrypted ID is missing");
      return "";
    }
    if (!isEncryptionEnabled) return encryptedId;
    const bytes = CryptoJS.AES.decrypt(encryptedId, secretKey as string);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error: any) {
    console.error("Decryption Error:", error);
    return "";
  }
};
//Token User Name and User Id encrypted
export const encryptData = (
  data: string | number | null | undefined
): string => {
  if (!data) return "";
  if (!isEncryptionEnabled) return data.toString();
  return CryptoJS.AES.encrypt(data.toString(), secretKey as string).toString();
};

// Decrypt data
export const decryptData = (
  encryptedData: string | null | undefined
): string => {
  try {
    if (!encryptedData) return "";
    if (!isEncryptionEnabled) return encryptedData;
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey as string);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error: any) {
    console.error("Decryption Error:", error);
    return "";
  }
};
