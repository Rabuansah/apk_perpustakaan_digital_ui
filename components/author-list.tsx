"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "./ui/button";
import AuthorFormModal from "./AuthorFormModal";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { createAuthor, deleteAuthor, fetchAuthors, updateAuthor } from "@/lib/api";

interface Author {
  id: number;
  name: string;
  nationality: string;
  birthdate: string; 
}

export default function AuthorTable() {
  const [authors, setAuthors] = useState<Author[]>([]);

  useEffect(() => {
    fetchAuthors().then(setAuthors);
  }, []);

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    try {
      await deleteAuthor(id, token);
      setAuthors((prev) => prev.filter((a) => a.id !== id));
      toast.success("Author berhasil dihapus");
    } catch (err) {
      toast.error("Gagal menghapus Author");
    }
  };

  const handleUpdate = async (data: Author) => {
    const token = localStorage.getItem("token");
    try {
      await updateAuthor(data.id, data, token);
      const updatedAuthors = await fetchAuthors();
      setAuthors(updatedAuthors);
      toast.success("Author berhasil diupdate");
    } catch (err) {
      toast.error("Gagal mengupdate Author");
    }
  };

  const handleCreate = async (data: Omit<Author, "id">) => {
    const token = localStorage.getItem("token");
    try {
      await createAuthor(data, token);
      const updated = await fetchAuthors();
      setAuthors(updated);
      toast.success("Author berhasil ditambahkan");
    } catch (err) {
      toast.error("Gagal menambahkan Author");
    }
  };

  return (
    <div className="rounded-md border p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Daftar Author</h2>
        <AuthorFormModal onSubmit={handleCreate} trigger={<Button>+ Tambah</Button>} />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[70px]">No</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Negara</TableHead>
            <TableHead>Tanggal Lahir</TableHead>
            <TableHead className="text-center w-[100px]">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {authors.map((author, index) => (
            <TableRow key={author.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{author.name}</TableCell>
              <TableCell>{author.nationality}</TableCell>
              <TableCell>{author.birthdate}</TableCell>
              <TableCell className="text-right space-x-2">
                <AuthorFormModal
                  author={author}
                  onSubmit={handleUpdate}
                  trigger={
                    <Button size="sm" variant="outline" className="bg-sky-400">
                      Edit
                    </Button>
                  }
                />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      Hapus
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Yakin ingin menghapus Author ini?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tindakan ini tidak bisa dibatalkan. Data akan hilang permanen.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(author.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Ya, Hapus
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
