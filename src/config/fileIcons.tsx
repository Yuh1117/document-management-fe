import { AiOutlineFileUnknown } from "react-icons/ai";
import { FaHtml5, FaCss3Alt } from "react-icons/fa";
import { FaRegImage, FaRegFileZipper, FaRegFilePdf, FaMarkdown, FaRegFileWord, FaRegFileExcel, FaRegFilePowerpoint } from "react-icons/fa6";
import { LuFileText, LuAudioLines } from "react-icons/lu";
import { MdOndemandVideo } from "react-icons/md";

export const getIconComponentByMimeType = (mimeType: string) => {
    if (!mimeType) return { icon: AiOutlineFileUnknown, color: "text-gray-500" };

    const [type, subtype] = mimeType.split("/");

    switch (type) {
        case "text":
            if (subtype === "plain") return { icon: LuFileText, color: "#696969ff" };
            if (subtype === "html") return { icon: FaHtml5, color: "#e44d26" };
            if (subtype === "css") return { icon: FaCss3Alt, color: "#2980b9" };
            if (subtype === "md") return { icon: FaMarkdown, color: "#3e8a9d" };
            break;
        case "image":
            return { icon: FaRegImage, color: "#50b3f1" };
        case "audio":
            return { icon: LuAudioLines, color: "#6c757d" };
        case "video":
            return { icon: MdOndemandVideo, color: "#6c6f74" };
        case "application":
            if (subtype === "pdf")
                return { icon: FaRegFilePdf, color: "#e74c3c" };
            if (["zip", "x-zip-compressed", "vnd.rar", "x-7z-compressed"].includes(subtype))
                return { icon: FaRegFileZipper, color: "#95a5a6" };
            if (["msword", "vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(subtype))
                return { icon: FaRegFileWord, color: "#3498db" };
            if (["ms-excel", "vnd.openxmlformats-officedocument.spreadsheetml.sheet"].includes(subtype))
                return { icon: FaRegFileExcel, color: "#2ecc71" };
            if (["powerpoint", "vnd.openxmlformats-officedocument.presentationml.presentation"].includes(subtype))
                return { icon: FaRegFilePowerpoint, color: "#f39c12" };
            break;
    }

    return { icon: AiOutlineFileUnknown, color: "text-gray-500" };
};
