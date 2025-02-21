
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const RoleManagement = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Gestion des Rôles</h2>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Utilisateur</CardTitle>
            <CardDescription>Accès de base à l'application</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Badge>Créer des tickets</Badge>
            <Badge>Voir ses tickets</Badge>
            <Badge>Commenter ses tickets</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Technicien</CardTitle>
            <CardDescription>Gestion des tickets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Badge>Voir tous les tickets</Badge>
            <Badge>Assigner des tickets</Badge>
            <Badge>Résoudre des tickets</Badge>
            <Badge>Commenter tous les tickets</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Administrateur</CardTitle>
            <CardDescription>Accès complet</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Badge>Gérer les utilisateurs</Badge>
            <Badge>Gérer les rôles</Badge>
            <Badge>Configurer l'application</Badge>
            <Badge>Accès aux statistiques</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RoleManagement;
