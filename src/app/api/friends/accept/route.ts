import { fetchRedis } from "@/app/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { id: idToAdd } = z.object({ id: z.string() }).parse(body);

    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorised", { status: 401 });
    }

    //  verify if the sender isn't already a friend
    const isAlreadyFriends = await fetchRedis(
      "sismember",
      `user:${session.user.id}:friends`,
      idToAdd
    );

    if (isAlreadyFriends) {
      return new Response("Already a friend", { status: 400 });
    }

    //if the user already has a freind request from the sender
    const hasFreindRequest = await fetchRedis(
      "sismember",
      `user:${session.user.id}:incoming_friend_requests`,
      idToAdd
    );

    if (!hasFreindRequest) {
      return new Response("Requested Already!!", { status: 400 });
    }

    const [userRaw, friendRaw] = (await Promise.all([
      fetchRedis('get', `user:${session.user.id}`),
      fetchRedis('get', `user:${idToAdd}`)
    ])) as [string, string]

    const user = JSON.parse(userRaw)
    const friend = JSON.parse(friendRaw)



    await Promise.all([
      pusherServer.trigger(toPusherKey(`user:${idToAdd}:friends`), "new_friend", user),
      pusherServer.trigger(toPusherKey(`user:${session.user.id}:friends`), "new_friend", friend),

      db.sadd(`user:${session.user.id}:friends`, idToAdd),
      db.sadd(`user:${idToAdd}:friends`, session.user.id),
      db.srem(`user:${session.user.id}:incoming_friend_requests`, idToAdd)
      //db.srem(`user:${idToAdd}:outbound_friend_request`, session.user.id)
    ])

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request payload", { status: 422 });
    }
    return new Response("Invalid request", { status: 400 });
  }
}
