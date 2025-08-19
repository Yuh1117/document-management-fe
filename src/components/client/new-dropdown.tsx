import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "../ui/button"
import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu"
import { FileUp, FolderPlus, FolderUp, Plus } from "lucide-react"
import { useSidebar } from "../ui/sidebar"
import { useParams } from "react-router"
import { useAppDispatch } from "@/redux/hooks"
import { openFolderModal, triggerReload } from "@/redux/reducers/filesSlice"
import { authApis, endpoints } from "@/config/Api"
import { toast } from "sonner"
import { useState } from "react"
import { Spinner } from "../ui/spinner"

const NewDropDown = () => {
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

            await authApis().post(endpoints["upload-multiple-documents"], formData)
            dispatch(triggerReload())

            toast.success("Tải lên thành công", {
                duration: 2000
            })

        } catch (error: any) {
            console.error("Upload file failed: ", error)

            const errors = error.response.data.error;
            let errorMsg: string = "";

            if (error.response?.status === 400) {
                if (Array.isArray(errors)) {
                    errors.forEach((err: { field: string; message: string }) => {
                        errorMsg += err.message + "-";
                    });
                } else {
                    errorMsg = errors
                }
            } else {
                errorMsg = "Lỗi hệ thống hoặc kết nối"
            }

            toast.error("Tải lên thất bại", {
                duration: 3000,
                description: errorMsg
            });

        } finally {
            setIsUploading(false)
        }
    }

    const handleUploadFolder = async (input: HTMLInputElement) => {
        if (!input.files?.length)
            return;

        try {
            setIsUploading(true);

            const formData = new FormData();

            for (let i = 0; i < input.files.length; i++) {
                const file = input.files[i] as any;
                formData.append("files", file);
                formData.append("relativePaths", file.webkitRelativePath || file.name);
            }

            if (id) {
                formData.append("parentId", id);
            }

            await authApis().post(endpoints["upload-folder"], formData);
            dispatch(triggerReload());

            toast.success("Tải lên thư mục thành công", {
                duration: 2000
            });

        } catch (error: any) {
            console.error("Upload folder failed: ", error);

            const errors = error.response.data.error;
            let errorMsg: string = "";

            if (error.response?.status === 400) {
                if (Array.isArray(errors)) {
                    errors.forEach((err: { field: string; message: string }) => {
                        errorMsg += err.message + "-";
                    });
                } else {
                    errorMsg = errors
                }
            } else {
                errorMsg = "Lỗi hệ thống hoặc kết nối"
            }

            toast.error("Tải lên thất bại", {
                duration: 3000,
                description: errorMsg
            });

        } finally {
            setIsUploading(false);
        }
    };

    const handleAddFolder = () => {
        dispatch(openFolderModal({ isEditing: false, data: null }))
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

                    <DropdownMenuItem onClick={() => {
                        const input = document.createElement("input")
                        input.type = "file"
                        input.multiple = true
                        input.onchange = (e: any) => handleUpload(e.target.files)
                        input.click()
                    }}
                    >
                        <FileUp className="text-black-900" />
                        Tải tệp lên
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => {
                        const input = document.createElement("input");
                        input.type = "file";
                        input.webkitdirectory = true;
                        input.multiple = true;
                        input.onchange = () => handleUploadFolder(input)
                        input.click();
                    }}
                    >
                        <FolderUp className="text-black-900" />
                        Tải thư mục lên
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={handleAddFolder}>
                        <FolderPlus className="text-black-900" />
                        Thư mục mới
                    </DropdownMenuItem>

                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export { NewDropDown };