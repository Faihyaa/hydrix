import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  Wifi, 
  Activity, 
  Bell, 
  BarChart3, 
  Smartphone, 
  Shield,
  Droplets,
  AlertTriangle,
  Calendar
} from 'lucide-react';
import { sendFloodEmail } from "../utils/email";

export default function Home() {
  const testEmail = async () => {
    const fakeUser = {
      name: "Test User",
      email: "nurfaizah.or@gmail.com",
    } as any;

    await sendFloodEmail("warn", fakeUser);

    console.log("Email sent");
  };

  return (
    <div>
      <h1>Home Page</h1>

      <button onClick={testEmail}>
        Test EmailJS
      </button>
    </div>
  );
}

