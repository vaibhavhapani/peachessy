import { getFriendsByUserId } from "@/app/helpers/get-friends-by-user-id";
import { fetchRedis } from "@/app/helpers/redis";
import { authOptions } from "@/lib/auth";
import { chatHrefConstructor } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const page = async ({}) => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const friends = await getFriendsByUserId(session.user.id);

  const friendsWithLatestMessage = await Promise.all(
    friends.map(async (friend) => {
      const [latestMessageRow] = (await fetchRedis(
        "zrange",
        `chat:${chatHrefConstructor(session.user.id, friend.id)}:messages`,
        -1,
        -1
      )) as string[];

      const latestMessage = JSON.parse(latestMessageRow) as Message

      return {
        ...friend,
        latestMessage,
      };
    })
  );
  return (
    <div className="container py-12">
      <h1 className="font-bold text-4xl mb-8">Recent Chats</h1>
      {friendsWithLatestMessage.length === 0 ? (
        <p>No Messages</p>
      ) : (
        friendsWithLatestMessage.map((friend) => (
          <div
            key={friend.id}
            className="relative bg-zinc-50 border border-zinc-200 p-3 rounded-md"
          >
            <div className="absolute right-4 inset-y-0 flex items-center">
              <ChevronRight className="h-7 w-7 text-zinc-400"></ChevronRight>
            </div>
            <Link
              href={`/dashboard/chat/${chatHrefConstructor(
                session.user.id,
                friend.id
              )}`}
              className="relative sm:flex"
            >
              <div className="mb-4 flex-shrink-0 sm:mb-0 sm:mr-4">
                <div className="relative h-6 w-6">
                  <Image
                    fill
                    referrerPolicy="no-referrer"
                    className="rounded-full"
                    alt={`${friend.name} profile picture`}
                    src={friend.image}
                  ></Image>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold">{friend.name}</h4>
                <p className="mt-1 max-w-md">
                  <span className="text-zinc-400">
                    {friend.latestMessage.senderId === session.user.id
                      ? "You: "
                      : `${friend.name}: `}
                  </span>
                  {friend.latestMessage.text}
                </p>
              </div>
            </Link>
          </div>
        ))
      )}
    </div>
  );
};

export default page;
