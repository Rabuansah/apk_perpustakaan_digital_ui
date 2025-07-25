"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface User {
  id?: string;
  name: string;
  email: string;
  password?: string;
}

interface Props {
  user?: User;
  trigger: React.ReactNode;
  onSubmit: (data: User) => void;
}

export default function UserFormModal({ user, trigger, onSubmit }: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<User>({
    name: user?.name || "",
    email: user?.email || "",
    password: "", // Kosongkan password saat edit, biar user isi ulang jika ingin ganti
    id: user?.id || "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSubmit(form);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{user ? "Edit User" : "Tambah User"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <Input name="name" placeholder="Nama" value={form.name} onChange={handleChange} />
          <Input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
          <div className="relative">
            <Input name="password" type={showPassword ? "text" : "password"} placeholder={user ? "Kosongkan jika tidak ingin ganti password" : "Password"} value={form.password} onChange={handleChange} className="pr-10" />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>{user ? "Simpan Perubahan" : "Tambah"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
