
import React from 'react';
// Assuming we have a User type, let's define a basic one for now.
// We will replace this with the actual type from our data layer later.
type User = {
  avatar_url: string;
  name: string;
  country_flag: string; // URL or code for the flag image
  stars: number;
  custom_status: string;
  role?: string; // For special frames/decorations
};

const UserCard = ({ user }: { user: User }) => {
  return (
    <div className="relative mb-2 flex w-full items-center rounded-lg border border-gray-200 bg-white p-2 shadow-sm">
      {/* Optional color bar based on role or status */}
      {/* <div className="absolute top-0 left-0 h-1 w-full rounded-t-lg bg-green-500"></div> */}

      {/* Avatar */}
      <div className="relative mr-4">
        <img
          src={user.avatar_url || '/default-avatar.png'} // Provide a fallback avatar
          alt={`${user.name}'s avatar`}
          className="h-16 w-16 rounded-md object-cover"
        />
        {/* Decorative frame can be added here based on user.role */}
      </div>

      {/* User Info */}
      <div className="flex-grow">
        <h3 className="text-lg font-bold">{user.name}</h3>
        {/* Stars */}
        <div className="flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={i < user.stars ? 'text-yellow-400' : 'text-gray-300'}>
              ★
            </span>
          ))}
        </div>
        {/* Status Message */}
        <p className="text-sm text-gray-500">{user.custom_status}</p>
      </div>

      {/* Country Flag */}
      <div className="ml-4">
        {user.country_flag && (
          <img
            src={`/flags/${user.country_flag}.svg`} // Assuming flags are in public/flags
            alt="Country flag"
            className="h-6 w-6"
          />
        )}
      </div>
    </div>
  );
};

export default UserCard;
