import { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { endpoints } from "@/config/Api";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, ListChecks, X } from "lucide-react";
import { Toaster } from "sonner";
import Document from "@/components/client/document/document";
import DocumentDetail from "@/components/client/document/document-detail";
import DocumentModal from "@/components/client/document/document-modal";
import Folder from "@/components/client/folder/folder";
import FolderDetail from "@/components/client/folder/folder-detail";
import FolderModal from "@/components/client/folder/folder-modal";
import { useFilesLoader } from "@/hooks/use-files-loader";
import { useMultiSelect } from "@/hooks/use-multi-select";
import { useDownloadFiles } from "@/hooks/use-download-files";
import ShareUrlModal from "@/components/client/document/share-url-modal";
import TransferModal from "@/components/client/transfer-modal";
import ShareModal from "@/components/client/share-modal";
import { closeDocumentDetail, closeDocumentModal, closeShareUrlModal } from "@/redux/reducers/documentSlice";
import { closeShareModal, closeTransferModal } from "@/redux/reducers/filesSlice";
import { closeFolderDetail, closeFolderModal } from "@/redux/reducers/folderSlice";

const SharedFilesPage = () => {
    const fileState = useAppSelector(state => state.files);
    const documentState = useAppSelector(state => state.documents)
    const folderState = useAppSelector(state => state.folders)
    const { files, loading, hasMore, observerRef } = useFilesLoader(endpoints["shared-files"], fileState.reloadFlag);
    const multi = useMultiSelect();
    const { downloading, download } = useDownloadFiles();
    const dispatch = useAppDispatch();

    const folders = useMemo(() => files.filter((f) => f.type === "folder"), [files]);
    const documents = useMemo(() => files.filter((f) => f.type === "document"), [files]);

    return (
        <div className="bg-muted dark:bg-muted flex flex-col rounded-xl p-2 select-none">
            <Toaster richColors position="top-center" />

            <div className="bg-muted/60 backdrop-blur flex items-center justify-between rounded-xl p-4 border-b">
                <div className="flex items-center gap-4">
                    <SidebarTrigger />
                    <h1 className="text-2xl font-semibold">Files được chia sẻ</h1>
                </div>
                <div
                    className="cursor-pointer p-2 rounded-xl hover:bg-input/50 dark:hover:bg-input/50"
                    onClick={multi.toggleMode}
                >
                    {multi.isMultiSelectMode ? <X size={20} /> : <ListChecks size={20} />}
                </div>
            </div>

            <ScrollArea className="p-2 h-[calc(100vh-160px)]">
                {files.length === 0 && !loading ? (
                    <div className="flex justify-center items-center py-8 text-muted-foreground">
                        Không có dữ liệu
                    </div>
                ) : (
                    <>
                        {folders.length > 0 && (
                            <div className="mb-6">
                                <h2 className="text-lg mb-2">Thư mục</h2>
                                <div className="grid grid-cols-[repeat(auto-fill,_minmax(220px,_1fr))] gap-4 px-2 py-4">
                                    {folders.map((f) => (
                                        <Folder
                                            key={`folder-${f.folder.id}`}
                                            data={f.folder}
                                            permission={f.permission}
                                            isMultiSelectMode={multi.isMultiSelectMode}
                                            selectedFolders={multi.selectedFolders}
                                            setSelectedFolders={multi.setSelectedFolders}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {documents.length > 0 && (
                            <div>
                                <h2 className="text-lg mb-2">Tài liệu</h2>
                                <div className="grid grid-cols-[repeat(auto-fill,_minmax(220px,_1fr))] gap-4 px-2 py-4">
                                    {documents.map((f) => (
                                        <Document
                                            key={`doc-${f.document.id}`}
                                            data={f.document}
                                            permission={f.permission}
                                            isMultiSelectMode={multi.isMultiSelectMode}
                                            selectedDocs={multi.selectedDocs}
                                            setSelectedDocs={multi.setSelectedDocs}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}

                {loading && (
                    <div className="flex justify-center items-center py-8">
                        <Spinner />
                    </div>
                )}

                {hasMore && !loading && <div ref={observerRef} className="h-10" />}

                {!hasMore && files.length > 0 && (
                    <p className="text-center text-muted-foreground py-4">Đã tải hết</p>
                )}
            </ScrollArea>

            {multi.isMultiSelectMode && (
                <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 flex justify-between items-center z-50 shadow-lg">
                    <span className="text-sm text-muted-foreground">
                        {multi.selectedFolders.length} thư mục được chọn, {multi.selectedDocs.length} tài liệu được chọn
                    </span>
                    <div className="flex gap-2">
                        <Button
                            onClick={() => {
                                download(multi.selectedDocs, multi.selectedFolders)
                                multi.reset()
                            }}
                            disabled={multi.selectedDocs.length === 0 && multi.selectedFolders.length === 0 || downloading}
                        >
                            {downloading ? <Spinner /> : <>
                                <Download className="text-black-900" />
                                Tải xuống (zip)
                            </>}
                        </Button>
                        <Button variant="outline" onClick={multi.reset} disabled={downloading}>
                            Huỷ
                        </Button>
                    </div>
                </div>
            )}

            <FolderDetail
                data={folderState.folderDetail.data}
                isSheetOpen={folderState.folderDetail.open}
                setIsSheetOpen={(open) => !open && dispatch(closeFolderDetail())}
            />
            <DocumentDetail
                data={documentState.documentDetail.data}
                isSheetOpen={documentState.documentDetail.open}
                setIsSheetOpen={(open) => !open && dispatch(closeDocumentDetail())}
            />

            <FolderModal
                open={folderState.folderModal.open}
                onOpenChange={(open) => !open && dispatch(closeFolderModal())}
                isEditing={folderState.folderModal.isEditing}
                data={folderState.folderModal.data}
            />
            <DocumentModal
                open={documentState.documentModal.open}
                onOpenChange={(open) => !open && dispatch(closeDocumentModal())}
                data={documentState.documentModal.data}
            />

            <ShareUrlModal
                doc={documentState.shareUrlModal.data}
                open={documentState.shareUrlModal.open}
                onOpenChange={(open) => !open && dispatch(closeShareUrlModal())}
            />
            <ShareModal
                data={fileState.shareModal.data}
                open={fileState.shareModal.open}
                onOpenChange={(open) => !open && dispatch(closeShareModal())}
            />

            <TransferModal
                data={fileState.transferModal.data}
                open={fileState.transferModal.open}
                onOpenChange={(open) => !open && dispatch(closeTransferModal())}
                mode={fileState.transferModal.mode}
            />

        </div>
    )
}

export default SharedFilesPage;