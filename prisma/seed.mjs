import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient()

async function seedUsers() {
  await prismaClient.user.create({
    data: {
      email: "user1@example.com",
      password: "user1password",
      username: "user1",
    }
  })
}


async function seedTags() {
  await prismaClient.tag.createMany({
    data: [
      {
        title: 'reactjs'
      },
      {
        title: 'angularjs'
      }
    ]
  })
}

async function seedArticles() {
  await prismaClient.article.create({
    data: {
      slug: 'test-article',
      title: 'Test Article',
      description: 'Test Article Description',
      body: 'Test Article Body',
      authorId: 1
    },
    include: {
      author: true
    }
  })
}


async function main() {
  try {
    await seedUsers()
  } catch (error) {
    console.error(error)
  }

  try {
    await seedTags()
  } catch (error) {
    console.error(error)
  }

  try {
    await seedArticles()
  } catch (error) {
    console.error(error)
  }
}

await main()
