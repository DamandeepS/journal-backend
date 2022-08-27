import { writeFileSync } from 'fs'

export const writeCert: (location: string) => Promise<{ done: boolean }> = async (location: string) => {
  return await new Promise((resolve, reject) => {
    try {
      writeFileSync(location, process.env.MONGO_CERTIFICATE ?? '')
      resolve({
        done: true
      })
    } catch {
      reject(new Error('failed to create certificate'))
    }
  })
}
