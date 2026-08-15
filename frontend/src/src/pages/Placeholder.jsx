import React from 'react';

export default function PlaceholderPage({ title, icon, description }) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{icon} {title}</h1>
      <p className="text-gray-500 mt-2">{description}</p>
      <div className="mt-8 p-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 text-center">
        <p className="text-gray-400">This feature is being developed</p>
        <p className="text-sm text-gray-400 mt-2">Check back soon for updates</p>
      </div>
    </div>
  );
}
