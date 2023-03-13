import { prisma } from '$lib/server/prisma';
import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  return {
    articles: await prisma.article.findMany()
  }
};

export const actions: Actions = {
  createArticle: async ({ request, locals }) => {
    const { user, session } = await locals.validateUser()
    if (!(user && session)) {
      throw redirect(302, '/')
    }

    // get title and content from formdata
    const { title, content } = Object.fromEntries(await request.formData()) as { title: string, content: string }

    // create new article in db
    try {
      await prisma.article.create({
        data: {
          title,
          content,
          userId: user.userId
        }
      })
    } catch (err) {
      console.error(err)
      return fail(500, { message: 'Could not create article' })
    }

    return {
      status: 201,

    }
  },

  deleteArticle: async ({ url, locals }) => {
    const { user, session } = await locals.validateUser()
    if (!(user && session)) {
      throw redirect(302, '/')
    }

    // id of the article to delete from url
    const id = url.searchParams.get('id')
    if (!id) {
      return fail(400, { message: 'Invalid request' })
    }

    try {
      // get the article to delete from db
      const article = await prisma.article.findUniqueOrThrow({
        where: {
          id: Number(id)
        }
      })

      // check if article to be deleted is owned by the user
      if (article.userId !== user.userId) {
        throw error(403, 'Not Authorized')
      }

      await prisma.article.delete({
        where: {
          id: Number(id)
        }
      })
    } catch (err) {
      return fail(500, { message: 'Something went wrong deleting the article' })
    }

    return {
      status: 200
    }
  }
}