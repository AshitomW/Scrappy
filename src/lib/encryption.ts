import crypto from "crypto";
import "server-only";

const ALGORITHM = "aes-256-cbc";

export function symmetricEncrypt(data: string) {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) throw new Error("Encryption Key Not Found!");

  const initVec = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    ALGORITHM,
    Buffer.from(key, "hex"),
    initVec
  );

  let encrypted = cipher.update(data);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return initVec.toString("hex") + ":" + encrypted.toString("hex");
}

export function symmetricDecrypt(data: string) {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) throw new Error("Encryption Key Not Found!");

  const textParts = data.split(":");
  const initVec = Buffer.from(textParts.shift() as string, "hex");
  const encryptedText = Buffer.from(textParts.join(":"), "hex");

  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(key, "hex"),
    initVec
  );

  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
