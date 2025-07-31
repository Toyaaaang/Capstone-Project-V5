import { redis } from "@/lib/redis"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return new Response("Unauthorized", { status: 401 })

  const { readable, writable } = new TransformStream()
  const writer = writable.getWriter()
  const encoder = new TextEncoder()

  const userChannel = `user:${session.user.id}`
  const roleChannel = session.user.role ? `role:${session.user.role}` : null

  let isClosed = false
  req.signal?.addEventListener("abort", () => {
    isClosed = true
    writer.close()
  })

  const poll = async () => {
    while (!isClosed) {
      const [userNotifs, roleNotifs] = await Promise.all([
        redis.lpop(userChannel),
        roleChannel ? redis.lpop(roleChannel) : Promise.resolve(null),
      ])

      const messages = [userNotifs, roleNotifs].filter(Boolean)
      for (const message of messages) {
        writer.write(encoder.encode(`data: ${JSON.stringify(message)}\n\n`))
      }

      await new Promise((res) => setTimeout(res, 2000))
    }
  }

  poll()

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
