"use client";

import React from "react";

export default function PortfolioCard({ item }: any) {
  return (
    <div className="p-4 bg-white rounded shadow hover:shadow-lg transition">
      <h3 className="font-bold text-lg">{item.title}</h3>
      <p className="text-sm text-gray-500">{item.description}</p>
      {item.image && <img src={item.image} alt={item.title} className="mt-2 w-full rounded" />}
    </div>
  );
}