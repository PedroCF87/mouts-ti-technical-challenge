"use client";
import React from "react";
import { List, ListItem, ListItemText, Box, Button } from "@mui/material";
import Link from "next/link";
import { User } from "@/types/user";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface UserListProps {
  users: User[];
  onDelete?: (id: string) => void;
}

export default function UserList({ users, onDelete }: UserListProps) {
  return (
    <List>
      {users.map((user) => (
        <ListItem
          key={user.id}
          divider
          secondaryAction={
            <Box sx={{ display: "flex", gap: 1 }}>
              <Link href={`/users/edit?edit=${user.id}`} passHref>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  startIcon={<EditIcon />}
                >
                  Editar
                </Button>
              </Link>
              <Button
                variant="outlined"
                color="error"
                size="small"
                startIcon={<DeleteIcon />}
                onClick={() => onDelete && onDelete(user.id)}
              >
                Deletar
              </Button>
            </Box>
          }
        >
          <ListItemText primary={user.name} secondary={user.email} />
        </ListItem>
      ))}
    </List>
  );
}
