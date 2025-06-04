import { supabase } from './supabase';

interface Location {
  lat: number;
  lng: number;
}

interface ListingData {
  food_type: string;
  location: Location;
  price: number;
  quantity: number;
}

export async function createListing(data: ListingData) {
  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/marketplace`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create listing');
  }

  return response.json();
}

export async function getListings() {
  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/marketplace`,
    {
      headers: {
        'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch listings');
  }

  return response.json();
}