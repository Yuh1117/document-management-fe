import DeleteModal from "@/components/admin/delete-modal";
import UserModal from "@/components/admin/user/user-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Spinner } from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { authApis, endpoints } from "@/config/Api";
import type { IUser } from "@/types/type";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { PencilLine, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

const UserAdminPage = () => {
    const [users, setUsers] = useState<IUser[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [q, setQ] = useSearchParams();
    const page = parseInt(q.get("page") || "1");
    const [kwInput, setKwInput] = useState<string>(q.get('kw') || '');
    const [totalPages, setTotalPages] = useState<number>(1);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [data, setData] = useState<IUser | null>()
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const loadUsers = async () => {
        try {
            setLoading(true)

            let url = `${endpoints['users']}?page=${page}`;

            if (kwInput) {
                url = `${url}&kw=${kwInput}`;
            }

            const res = await authApis().get(url);
            setUsers(res.data.data.result);
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

    const handleOpenEdit = (users: IUser) => {
        setIsEditing(true);
        setShowModal(true);
        setData(users)
    };

    const handleDelete = (id: number) => {
        setDeletingId(id);
    };

    useEffect(() => {
        if (page > 0) {
            loadUsers();
        }
    }, [q]);

    return (
        <div className="px-4">
            <header className="flex h-16 shrink-0 items-center gap-2">
                <div className="flex items-center gap-2">
                    <span>Người dùng</span>
                </div>
            </header>
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
                        <span className="font-medium">Danh sách người dùng</span>
                        <Button className="bg-blue-500 dark:bg-blue-500 hover:bg-blue-500/90 dark:hover:bg-blue-500/90" onClick={handleOpenAdd}>
                            <Plus strokeWidth={3} /> Thêm mới
                        </Button>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Id</TableHead>
                                <TableHead>Avatar</TableHead>
                                <TableHead>Họ và tên</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Vai trò</TableHead>
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
                            ) : users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-10">
                                        Không có dữ liệu
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.map(u => (
                                    <TableRow key={u.id}>
                                        <TableCell className="font-medium">{u.id}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage src={u.avatar as string} alt="avatar" />
                                                    <AvatarFallback className="rounded-lg">-</AvatarFallback>
                                                </Avatar>
                                            </div>
                                        </TableCell>
                                        <TableCell>{`${u.lastName} ${u.firstName}`}</TableCell>
                                        <TableCell>{u.email}</TableCell>
                                        <TableCell>{u.role.name}</TableCell>
                                        <TableCell className="gap-2 flex justify-end">
                                            <PencilLine
                                                className="text-yellow-500 hover:text-yellow-500/50 cursor-pointer me-1"
                                                onClick={() => handleOpenEdit(u)}
                                            />
                                            <Trash2
                                                className="text-red-500 hover:text-red-500/50 cursor-pointer"
                                                onClick={() => handleDelete(u.id)}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>

                    </Table>
                </div>
                {users.length !== 0 &&
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

            <UserModal
                open={showModal}
                onOpenChange={setShowModal}
                isEditing={isEditing}
                data={data}
                loadUsers={loadUsers}
            />

            <DeleteModal
                open={!!deletingId}
                deletingId={deletingId}
                onCancel={() => setDeletingId(null)}
                name={"người dùng"}
                load={loadUsers}
                endpoint={endpoints["users-detail"]}
            />

        </div>
    )
}

export default UserAdminPage;