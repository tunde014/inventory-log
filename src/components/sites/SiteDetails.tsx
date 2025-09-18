import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Site } from "./SitesPage";

export function SiteDetails({
  site,
  onClose,
  onUpdateSite,
}: {
  site: Site;
  onClose: () => void;
  onUpdateSite: (site: Site) => void;
}) {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: site.name,
    client: site.client,
    location: site.location,
    description: site.description,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onUpdateSite({ ...site, ...form });
    setEditMode(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          {editMode ? "Edit Site" : `Site: ${site.name}`}
        </DialogHeader>
        {editMode ? (
          <>
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
              <Button variant="outline" onClick={() => setEditMode(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <Card className="mb-4 p-4">
              <div className="font-bold text-lg">{site.name}</div>
              <div>Client: {site.client}</div>
              <div>Location: {site.location}</div>
              <div>Description: {site.description}</div>
            </Card>
            <div className="mb-4">
              <span className="font-medium">Materials on Site:</span>
              <ul className="ml-4 list-disc">
                {site.items.length === 0 && <li>No materials yet.</li>}
                {site.items.map(item => (
                  <li key={item.assetId}>
                    {item.assetName} (Qty: {item.quantity})
                  </li>
                ))}
              </ul>
            </div>
            <DialogFooter>
              <Button onClick={() => setEditMode(true)}>Edit Site</Button>
              <Button onClick={handlePrint}>Generate Report</Button>
              <Button variant="outline" onClick={onClose}>Close</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}