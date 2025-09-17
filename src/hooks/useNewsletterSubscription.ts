'use client';

import { useState, useEffect } from 'react';

export function useNewsletterSubscription() {
  const [subscribed, setSubscribed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Set loaded state on component mount (no localStorage persistence)
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Set subscription status temporarily (no localStorage persistence)
  const setSubscribedStatus = (status: boolean) => {
    setSubscribed(status);
    
    // Auto-reset the subscription status after 5 seconds to show the form again
    if (status === true) {
      setTimeout(() => {
        setSubscribed(false);
      }, 5000);
    }
  };

  return { subscribed, setSubscribed: setSubscribedStatus, isLoaded };
}