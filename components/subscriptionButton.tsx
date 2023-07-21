"use client";

import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Button } from "./ui/button";
import { Zap } from "lucide-react";

const SubscriptionButton = ({ isPro }: { isPro: boolean }) => {
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    try {
      setLoading(true);

      const response = await axios.get('/api/stripe');

      // redirect to the stripe page
      window.location.href = response.data.url;

    } catch (error) {
      toast.error("Something went wrong with the stripe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={
        isPro
          ? "default"
          : "premium"
      }
      disabled={loading}
      onClick={onClick}
    >
      {isPro ? "Manage Subscription" : "Upgrade"}

      {!isPro && <Zap className="w-4 h-4 ml-2 fill-white" />}
    </Button>
  )
}

export default SubscriptionButton