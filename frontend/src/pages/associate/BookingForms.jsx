import React from 'react';
import BookingForms from '../BookingForms';

// Associate view — can create, edit, delete their own (pending only)
const AssociateBookingForms = () => <BookingForms isAdmin={false} />;

export default AssociateBookingForms;
