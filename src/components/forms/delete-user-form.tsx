"use client";

import { deleteUser } from "@/actions/users";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { User } from "@/generated/prisma";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

interface DeleteUserFormsProps {
  user: User;
}

export default function DeleteUserForms({ user }: DeleteUserFormsProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="mr-2 h-4 w-4" />
          Deletar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Deletar Usuário
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Tem certeza que deseja deletar o usuário {user.name || user.email}? Esta ação é irreversível.
        </DialogDescription>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
        </DialogFooter>
        <Button variant="destructive" onClick={() => deleteUser(user.id)}>
          Deletar
        </Button>
      </DialogContent>
    </Dialog>
  );
}
