import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "./ui/button"
import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu"
import { Plus, type LucideIcon } from "lucide-react"
import { useSidebar } from "./ui/sidebar"

const NewDropDown = ({
  items
}: {
  items: {
    name: string
    icon: LucideIcon
  }[]
}) => {
  const { state } = useSidebar()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="rounded-2xl" size={"lg"}>
          <Plus /> {state === "collapsed" ? '' : "Mới"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-50" align="start">
        <DropdownMenuGroup>
          {items.map(i => (
            <DropdownMenuItem key={i.name}>
              <i.icon />
              {i.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { NewDropDown };