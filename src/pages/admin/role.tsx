import DeleteModal from "@/components/admin/delete-modal";
import RoleModal from "@/components/admin/role/role-modal";
import Access from "@/components/protected-route/access";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Spinner } from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { authApis, endpoints } from "@/config/Api";
import { ALL_PERMISSIONS } from "@/config/permissions";
import type { IRole } from "@/types/type";
import { PencilLine, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

const RoleAdminPage = () => {
    const [roles, setRoles] = useState<IRole[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [q, setQ] = useSearchParams();
    const page = parseInt(q.get("page") || "1");
    const [kwInput, setKwInput] = useState<string>(q.get('kw') || '');
    const [totalPages, setTotalPages] = useState<number>(1);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [data, setData] = useState<IRole | null>()
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const loadRoles = async () => {
        try {
            setLoading(true)

            let url = `${endpoints['roles']}?page=${page}`;

            if (kwInput) {
                url = `${url}&kw=${kwInput}`;
            }

            const res = await authApis().get(url);
            setRoles(res.data.data.result);
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

    const handleOpenEdit = (setting: IRole) => {
        setIsEditing(true);
        setShowModal(true);
        setData(setting)
    };

    const handleDelete = (id: number) => {
        setDeletingId(id);
    };

    useEffect(() => {
        if (page > 0) {
            loadRoles();
        }
    }, [q]);

    return (
        <div className="px-4">
            <header className="flex h-16 shrink-0 items-center gap-2">
                <div className="flex items-center gap-2">
                    <span>Vai trò</span>
                </div>
            </header>
            <Access permission={ALL_PERMISSIONS.ROLES.LIST}>
                <div className="mx-5">
                    <div className="flex items-center gap-2 border rounded-xl p-5  shadow-xs">
                        <Label>Tên:</Label>
                        <Input
                            className="w-sm"
                            type="text"
                            placeholder="Nhập tên"
                            id="name"
                            value={kwInput}
                            onChange={(e) => setKwInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <Button variant="secondary" onClick={handleSearch}>Tìm kiếm</Button>
                    </div>
                    <div className="border rounded-xl mt-5 p-5 shadow-xs">
                        <div className="flex justify-between items-center mb-3">
                            <span className="font-medium">Danh sách vai trò</span>
                            <Access permission={ALL_PERMISSIONS.ROLES.CREATE} hideChildren>
                                <Button className="bg-blue-500 dark:bg-blue-500 hover:bg-blue-500/90 dark:hover:bg-blue-500/90" onClick={handleOpenAdd}>
                                    <Plus strokeWidth={3} /> Thêm mới
                                </Button>
                            </Access>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Id</TableHead>
                                    <TableHead>Tên</TableHead>
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
                                ) : roles.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-10">
                                            Không có dữ liệu
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    roles.map(r => (
                                        <TableRow key={r.id}>
                                            <TableCell className="font-medium">{r.id}</TableCell>
                                            <TableCell>{r.name}</TableCell>
                                            <TableCell>{r.description}</TableCell>
                                            <TableCell className="gap-2 flex justify-end">
                                                <Access permission={ALL_PERMISSIONS.ROLES.UPDATE} hideChildren>
                                                    <PencilLine
                                                        className="text-yellow-500 hover:text-yellow-500/50 cursor-pointer me-1"
                                                        onClick={() => handleOpenEdit(r)}
                                                    />
                                                </Access>
                                                <Access permission={ALL_PERMISSIONS.ROLES.DELETE} hideChildren>
                                                    <Trash2
                                                        className="text-red-500 hover:text-red-500/50 cursor-pointer"
                                                        onClick={() => handleDelete(r.id)}
                                                    />
                                                </Access>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>

                        </Table>
                    </div>
                    {roles.length !== 0 &&
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

                <RoleModal
                    open={showModal}
                    onOpenChange={setShowModal}
                    isEditing={isEditing}
                    data={data}
                    loadRoles={loadRoles}
                />

                <DeleteModal
                    open={!!deletingId}
                    deletingId={deletingId}
                    onCancel={() => setDeletingId(null)}
                    name={"vai trò"}
                    load={loadRoles}
                    endpoint={endpoints["roles-detail"]}
                />
            </Access>

        </div>
    )
}

export default RoleAdminPage;