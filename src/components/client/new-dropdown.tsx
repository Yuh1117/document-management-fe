import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "../ui/button"
import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu"
import { Plus, type LucideIcon } from "lucide-react"
import { useSidebar } from "../ui/sidebar"
import { useParams } from "react-router"
import { useAppDispatch } from "@/redux/hooks"
import { triggerReload } from "@/redux/reducers/filesSlice"
import { authApis, endpoints } from "@/config/Api"
import { toast } from "sonner"
import { useState } from "react"
import { Spinner } from "../ui/spinner"

const NewDropDown = ({
  items
}: {
  items: {
    name: string
    icon: LucideIcon
  }[]
}) => {
  const { state } = useSidebar()
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const [isUploading, setIsUploading] = useState<boolean>(false)

  const handleUpload = async (files: FileList | null) => {
    if (!files?.length) return

    try {
      setIsUploading(true)

      const formData = new FormData()
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i])
      }

      if (id) {
        formData.append("folderId", id)
      }

      await authApis().post(endpoints["upload-multiple-files"], formData)
      dispatch(triggerReload())

      toast.success("Tải lên thành công", {
        duration: 2000
      })

    } catch (error) {
      console.error("Upload failed: ", error)

      toast.error("Tải lên thất bại", {
        duration: 2000
      })

    } finally {
      setIsUploading(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={`rounded-xl ${state !== "collapsed" && "w-30 h-13"}`}
          size="icon"
          disabled={isUploading}
        >
          {isUploading ? <Spinner /> : <>
            <Plus strokeWidth={3} />
            {state === "collapsed" ? "" : "Mới"}
          </>}

        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-50" align="start">
        <DropdownMenuGroup>
          {items.map(i => (
            <DropdownMenuItem
              key={i.name}
              onClick={() => {
                if (i.name === "Tải tệp lên") {
                  const input = document.createElement("input")
                  input.type = "file"
                  input.multiple = true
                  input.onchange = (e: any) => handleUpload(e.target.files)
                  input.click()
                }
              }}
            >
              <i.icon className="mr-2 text-black-900" />
              {i.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { NewDropDown };