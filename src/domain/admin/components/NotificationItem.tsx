// Notification Item component
export function NotificationItem({ notification }: { notification: any }) {
  return (
    <div
      className={`p-3 rounded-lg ${!notification.read ? "bg-blue-50 border border-blue-100" : "bg-gray-50 border"}`}
    >
      <div className="flex justify-between">
        <h3 className="text-sm font-medium">{notification.title}</h3>
        <span className="text-xs text-gray-500">
          {new Date(notification.date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
      <p className="mt-1 text-xs text-gray-600 line-clamp-2">
        {notification.message}
      </p>
      {!notification.read && (
        <span className="inline-block mt-1 text-xs text-blue-600">New</span>
      )}
    </div>
  );
}
