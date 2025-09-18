import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { SiteDetails } from "./SiteDetails";

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
  onAddSite: (site: Site) => void;
  onUpdateSite: (site: Site) => void;
}> = ({ sites, onAddSite, onUpdateSite }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [form, setForm] = useState({
    name: "",
    client: "",
    location: "",
    description: "",
  });
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddSite = () => {
    if (!form.name || !form.client || !form.location) return;
    onAddSite({
      id: Date.now().toString(),
      ...form,
      items: [],
    });
    setForm({ name: "", client: "", location: "", description: "" });
    setShowDialog(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Sites</h2>
        <Button onClick={() => setShowDialog(true)}>Add Site</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sites.map(site => (
          <Card
            key={site.id}
            className="p-4 cursor-pointer hover:shadow-lg transition"
            onClick={() => setSelectedSite(site)}
          >
            <div className="font-semibold text-lg">{site.name}</div>
            <div className="text-sm text-muted-foreground">Client: {site.client}</div>
            <div className="text-sm text-muted-foreground">Location: {site.location}</div>
          </Card>
        ))}
      </div>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>Add New Site</DialogHeader>
          <input
            className="border rounded px-2 py-1 w-full mb-2"
            name="name"
            placeholder="Site Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            className="border rounded px-2 py-1 w-full mb-2"
            name="client"
            placeholder="Client"
            value={form.client}
            onChange={handleChange}
            required
          />
          <input
            className="border rounded px-2 py-1 w-full mb-2"
            name="location"
            placeholder="Site Location"
            value={form.location}
            onChange={handleChange}
            required
          />
          <textarea
            className="border rounded px-2 py-1 w-full mb-2"
            name="description"
            placeholder="Project Description"
            value={form.description}
            onChange={handleChange}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSite}>Add Site</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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