import { auth } from '$lib/server/lucia'
import { handleHooks } from '@lucia-auth/sveltekit'
import type { Handle } from '@sveltejs/kit'

// a generic hook function, to customize
// export const customHandle: Handle = async ({resolve, event}) => {
//   return resolve(event)
// }

// if using a custom hook, then sequence them with handleHooks
// export const handle: Handle = sequence(handleHooks(auth), customHandle)
export const handle: Handle = handleHooks(auth)
