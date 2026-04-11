const ProjectModal = ({ project, onClose }) => {

    if (!project) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">

                <h2>Project Details</h2>

                {/* ================= BASIC INFO ================= */}
                <h3>Basic Info</h3>
                <p><strong>ID:</strong> {project.id}</p>
                <p><strong>Name:</strong> {project.projectName}</p>
                <p><strong>Description:</strong> {project.description}</p>
                <p><strong>Status:</strong> {project.status}</p>
                <p><strong>Created At:</strong> {project.createdAt}</p>

                {/* ================= CREATED BY ================= */}
                <h3>Created By</h3>
                <p><strong>Name:</strong> {project.createdBy?.name}</p>
                <p><strong>Email:</strong> {project.createdBy?.email}</p>
                <p><strong>Phone:</strong> {project.createdBy?.phoneNum}</p>

                <h4>Roles</h4>
                {project.createdBy?.roles?.map(role => (
                    <div key={role.id}>
                        <strong>{role.name}</strong>
                        <ul>
                            {role.permissions.map(p => (
                                <li key={p.id}>{p.name}</li>
                            ))}
                        </ul>
                    </div>
                ))}

                {/* ================= MANAGERS ================= */}
                <h3>Managers</h3>
                {project.managerProjects.map(mp => (
                    <div key={mp.id}>
                        <p><strong>Name:</strong> {mp.manager.name}</p>
                        <p><strong>Email:</strong> {mp.manager.email}</p>
                        <p><strong>Phone:</strong> {mp.manager.phoneNum}</p>

                        <h5>Roles</h5>
                        {mp.manager.roles.map(role => (
                            <div key={role.id}>
                                <strong>{role.name}</strong>
                                <ul>
                                    {role.permissions.map(p => (
                                        <li key={p.id}>{p.name}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                        <hr />
                    </div>
                ))}

                {/* ================= MEMBERS ================= */}
                <h3>Members</h3>
                {project.memberProjects.map(mp => (
                    <div key={mp.id}>
                        <p><strong>Name:</strong> {mp.member.name}</p>
                        <p><strong>Email:</strong> {mp.member.email}</p>
                        <p><strong>Phone:</strong> {mp.member.phoneNum}</p>

                        <h5>Roles</h5>
                        {mp.member.roles.map(role => (
                            <div key={role.id}>
                                <strong>{role.name}</strong>
                                <ul>
                                    {role.permissions.map(p => (
                                        <li key={p.id}>{p.name}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                        <hr />
                    </div>
                ))}

                {/* ================= WORK LOGS ================= */}
                <h3>Work Logs</h3>
                {project.workLogs.map(log => (
                    <div key={log.id}>
                        <p><strong>Member:</strong> {log.member.name}</p>
                        <p><strong>Date:</strong> {log.workDate}</p>
                        <p><strong>Time:</strong> {log.hours}h {log.minutes}m</p>
                        <p><strong>Description:</strong> {log.description}</p>
                        <p><strong>Status:</strong> {log.status}</p>
                        <p><strong>Approved By:</strong> {log.approvedBy?.name}</p>
                        <p><strong>Approved At:</strong> {log.approvedAt}</p>
                        <p><strong>Created At:</strong> {log.createdAt}</p>
                        <hr />
                    </div>
                ))}

                <button onClick={onClose}>Close</button>

            </div>
        </div>
    );
};

export default ProjectModal;