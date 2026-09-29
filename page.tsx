import AdminPanel from "@/components/AdminPanel";

export const metadata = { title: "Admin — Reflax", robots: "noindex" };

export default function AdminPage() {
  return (
    <div className="container-x">
      <AdminPanel />
    </div>
  );
}
