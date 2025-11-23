import ThreadCard from "../cards/ThreadCard";
import { Button } from "../ui/button";
import { fetchUserPosts } from "@/lib/actions/user.actions";
import { fetchCommunityPosts } from "@/lib/actions/community.actions";
import { deleteThread } from "@/lib/actions/thread.actions";

interface Result {
  name: string;
  image: string;
  id: string;
  threads: {
    _id: string;
    text: string;
    parentId: string | null;
    author: {
      name: string;
      image: string;
      id: string;
    };
    community: {
      id: string;
      name: string;
      image: string;
    } | null;
    createdAt: string;
    children: {
      author: {
        image: string;
      };
    }[];
  }[];
}

interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

  async function ThreadsTab({ currentUserId, accountId, accountType }: Props) {
    let result: Result;
    if (accountType === "Community") {
      result = await fetchCommunityPosts(accountId);
    } else {
      result = await fetchUserPosts(accountId);
    }
    async function deleteThreadByAuthor(formData: FormData) {
      "use server";
      const threadId = formData.get("threadId")
      if (typeof threadId === "string") {
        await deleteThread(threadId)
      }
    }
  return (
    <section className='mt-9 flex flex-col gap-10'>
      {result?.threads.filter((item)=>accountId.toString() === item?.author.toString()).map((thread) => (
        <div key={thread._id}>
        <ThreadCard
          id={thread._id}
          currentUserId={currentUserId}
          parentId={thread.parentId}
          content={thread.text}
          author={
            accountType === "User"
              ? { name: result.name, image: result.image, id: result.id }
              : {
                  name: thread.author.name,
                  image: thread.author.image,
                  id: thread.author.id,
                }
          }
          community={
            accountType === "Community"
              ? { name: result.name, id: result.id, image: result.image }
              : thread.community
          }
          createdAt={thread.createdAt}
          comments={thread.children}
        />
         <form action={deleteThreadByAuthor}>
           <input type="hidden" name="threadId" value={thread._id.toString()} />
           <Button type="submit" className="bg-primary-500 w-full">
             Delete Thread
           </Button>
         </form>
        </div>
      ))}
    </section>
  );
}

export default ThreadsTab;