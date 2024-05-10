import Button from "@/components/ui/Button";
import { db } from "@/lib/db";
import Image from "next/image";

export default async function Home() {
  await db.set('hello', 'world');
  return (
    <div className="text-red-500">
      <Button>Btn</Button>
    </div>
  );
}
