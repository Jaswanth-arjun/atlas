import React from "react";

export default function EventFeed({ events }) {
  return (
    <div className="card h-72 overflow-auto">
      <h2 className="font-semibold mb-2">Crisis Alerts / Event Feed</h2>
      <ul className="space-y-1 text-sm">
        {events.map((event, index) => (
          <li key={index} className="text-rose-300">
            • {event}
          </li>
        ))}
      </ul>
    </div>
  );
}
