"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Author {
  id: number | string;
  name: string;
  nationality: string;
  brithdate: string; // gunakan string untuk input date
}

interface Props {
  authors?: Author;
  trigger: React.ReactNode;
  onSubmit: (data: Author) => void;
}

export default function AuthorFormModal({ authors, trigger, onSubmit }: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Author>({
    id: authors?.id || "",
    name: authors?.name || "",
    nationality: authors?.nationality || "",
    brithdate: authors?.brithdate || "",
  });

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
          <DialogTitle>{authors ? "Edit Author" : "Tambah Author"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <Input name="name" placeholder="Nama" value={form.name} onChange={handleChange} />
          <Input name="nationality" placeholder="Kebangsaan" value={form.nationality} onChange={handleChange} />
          <Input name="brithdate" type="date" value={form.brithdate} onChange={handleChange} />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>{authors ? "Simpan Perubahan" : "Tambah"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
