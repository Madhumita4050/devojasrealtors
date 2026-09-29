import React from 'react';
import BookingForms from '../BookingForms';

// Admin / Accounts view — can see all forms, approve, reject, delete
const AdminBookingForms = () => <BookingForms isAdmin={true} />;

export default AdminBookingForms;
