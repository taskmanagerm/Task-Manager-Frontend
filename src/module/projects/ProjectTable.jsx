import { deleteProject } from "./projectService";
import useAccess from "../../hooks/useAccess.js";
import {Button} from "@mui/material";

const ProjectTable = ({ projects, onView, refresh }) => {

    const { can } = useAccess();

    const handleDelete = async (id) => {
        await deleteProject(id);
        refresh();
    };

    return (
        <div style={{ marginTop: "20px" }}>
            <table style={{
                width: "100%",
                borderCollapse: "collapse",
                background: "#fff"
            }}>
                <thead style={{ background: "#f1f5f9" }}>
                <tr>
                    <th style={thStyle}>Name</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Created</th>
                    <th style={thStyle}>Actions</th>
                </tr>
                </thead>

                <tbody>
                {projects.map(project => (
                    <tr key={project.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                        <td style={tdStyle}>{project.projectName}</td>
                        <td style={tdStyle}>{project.status}</td>
                        <td style={tdStyle}>
                            {new Date(project.createdAt).toLocaleDateString()}
                        </td>
                        <td style={tdStyle}>
                            <Button
                                size="small"
                                variant="outlined"
                                onClick={() => onView(project)} style={viewBtn}
                            >
                                View
                            </Button>
                            {can("PROJECT_DELETE") && (
                                <Button
                                    size="small"
                                    color="error"
                                    variant="contained"
                                    onClick={() => handleDelete(project.id)} style={deleteBtn}
                                >
                                    Delete
                                </Button>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

const thStyle = { padding: "12px", textAlign: "left", fontWeight: 600 };
const tdStyle = { padding: "12px" };
const viewBtn = { marginRight: "10px", padding: "6px 12px" };
const deleteBtn = { padding: "6px 12px", background: "#ef4444", color: "#fff", border: "none" };

export default ProjectTable;