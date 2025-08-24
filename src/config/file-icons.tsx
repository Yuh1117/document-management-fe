import { AiOutlineFileUnknown } from "react-icons/ai";
import { FaHtml5, FaCss3Alt } from "react-icons/fa";
import { FaRegImage, FaRegFileZipper, FaRegFilePdf, FaMarkdown, FaRegFileWord, FaRegFileExcel, FaRegFilePowerpoint } from "react-icons/fa6";
import { LuFileText, LuAudioLines } from "react-icons/lu";
import { MdOndemandVideo } from "react-icons/md";

export const getIconComponentByMimeType = (mimeType: string) => {
    if (!mimeType) return AiOutlineFileUnknown;

    const [type, subtype] = mimeType.split("/");

    switch (type) {
        case "text":
            if (subtype === "plain") return LuFileText;
            if (subtype === "html") return FaHtml5;
            if (subtype === "css") return FaCss3Alt;
            if (subtype === "md") return FaMarkdown;
            break;
        case "image":
            return FaRegImage;
        case "audio":
            return LuAudioLines;
        case "video":
            return MdOndemandVideo;
        case "application":
            if (subtype === "pdf") return FaRegFilePdf;
            if (subtype === "zip") return FaRegFileZipper;
            if (subtype in ["msword", "vnd.openxmlformats-officedocument.wordprocessingml.document"]) return FaRegFileWord;
            if (subtype in ["ms-excel", "vnd.openxmlformats-officedocument.wordprocessingml.document"]) return FaRegFileExcel;
            if (subtype in ["powerpoint", "vnd.openxmlformats-officedocument.wordprocessingml.document"]) return FaRegFilePowerpoint;
            break;
    }

    return AiOutlineFileUnknown;
};
