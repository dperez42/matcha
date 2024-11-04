import CryptoJS from "crypto-js"

export default {
  encrypt (src) {
    const passphrase = import.meta.env.VITE_ENCRYPT
    return CryptoJS.AES.encrypt(src, passphrase).toString()
  },

  decrypt (src) {
    const passphrase = import.meta.env.VITE_ENCRYPT
    const bytes = CryptoJS.AES.decrypt(src, passphrase)
    const originalText = bytes.toString(CryptoJS.enc.Utf8)
    return originalText
  }
};
