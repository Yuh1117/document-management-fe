import MyFilesPage from "./my-files";
import FolderFilesPage from "./folder-files";
import TrashFilesPage from "./trash-files";

const Files = ({ mode }: { mode: string }) => {
    switch (mode) {
        case "my-files":
            return <MyFilesPage />;
        case "folder":
            return <FolderFilesPage />;
        case "trash":
            return <TrashFilesPage />;
        default:
            return <div>Không tìm thấy</div>;
    }
};

export default Files;