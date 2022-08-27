import { writeFileSync } from 'fs'

interface CertificateLocation {
  certificate: string
  privateKey: string
}

export const writeCert: (location: CertificateLocation) => Promise<{ done: boolean }> = async (location: CertificateLocation) => {
  return await new Promise((resolve, reject) => {
    try {
      if ((process.env.MONGO_CERTIFICATE != null) && (process.env.MONGO_PRIVATE_KEY != null)) {
        writeFileSync(location.certificate, process.env.MONGO_CERTIFICATE ?? '')
        writeFileSync(location.privateKey, process.env.MONGO_PRIVATE_KEY ?? '')
        resolve({
          done: true
        })
      }
      reject(new Error('failed to create certificate'))
    } catch {
      reject(new Error('failed to create certificate'))
    }
  })
}
