function simpleEncrypt(text: string): string {
  // Base64 encode with a simple transformation (not secure, but works for demo)
  const encoded = Buffer.from(text).toString("base64")
  return encoded
}

function simpleDecrypt(encryptedText: string): string {
  // Base64 decode
  try {
    return Buffer.from(encryptedText, "base64").toString("utf8")
  } catch {
    throw new Error("Invalid encrypted data")
  }
}

// Use environment variable for the encryption key or generate a default one
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "wedding-admin-encryption-key-32char"

export async function encrypt(text: string): Promise<string> {
  try {
    // Try to use Node.js crypto if available
    const { randomBytes, createCipheriv } = await import("crypto")

    // Ensure the key is 32 bytes (256 bits)
    const key = Buffer.from(ENCRYPTION_KEY.padEnd(32).slice(0, 32))

    // Generate a random initialization vector
    const iv = randomBytes(16)

    // Create cipher
    const cipher = createCipheriv("aes-256-cbc", key, iv)

    // Encrypt the text
    let encrypted = cipher.update(text, "utf8", "hex")
    encrypted += cipher.final("hex")

    // Return IV + encrypted data
    return iv.toString("hex") + ":" + encrypted
  } catch (error) {
    // Fallback to simple encoding if crypto is not available
    console.warn("Crypto module not available, using simple encoding")
    return simpleEncrypt(text)
  }
}

export async function decrypt(encryptedText: string): Promise<string> {
  try {
    // Check if it's the new format with IV
    if (encryptedText.includes(":")) {
      const { createDecipheriv } = await import("crypto")

      // Ensure the key is 32 bytes (256 bits)
      const key = Buffer.from(ENCRYPTION_KEY.padEnd(32).slice(0, 32))

      // Split IV and encrypted data
      const [ivHex, encrypted] = encryptedText.split(":")
      const iv = Buffer.from(ivHex, "hex")

      // Create decipher
      const decipher = createDecipheriv("aes-256-cbc", key, iv)

      // Decrypt the data
      let decrypted = decipher.update(encrypted, "hex", "utf8")
      decrypted += decipher.final("utf8")

      return decrypted
    } else {
      // Fallback to simple decoding
      return simpleDecrypt(encryptedText)
    }
  } catch (error) {
    // Fallback to simple decoding if crypto fails
    console.warn("Crypto decryption failed, trying simple decoding")
    return simpleDecrypt(encryptedText)
  }
}
