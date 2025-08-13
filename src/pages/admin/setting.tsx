import DeleteModal from "@/components/admin/delete-modal";
import SettingModal from "@/components/admin/setting/setting-modal";
import Access from "@/components/protected-route/access";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Spinner } from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { authApis, endpoints } from "@/config/Api";
import { ALL_PERMISSIONS } from "@/config/permissions";
import { useAppDispatch } from "@/redux/hooks";
import { fetchPermissions } from "@/redux/reducers/permissionSlice";
import type { ISetting } from "@/types/type";
import { PencilLine, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

const SettingAdminPage = () => {
    const [settings, setSettings] = useState<ISetting[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [q, setQ] = useSearchParams();
    const page = parseInt(q.get("page") || "1");
    const [kwInput, setKwInput] = useState<string>(q.get('kw') || '');
    const [totalPages, setTotalPages] = useState<number>(1);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [data, setData] = useState<ISetting | null>()
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const dispatch = useAppDispatch()

    const loadSettings = async () => {
        try {
            setLoading(true)
            
            let url = `${endpoints['settings']}?page=${page}`;

            if (kwInput) {
                url = `${url}&kw=${kwInput}`;
            }

            const res = await authApis().get(url);
            setSettings(res.data.data.result);
            setTotalPages(res.data.data.totalPages)

        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = () => {
        const params = new URLSearchParams(q);
        const trimmed: string = kwInput.trim()

        if (trimmed) {
            params.set("kw", trimmed);
        } else {
            params.delete("kw");
        }

        params.set("page", "1");
        setQ(params);
    }

    const changePage = (newPage: number) => {
        const params = new URLSearchParams(q);
        params.set("page", newPage.toString());
        setQ(params);
    };


    const handleOpenAdd = () => {
        setIsEditing(false);
        setShowModal(true);
        setData(null)
    };

    const handleOpenEdit = (setting: ISetting) => {
        setIsEditing(true);
        setShowModal(true);
        setData(setting)
    };

    const handleDelete = (id: number) => {
        setDeletingId(id);
    };

    useEffect(() => {
        if (page > 0) {
            loadSettings();
        }
    }, [q]);

    useEffect(() => {
        const permissionsToCheck = [
            ALL_PERMISSIONS.SETTINGS.LIST,
            ALL_PERMISSIONS.SETTINGS.CREATE,
            ALL_PERMISSIONS.SETTINGS.UPDATE,
            ALL_PERMISSIONS.SETTINGS.DELETE,
        ].map(({ apiPath, method }) => ({ apiPath, method }));

        dispatch(fetchPermissions(permissionsToCheck));
    }, [dispatch]);

    return (
        <div className="px-4">
            <header className="flex h-16 shrink-0 items-center gap-2">
                <div className="flex items-center gap-2">
                    <span>Cài đặt</span>
                </div>
            </header>
            <Access permission={ALL_PERMISSIONS.SETTINGS.LIST}>
                <div className="mx-5">
                    <div className="flex items-center gap-2 border rounded-xl p-5  shadow-xs">
                        <Label>Key:</Label>
                        <Input
                            className="w-sm"
                            type="text"
                            placeholder="Nhập key"
                            id="key"
                            value={kwInput}
                            onChange={(e) => setKwInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <Button variant="secondary" onClick={handleSearch}>Tìm kiếm</Button>
                    </div>
                    <div className="border rounded-xl mt-5 p-5 shadow-xs">
                        <div className="flex justify-between items-center mb-3">
                            <span className="font-medium">Danh sách cài đặt</span>
                            <Access permission={ALL_PERMISSIONS.SETTINGS.CREATE} hideChildren>
                                <Button className="bg-blue-500 dark:bg-blue-500 hover:bg-blue-500/90 dark:hover:bg-blue-500/90" onClick={handleOpenAdd}>
                                    <Plus strokeWidth={3} /> Thêm mới
                                </Button>
                            </Access>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Id</TableHead>
                                    <TableHead>Key</TableHead>
                                    <TableHead>Value</TableHead>
                                    <TableHead>Mô tả</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={5}>
                                            <div className="flex justify-center items-center py-10">
                                                <Spinner size={28} />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : settings.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-10">
                                            Không có dữ liệu
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    settings.map(s => (
                                        <TableRow key={s.id}>
                                            <TableCell className="font-medium">{s.id}</TableCell>
                                            <TableCell>{s.key}</TableCell>
                                            <TableCell className="whitespace-normal break-words max-w-xs">
                                                {s.key === "allowedFileType" ? <>{s.value.split(";").map((type, index) => (
                                                    <Badge key={index} variant="secondary" className="my-1 me-1">
                                                        {type}
                                                    </Badge>
                                                ))}</> : <>{s.value}</>}
                                            </TableCell>
                                            <TableCell>{s.description}</TableCell>
                                            <TableCell className="gap-2 flex justify-end">
                                                <Access permission={ALL_PERMISSIONS.SETTINGS.UPDATE} hideChildren>
                                                    <PencilLine
                                                        className="text-yellow-500 hover:text-yellow-500/50 cursor-pointer me-1"
                                                        onClick={() => handleOpenEdit(s)}
                                                    />
                                                </Access>
                                                <Access permission={ALL_PERMISSIONS.SETTINGS.DELETE} hideChildren>
                                                    <Trash2
                                                        className="text-red-500 hover:text-red-500/50 cursor-pointer"
                                                        onClick={() => handleDelete(s.id)}
                                                    />
                                                </Access>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>

                        </Table>
                    </div>
                    {settings.length !== 0 &&
                        <Pagination className="mt-3">
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={() => page > 1 && changePage(page - 1)}
                                    />
                                </PaginationItem>

                                {[...Array(totalPages)].map((_, idx) => (
                                    <PaginationItem key={idx}>
                                        <PaginationLink
                                            isActive={page === idx + 1}
                                            onClick={() => changePage(idx + 1)}
                                        >
                                            {idx + 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}

                                <PaginationItem>
                                    <PaginationNext
                                        onClick={() => page < totalPages && changePage(page + 1)}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    }
                </div>

                <SettingModal
                    open={showModal}
                    onOpenChange={setShowModal}
                    isEditing={isEditing}
                    data={data}
                    loadSettings={loadSettings}
                />

                <DeleteModal
                    open={!!deletingId}
                    deletingId={deletingId}
                    onCancel={() => setDeletingId(null)}
                    name={"cài đặt"}
                    load={loadSettings}
                    endpoint={endpoints["settings-detail"]}
                />
            </Access>

        </div>
    )
}

export default SettingAdminPage;