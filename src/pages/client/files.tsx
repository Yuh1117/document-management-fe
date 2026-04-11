import MyFilesPage from "./MyFiles";
import FolderFilesPage from "./FolderFiles";
import TrashFilesPage from "./TrashFiles";
import SearchFilesPage from "./SearchFiles";
import SharedFilesPage from "./SharedFiles";
import RecentFilesPage from "./RecentFiles";

const Files = ({ mode }: { mode: string }) => {
    switch (mode) {
        case "my-files":
            return <MyFilesPage />;
        case "search":
            return <SearchFilesPage />;
        case "folder":
            return <FolderFilesPage />;
        case "shared":
            return <SharedFilesPage />;
        case "recent":
            return <RecentFilesPage />;
        case "trash":
            return <TrashFilesPage />;
        default:
            return <div>Không tìm thấy</div>;
    }
};

export default Files;