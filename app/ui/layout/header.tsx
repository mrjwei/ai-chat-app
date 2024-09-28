import { updateThread } from "@/app/lib/api"
import { IThread } from "@/app/lib/types"
import Button from "@/app/ui/common/button"

export default async function Header({updatedThread}: {updatedThread: IThread}) {
  const updateThreadWithData = updateThread.bind(null, updatedThread.id, updatedThread)
  return (
    <header className="bg-gray-100 p-4">
      <form action={updateThreadWithData}>
        <Button type="submit">
          Save
        </Button>
      </form>
    </header>
  )
}
