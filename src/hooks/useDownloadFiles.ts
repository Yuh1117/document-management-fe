import { authApis, endpoints } from "@/config/Api";
import { useState } from "react";
import { toast } from "sonner";

export function useDownloadFiles() {
    const [downloading, setDownloading] = useState(false);

    const download = async (docs: number[], folders: number[]) => {
        if (docs.length === 0 && folders.length === 0) return;
        try {
            setDownloading(true);

            let res;
            let filename = "files.zip";

            if (docs.length > 0 && folders.length === 0) {
                res = await authApis().post(endpoints["download-multiple-documents"], docs, {
                    responseType: "blob"
                });
                filename = "documents.zip";
            } else if (docs.length === 0 && folders.length > 0) {
                res = await authApis().post(endpoints["download-multiple-folders"], folders, {
                    responseType: "blob"
                });
                filename = "folders.zip";
            } else {
                res = await authApis().post(endpoints["download-multiple-files"], {
                    folderIds: folders,
                    documentIds: docs
                }, {
                    responseType: "blob"
                });
                filename = "folders-documents.zip";
            }

            const blob = new Blob([res.data], { type: "application/zip" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            toast.success("Tải về thành công", { duration: 2000 });
            return true;
        } catch (err) {
            console.error("Download error", err);
            toast.error("Tải về thất bại", { duration: 2000 });
            return false;
        } finally {
            setDownloading(false);
        }
    };

    return { downloading, download };
}