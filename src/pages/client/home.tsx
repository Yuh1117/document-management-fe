import Document from "@/components/client/document/document";
import Folder from "@/components/client/folder/folder";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useLoaderData } from "react-router";

const Home = () => {
    const loaderData = useLoaderData()

    return (
        <div className="bg-muted dark:bg-sidebar flex flex-col min-h-svh rounded-xl p-2">
            <div className="flex items-center rounded-xl">
                <SidebarTrigger />
                <h1 className="text-center text-2xl">{loaderData.message}</h1>
            </div>

            <div className="p-2">
                <div>
                    <div>Thư mục</div>
                    <div className="grid grid-cols-[repeat(auto-fill,_minmax(220px,_1fr))] gap-4 px-2 py-4">
                        {Array.from({ length: 10 }).map((_, index) => (
                            <Folder key={index} />
                        ))}
                    </div>
                </div>

                <div>
                    <div>Tài liệu</div>
                    <div className="grid grid-cols-[repeat(auto-fill,_minmax(220px,_1fr))] gap-4 px-2 py-4">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <Document key={index} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;
