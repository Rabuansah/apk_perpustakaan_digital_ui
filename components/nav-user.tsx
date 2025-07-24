"use client";

import { useEffect, useState } from "react";
import {
  IconDotsVertical,
  IconLogout,
} from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/api";

interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
}

export function NavUser() {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Anda belum login!");
      router.push("/login-new");
      return;
    }

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser({
        id: "xxxx",
        name: "Guest",
      });
    }
  }, []);

  const handleLogout = async () => {
    try {
      await logout(); // tidak perlu kirim token manual
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      toast.success("Logout berhasil");
      setTimeout(() => router.push("/login-new"), 800);
    } catch (err) {
      toast.error("Gagal logout");
    }
  };

  if (!user) return null;

  const initials = user.name ? user.name.slice(0, 2).toUpperCase() : "CN";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar ?? ""} alt={user.name} />
                <AvatarFallback className="rounded-lg">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                {user.email && (
                  <span className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </span>
                )}
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar ?? ""} alt={user.name} />
                  <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  {user.email && (
                    <span className="text-muted-foreground truncate text-xs">
                      {user.email}
                    </span>
                  )}
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-600 hover:bg-red-100 cursor-pointer"
            >
              <IconLogout className="mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
