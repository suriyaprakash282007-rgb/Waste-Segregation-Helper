import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    categories: [
      { id: 'wet_waste',  label: 'Wet Waste',        emoji: '🥬', color: '#2ecc71', bin: 'Green Bin' },
      { id: 'dry_waste',  label: 'Dry Waste',         emoji: '🗑️', color: '#3498db', bin: 'Blue Bin'  },
      { id: 'recyclable', label: 'Recyclable Waste',  emoji: '♻️', color: '#f39c12', bin: 'Yellow Bin'},
      { id: 'e_waste',    label: 'E-Waste',           emoji: '📱', color: '#e74c3c', bin: 'Red Bin'   },
    ],
  });
}
