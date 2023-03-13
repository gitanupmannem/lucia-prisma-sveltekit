import { dev } from '$app/environment'
import { prisma } from '$lib/server/prisma'
import prismaAdapter from '@lucia-auth/adapter-prisma'
import lucia from 'lucia-auth'

export const auth = lucia({
  adapter: prismaAdapter(prisma),
  env: dev ? 'DEV' : 'PROD',
  // userData: db object of the user
  transformUserData: (userData) => {
    return {
      userId: userData.id,
      username: userData.username,
      name: userData.name
    }
  }
})

export type Auth = typeof auth