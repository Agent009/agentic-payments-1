"use client";

import { useState } from "react";

import { toast } from "sonner";

import { updateUserSettings } from "@actions/user";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { Label } from "@ui/label";
import { Switch } from "@ui/switch";

export function SettingsForm() {
  const [name, setName] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUserSettings({ name, emailNotifications, darkMode });
      toast.success("Settings updated successfully");
    } catch (error) {
      console.error("Failed to update settings", error);
      toast.error("Failed to update settings");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="emailNotifications">Email Notifications</Label>
        <Switch id="emailNotifications" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="darkMode">Dark Mode</Label>
        <Switch id="darkMode" checked={darkMode} onCheckedChange={setDarkMode} />
      </div>
      <Button type="submit">Save Settings</Button>
    </form>
  );
}
