export default function FooterLayout({ children }) {
    return (
        <div className="admin-layout">
            <main>{children}</main>
            <footer style={{ textAlign: "center", padding: "1rem", borderTop: "1px solid #ccc" }}>
                © 2025 Parking Management System - Admin Panel
            </footer>
        </div>
    );
}
