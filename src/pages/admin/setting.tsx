import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@radix-ui/react-label";
import { PencilLine, Trash } from "lucide-react";
import { useState } from "react";

const settings = [
    {
        id: "INV001",
        key: "Paid",
        value: "$250.00",
        description: "Credit Card",
    },
    {
        id: "INV002",
        key: "Paid",
        value: "$250.00",
        description: "Credit Card",
    }
]

const AdminSettingPage = () => {
    // const [settings, setSettings] = useState([])

    return (
        <div className="px-4">
            <header className="flex h-16 shrink-0 items-center gap-2">
                <div className="flex items-center gap-2">
                    <span>Cài đặt</span>
                </div>
            </header>
            <div className="mx-5">
                <div className="flex items-center gap-2 border rounded-xl p-5">
                    <Input className="w-sm" type="text" placeholder="Nhập key" id="key" />
                    <Button variant="secondary">Tìm kiếm</Button>
                </div>
                <div className="border rounded-xl mt-5 p-5">
                    <div className="flex justify-between mb-2">
                        <span className="font-medium">Danh sách cài đặt</span>
                        <Button className="bg-blue-500">Thêm mới</Button>
                    </div>
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="w-[100px]">Id</TableHead>
                                <TableHead>Key</TableHead>
                                <TableHead>Value</TableHead>
                                <TableHead>Mô tả</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {settings.map((s) => (
                                <TableRow key={s.id}>
                                    <TableCell className="font-medium">{s.id}</TableCell>
                                    <TableCell>{s.key}</TableCell>
                                    <TableCell>{s.value}</TableCell>
                                    <TableCell>{s.description}</TableCell>
                                    <TableCell className="gap-2 flex justify-end">
                                        <PencilLine className="text-yellow-500 cursor-pointer me-1" />
                                        <Trash className="text-red-500 cursor-pointer" />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}

export default AdminSettingPage;