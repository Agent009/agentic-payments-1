"use client";

import { useState } from "react";

import type { User } from "next-auth";
import { toast } from "sonner";

import { updateProfile } from "@actions/user";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { Label } from "@ui/label";

type ProfileFormProps = {
  user: User;
};

export function ProfileForm({ user }: ProfileFormProps) {
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [image, setImage] = useState(user.image || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({ name, email, image });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          type="email"
        />
      </div>
      <div>
        <Label htmlFor="image">Profile Picture URL</Label>
        <Input
          id="image"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="https://example.com/your-image.jpg"
        />
      </div>
      <Button type="submit">Update Profile</Button>
    </form>
  );
}
