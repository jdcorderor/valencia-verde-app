import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { TopBar } from "@/components/layout/top-bar";
import { ProfileForm } from "@/components/profile/profile-form";
import { redirect } from "next/navigation";

export const metadata = { title: "Mi Perfil — Valencia Verde" };

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const service = createServiceClient();
  const { data: profile } = await service
    .from("users")
    .select("*")
    .eq("id", user!.id)
    .single();

  if (!profile) redirect("/auth/login");

  return (
    <div>
      <TopBar title="Mi Perfil" />
      <div className="p-4 lg:p-6 max-w-lg mx-auto">
        <ProfileForm profile={profile} email={user!.email ?? ""} />
      </div>
    </div>
  );
}
