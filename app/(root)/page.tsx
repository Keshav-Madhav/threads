import { getThreads } from "@/lib/actions/Thread.actions";

export default async function Home() {
  const result = await getThreads(1, 30);


  return (
    <>
      <h1 className="head-text text-left">Home</h1>
    </>
  );
}
