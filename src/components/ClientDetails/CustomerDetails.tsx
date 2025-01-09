// components/CustomerDetails.tsx
import React from 'react';
import { Avatar } from 'primereact/avatar';

interface ClientDetailsProps {
  firstName: string;
  lastName: string;
  email: string;
}

const CustomerDetails: React.FC<ClientDetailsProps> = ({ firstName, lastName, email }) => {
  return (
    <div>
      <div className="flex align-items-center">
        <Avatar label={`${firstName[0]}${lastName[0]}`} size="large" style={{ backgroundColor: '#2196F3', color: '#ffffff' }} shape="circle" />
        <div className="ml-4">
          <div className="text-2xl font-bold">{firstName} {lastName}</div>
          <div className="text-xl text-500">{email}</div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
