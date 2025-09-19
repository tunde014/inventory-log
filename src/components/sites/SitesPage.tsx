import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SiteDetails } from "./SiteDetails";
import { SiteItemsDialog } from "./SiteItemsDialog";
import { Package, Edit, Trash2 } from "lucide-react";
import { Waybill } from "@/types/asset";

export interface Site {
  id: string;
  name: string;
  client: string;
  location: string;
  description: string;
  items: { assetId: string; assetName: string; quantity: number }[];
}

export const SitesPage: React.FC<{
  sites: Site[];
  waybills: Waybill[];
  onAddSite: (site: Site) => void;
  onUpdateSite: (site: Site) => void;
  onDeleteSite: (siteId: string) => void;
  onCreateReturnWaybill: (siteId: string, items: any[]) => void;
}> = ({ sites, waybills, onAddSite, onUpdateSite, onDeleteSite, onCreateReturnWaybill }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [form, setForm] = useState({
    name: "",
    client: "",
    location: "",
    description: "",
  });
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [editingSite, setEditingSite] = useState<Site | null>(null);
  const [deletingSite, setDeletingSite] = useState<Site | null>(null);
  const [showItemsDialog, setShowItemsDialog] = useState<Site | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.name || !form.client || !form.location) return;
    
    if (editingSite) {
      onUpdateSite({
        ...editingSite,
        ...form,
      });
      setEditingSite(null);
    } else {
      onAddSite({
        id: Date.now().toString(),
        ...form,
        items: [],
      });
    }
    
    setForm({ name: "", client: "", location: "", description: "" });
    setShowDialog(false);
  };

  const handleEdit = (site: Site) => {
    setEditingSite(site);
    setForm({
      name: site.name,
      client: site.client,
      location: site.location,
      description: site.description,
    });
    setShowDialog(true);
  };

  const handleDelete = (site: Site) => {
    setDeletingSite(site);
  };

  const confirmDelete = () => {
    if (deletingSite) {
      onDeleteSite(deletingSite.id);
      setDeletingSite(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Sites</h2>
        <Button onClick={() => setShowDialog(true)}>Add Site</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sites.map(site => (
          <Card key={site.id} className="p-4">
            <div className="space-y-3">
              <div>
                <div className="font-semibold text-lg">{site.name}</div>
                <div className="text-sm text-muted-foreground">Client: {site.client}</div>
                <div className="text-sm text-muted-foreground">Location: {site.location}</div>
                {site.description && (
                  <div className="text-sm text-muted-foreground mt-1">{site.description}</div>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setShowItemsDialog(site)}
                >
                  <Package className="h-4 w-4 mr-1" />
                  Items on Site
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleEdit(site)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleDelete(site)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <Dialog open={showDialog} onOpenChange={(open) => {
        setShowDialog(open);
        if (!open) {
          setEditingSite(null);
          setForm({ name: "", client: "", location: "", description: "" });
        }
      }}>
        <DialogContent>
          <DialogHeader>{editingSite ? "Edit Site" : "Add New Site"}</DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="siteName">Site Name *</Label>
              <Input
                id="siteName"
                name="name"
                placeholder="Site Name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="client">Client *</Label>
              <Input
                id="client"
                name="client"
                placeholder="Client"
                value={form.client}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="location">Site Location *</Label>
              <Input
                id="location"
                name="location"
                placeholder="Site Location"
                value={form.location}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Project Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Project Description"
                value={form.description}
                onChange={handleChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingSite ? "Save Changes" : "Add Site"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingSite} onOpenChange={() => setDeletingSite(null)}>
        <DialogContent>
          <DialogHeader>
            Are you sure you want to delete "{deletingSite?.name}"?
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingSite(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Yes, Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Site Items Dialog */}
      {showItemsDialog && (
        <SiteItemsDialog
          site={showItemsDialog}
          waybills={waybills}
          isOpen={!!showItemsDialog}
          onClose={() => setShowItemsDialog(null)}
          onCreateReturnWaybill={onCreateReturnWaybill}
        />
      )}
      {selectedSite && (
        <SiteDetails
          site={selectedSite}
          onClose={() => setSelectedSite(null)}
          onUpdateSite={onUpdateSite}
        />
      )}
    </div>
  );
};